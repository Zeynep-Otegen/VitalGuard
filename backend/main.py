import json
from datetime import datetime, timezone
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# Senin özel modülün aynen kalıyor
from services.filter_service import VitalFilter
from database import engine, Base, get_db
import models
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VitalGuard IoT Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Şemaları ---
class SensorData(BaseModel):
    device_id: str
    heart_rate: int
    spo2: int

class WristbandData(BaseModel):
    wristband_id: str
    battery: int
    signal: int
    location_x: float
    location_y: float

# --- WebSocket Yöneticisi ---
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

# Senin yazdığın filtre sınıfını başlatıyoruz
vital_filter = VitalFilter(window_size=3)

@app.websocket("/ws/alarms")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)


# ==========================================
# GÜNCELLENMİŞ API ENDPOINT'LERİ
# ==========================================

# 1. Hasta Başı Sensörlerinden Veri Alma (Kriz Tespiti)
@app.post("/api/sensor-data")
async def receive_sensor_data(data: SensorData, db: Session = Depends(get_db)):
    is_crisis = vital_filter.process_data(data.device_id, data.heart_rate, data.spo2)
    
    if is_crisis:
        # Zaten aktif bir alarm var mı? (Yeni veritabanı formatıyla: "AKTİF")
        existing_alarm = db.query(models.AlarmRecord).filter(
            models.AlarmRecord.device_id == data.device_id,
            models.AlarmRecord.status == "AKTİF"
        ).first()

        if existing_alarm:
            return {"status": "Zaten Aktif Kriz Var", "device_id": data.device_id}

        # Mock listeyi sildik! Artık GERÇEK veritabanından müsait hemşire buluyoruz
        available_nurse = db.query(models.Nurse).filter(models.Nurse.status == "MÜSAİT").first()
        nurse_id = available_nurse.id if available_nurse else None
        nurse_name = available_nurse.full_name if available_nurse else "Bekleniyor..."

        # Yeni Kriz Kaydı Oluştur
        yeni_alarm = models.AlarmRecord(
            device_id=data.device_id,
            status="AKTİF",
            assigned_nurse_id=nurse_id
        )
        db.add(yeni_alarm)
        
        # Eğer hemşire atandıysa, durumunu MEŞGUL yap ki başkası atanmasın
        if available_nurse:
            available_nurse.status = "MEŞGUL"
            
        db.commit()
        db.refresh(yeni_alarm)
        
        alarm_msg = {
            "alarm_id": yeni_alarm.id,
            "device_id": data.device_id,
            "status": "CRISIS",
            "assigned_nurse": nurse_name,
            "timestamp": str(yeni_alarm.created_at),
            "message": f"ACİL: {data.device_id} nolu cihazda kriz saptandı!"
        }
        await manager.broadcast(json.dumps(alarm_msg))
        return {"status": "Alarm Tetiklendi", "nurse": nurse_name}
    
    return {"status": "Normal", "crisis": False}

# 2. Frontend için "Aktif Krizleri Listeleme" (Çift yazılan fonksiyon düzeltildi)
@app.get("/api/alarms/active")
def get_active_alarms(db: Session = Depends(get_db)):
    alarms = db.query(models.AlarmRecord).filter(models.AlarmRecord.status == "AKTİF").all()
    result = []
    for a in alarms:
        nurse = db.query(models.Nurse).filter(models.Nurse.id == a.assigned_nurse_id).first()
        result.append({
            "id": a.id,
            "device_id": a.device_id,
            "status": a.status,
            "assigned_nurse": nurse.full_name if nurse else "Atanıyor...",
            "timestamp": a.created_at.isoformat() if a.created_at else None
        })
    return result

# 3. Alarm Çözme ve Performans Kaydı Alma
@app.post("/api/alarms/resolve/{alarm_id}")
async def resolve_alarm(alarm_id: int, db: Session = Depends(get_db)):
    alarm = db.query(models.AlarmRecord).filter(models.AlarmRecord.id == alarm_id).first()
    
    if not alarm:
        return {"error": "Böyle bir alarm bulunamadı!"}
    
    if alarm.status == "ÇÖZÜLDÜ":
        return {"message": "Bu alarm zaten çözülmüş."}

    # Alarmı kapat ve zamanı kaydet
    alarm.status = "ÇÖZÜLDÜ"
    alarm.resolved_at = datetime.now(timezone.utc)
    
    # Süre Farkı (T2 - T0) - Senin hesaplama mantığını korudum
    fark = alarm.resolved_at - alarm.created_at
    mudahale_suresi_sn = fark.total_seconds()
    
    # YENİ: Performans Tablosuna Kaydet
    perf_log = models.PerformanceLog(
        alarm_id=alarm.id,
        room_number=alarm.device_id,
        response_time_seconds=round(mudahale_suresi_sn, 2),
        efficiency_status="Başarılı" if mudahale_suresi_sn <= 5.0 else "Gecikmeli"
    )
    db.add(perf_log)

    # Hemşireyi tekrar MÜSAİT yap
    if alarm.assigned_nurse_id:
        nurse = db.query(models.Nurse).filter(models.Nurse.id == alarm.assigned_nurse_id).first()
        if nurse:
            nurse.status = "MÜSAİT"

    db.commit()
    db.refresh(alarm)
    
    kapanis_mesaji = {
        "alarm_id": alarm.id,
        "status": "RESOLVED",
        "message": f"{alarm.device_id} çözüldü. Süre: {mudahale_suresi_sn:.2f}s"
    }
    await manager.broadcast(json.dumps(kapanis_mesaji))
    
    return {
        "status": "Başarılı", 
        "mudahale_suresi_saniye": round(mudahale_suresi_sn, 2)
    }

# 4. Hemşire Bileklik Verisi Güncelleme (Merve İçin)
@app.post("/api/nurse-status")
async def update_nurse_status(data: WristbandData, db: Session = Depends(get_db)):
    nurse = db.query(models.Nurse).filter(models.Nurse.wristband_id == data.wristband_id).first()
    if nurse:
        nurse.battery_level = data.battery
        nurse.signal_strength = data.signal
        nurse.location_x = data.location_x
        nurse.location_y = data.location_y
        db.commit()
        return {"status": "Konum Güncellendi"}
    return {"status": "Hemşire Bulunamadı"}

# 5. Frontend İçin Tüm Hemşire Listesini Çekme
@app.get("/api/nurses")
async def get_all_nurses(db: Session = Depends(get_db)):
    nurses = db.query(models.Nurse).all()
    return nurses
# 6. Performans Loglarını Çekme (Makalenin Veri Kaynağı)
@app.get("/api/performance-logs")
async def get_performance_logs(db: Session = Depends(get_db)):
    # Logları en yeniden en eskiye doğru (descending) sıralayarak çekiyoruz
    logs = db.query(models.PerformanceLog).order_by(models.PerformanceLog.created_at.desc()).all()
    
    # Frontend'de rahat kullanabilmek için veriyi biraz şekillendiriyoruz
    result = []
    for log in logs:
        result.append({
            "id": f"#VG-{log.id + 9800}", # Görseldeki gibi havalı bir ID formatı (VG-9801 vb.)
            "timestamp": log.created_at.strftime("%d %b, %H:%M:%S") if log.created_at else "Bilinmiyor",
            "device": log.room_number,
            "severity": "KRİTİK", # Bizim sistemimiz şu an hep kritik krizleri logluyor
            "response_time": log.response_time_seconds,
            "status": log.efficiency_status
        })
    return result