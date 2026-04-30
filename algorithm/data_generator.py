import requests
import time
import random

def start_live_simulation():
    print("Canlı simülasyon başlıyor... Veriler backend'e gönderiliyor.")
    while True:
        # Rastgele test verisi üretimi (Sanki koldaki bir cihazdan geliyormuş gibi)
        sample_data = {
            "device_id": "MAC-001",
            "heart_rate": random.randint(110, 130), # Kriz yaratmak için limitleri zorluyoruz
            "spo2": random.randint(85, 95)
        }
        
        try:
            # Backend'in açtığı API kapısına (POST) veriyi yolla
            response = requests.post("http://localhost:8000/api/sensor-data", json=sample_data)
            print(f"Gönderildi: {sample_data} | Backend Yanıtı: {response.json()}")
        except Exception as e:
            print(f"Hata: Backend'e ulaşılamadı. Detay: {e}")
            
        time.sleep(1) # 1 saniye bekle (1 Hz frekans)

if __name__ == "__main__":
    start_live_simulation()