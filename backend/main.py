import json
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from services.filter_service import VitalFilter
from database import engine, Base, get_db
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VitalGuard IoT Backend")

class SensorData(BaseModel):
    device_id: str
    heart_rate: int
    spo2: int

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
vital_filter = VitalFilter(window_size=3)
mock_nurses = ["Hemşire Ayşe", "Hemşire Fatma", "Hemşire Mehmet"]

@app.websocket("/ws/alarms")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# BURASI GÜNCELLENDİ: Veritabanı (db) bağlantısı içeri alındı
@app.post("/api/sensor-data")
async def receive_sensor_data(data: SensorData, db: Session = Depends(get_db)):
    is_crisis = vital_filter.process_data(data.device_id, data.heart_rate, data.spo2)
    
    if is_crisis:
        selected_nurse = random.choice(mock_nurses)
        
        # 1. VERİTABANINA KAYIT İŞLEMİ (YENİ)
        yeni_alarm = models.AlarmRecord(
            device_id=data.device_id,
            status="Aktif Kriz",
            assigned_nurse=selected_nurse
        )
        db.add(yeni_alarm) # Veriyi ekle
        db.commit()        # İşlemi onayla (Kaydet)
        db.refresh(yeni_alarm) # Veritabanının atadığı ID ve Zaman Damgasını geri çek
        
        # 2. Arayüze (Frontend) Gönderilecek Mesaj
        alarm_msg = {
            "alarm_id": yeni_alarm.id, # Artık resmi bir ID'si var!
            "device_id": data.device_id,
            "status": "CRISIS",
            "assigned_nurse": selected_nurse,
            "timestamp": str(yeni_alarm.created_at), # Ne zaman oluştu?
            "message": f"ACİL: {data.device_id} nolu cihazda kriz saptandı!"
        }
        await manager.broadcast(json.dumps(alarm_msg))
        return {"status": "Alarm Tetiklendi ve Kaydedildi", "nurse": selected_nurse, "db_id": yeni_alarm.id}
    
    return {"status": "Processed", "crisis": False}
from datetime import datetime, timezone

# 1. Frontend için "Aktif Krizleri Listeleme" Kapısı
@app.get("/api/alarms/active")
def get_active_alarms(db: Session = Depends(get_db)):
    # Veritabanına git ve sadece "Aktif Kriz" olanları getir
    aktif_alarmlar = db.query(models.AlarmRecord).filter(models.AlarmRecord.status == "Aktif Kriz").all()
    return aktif_alarmlar

# 2. Hemşirenin Odaya Ulaşıp NFC Okutmasını Simüle Eden Kapı
@app.post("/api/alarms/resolve/{alarm_id}")
async def resolve_alarm(alarm_id: int, db: Session = Depends(get_db)):
    # Veritabanından o spesifik alarmı bul
    alarm = db.query(models.AlarmRecord).filter(models.AlarmRecord.id == alarm_id).first()
    
    if not alarm:
        return {"error": "Böyle bir alarm bulunamadı!"}
    
    if alarm.status == "Çözüldü":
        return {"message": "Bu alarm zaten çözülmüş."}

    # Alarmı kapat ve bitiş zamanını (şu anki zaman) kaydet
    alarm.status = "Çözüldü"
    alarm.resolved_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(alarm)
    
    # Makale için kritik hesaplama: Müdahale Süresi
    fark = alarm.resolved_at - alarm.created_at
    mudahale_suresi_sn = fark.total_seconds()
    
    # Kapanma bilgisini WebSocket üzerinden Frontend'e de fırlat (Haritayı yeşile çevirsin)
    kapanis_mesaji = {
        "alarm_id": alarm.id,
        "status": "RESOLVED",
        "message": f"{alarm.device_id} nolu cihazdaki kriz çözüldü. Süre: {mudahale_suresi_sn:.2f} saniye"
    }
    await manager.broadcast(json.dumps(kapanis_mesaji))
    
    return {
        "status": "Başarılı", 
        "message": "Alarm çözüldü olarak işaretlendi.",
        "mudahale_suresi_saniye": round(mudahale_suresi_sn, 2)
    }