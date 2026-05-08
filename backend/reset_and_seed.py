# backend/reset_and_seed.py
from database import engine, SessionLocal
import models

def reset_and_seed():
    db = SessionLocal()
    try:
        print("1. Eski veriler temizleniyor (Geçmiş alarmlar ve loglar siliniyor)...")
        db.query(models.PerformanceLog).delete()
        db.query(models.AlarmRecord).delete()
        db.query(models.Patient).delete()
        db.query(models.Nurse).delete()
        db.commit()

        print("2. 4. Kat hemşireleri sisteme ekleniyor...")
        # Hemşirelerin bazılarını MÜSAİT, bazılarını sunum gerçekçiliği için MEŞGUL yapıyoruz
        nurses_data = [
            {"wristband_id": "BW-401", "full_name": "Ayşe Yılmaz", "status": "MÜSAİT"},
            {"wristband_id": "BW-402", "full_name": "Fatma Demir", "status": "MÜSAİT"},
            {"wristband_id": "BW-403", "full_name": "Zeynep Çelik", "status": "MÜSAİT"}, 
            {"wristband_id": "BW-404", "full_name": "Merve Şahin", "status": "MÜSAİT"},
            {"wristband_id": "BW-405", "full_name": "Elif Kaya", "status": "MÜSAİT"}
        ]

        for nd in nurses_data:
            nurse = models.Nurse(**nd)
            db.add(nurse)
        
        db.commit()
        print("\n✅ ŞAHANE! Veritabanı tamamen sıfırlandı ve 4. Kat sunuma hazır!")
    except Exception as e:
        print(f"Hata oluştu: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed()