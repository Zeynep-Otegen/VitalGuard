# backend/test_db.py
from database import SessionLocal
import models

def test_connection():
    print("Veritabanına bağlanılıyor...")
    db = SessionLocal()
    
    try:
        # Hemşireleri Çek
        nurses = db.query(models.Nurse).all()
        print(f"\n--- {len(nurses)} HEMŞİRE BULUNDU ---")
        for n in nurses:
            print(f"[{n.wristband_id}] {n.full_name} | Durum: {n.status} | Pil: %{n.battery_level} | Konum: ({n.location_x}, {n.location_y})")
            
        # Alarmları Çek
        alarms = db.query(models.AlarmRecord).all()
        print(f"\n--- {len(alarms)} ALARM BULUNDU ---")
        for a in alarms:
            print(f"Alarm ID: {a.id} | Oda: {a.device_id} | Atanan Hemşire ID: {a.assigned_nurse_id}")
            
    except Exception as e:
        print(f"HATA OLUŞTU: Modeller ve Veritabanı uyuşmuyor!\nDetay: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_connection()