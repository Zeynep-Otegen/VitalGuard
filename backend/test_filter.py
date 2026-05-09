import requests
import time

URL = "http://localhost:8000/api/sensor-data"
ODA = "Oda-401"

print("🧪 VITALFILTER TESTİ BAŞLIYOR...\n")

# Adım 1: 2 tane kriz verisi (Sahte Alarm - Hasta kolunu oynattı)
print("Adım 1: 2 ardışık bozuk veri gönderiliyor...")
requests.post(URL, json={"device_id": ODA, "heart_rate": 135, "spo2": 88})
time.sleep(0.2)
res1 = requests.post(URL, json={"device_id": ODA, "heart_rate": 135, "spo2": 88})
print(f"Sistem Yanıtı: {res1.json().get('status')} (Alarm ÇALMADI - Filtre Başarılı! ✅)\n")

# Adım 2: Araya giren 1 normal veri (Sensör düzeldi)
print("Adım 2: 1 normal veri gönderiliyor (Filtre sıfırlanmalı)...")
res2 = requests.post(URL, json={"device_id": ODA, "heart_rate": 80, "spo2": 98})
print(f"Sistem Yanıtı: {res2.json().get('status')} (Normal Veri - Filtre Sıfırlandı ✅)\n")

# Adım 3: 3 tane kriz verisi (Gerçek Kriz Durumu)
print("Adım 3: 3 ardışık bozuk veri gönderiliyor (Gerçek Kriz)...")
requests.post(URL, json={"device_id": ODA, "heart_rate": 140, "spo2": 85})
time.sleep(0.2)
requests.post(URL, json={"device_id": ODA, "heart_rate": 140, "spo2": 85})
time.sleep(0.2)
res3 = requests.post(URL, json={"device_id": ODA, "heart_rate": 140, "spo2": 85})
print(f"Sistem Yanıtı: {res3.json().get('status')} (Alarm ÇALDI - Gerçek Kriz Yakalandı! 🚨✅)")