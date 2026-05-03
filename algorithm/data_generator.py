import requests
import time
import random

# Hastalar (Odalar)
CIHAZLAR = ["Oda-401", "Oda-402", "Oda-403", "Oda-408", "Oda-203", "Oda-312"]
# Hemşire Bileklikleri (Neon'daki ID'ler)
HEMSIRELER = ["BW-1042", "BW-1055", "BW-1021", "BW-1099"]

def start_live_simulation():
    print("Gelişmiş simülasyon başlıyor...")
    while True:
        # Rastgele bir cihaz seç ve ona 5 saniye boyunca veri gönder
        secilen_cihaz = random.choice(CIHAZLAR)
        is_crisis_moment = random.random() < 0.3 # %30 ihtimalle bu cihaz kriz çıkarsın
        
        print(f"\n--- {secilen_cihaz} izleniyor ---")
        
        for _ in range(5): # Seçilen cihaz için 5 saniye kesintisiz veri yolla
            if is_crisis_moment:
                hr = random.randint(125, 140)
                spo2 = random.randint(88, 91)
            else:
                hr = random.randint(70, 90)
                spo2 = random.randint(96, 99)

            sample_data = {"device_id": secilen_cihaz, "heart_rate": hr, "spo2": spo2}
            
            try:
                # 1. HASTABAŞI MONİTÖRÜ: Veriyi gönder
                response = requests.post("http://localhost:8000/api/sensor-data", json=sample_data)
                res_json = response.json()
                
                # Backend'in yeni formatına göre kriz kontrolü
                if res_json.get("status") == "Alarm Tetiklendi":
                    print(f"!!! KRİZ ONAYLANDI VE ATAMA YAPILDI: {secilen_cihaz} !!!")
                elif res_json.get("status") == "Zaten Aktif Kriz Var":
                    print(f"(! Zaten krizde olan oda: {secilen_cihaz} !)")
                else:
                    print(f"Veri Gönderildi: {hr} BPM | %{spo2} SpO2")
                
                # 2. HEMŞİRE BİLEKLİKLERİ: Arka planda sessizce konum/pil güncelle
                # (Merve'nin algoritması için veritabanını canlı tutuyoruz)
                for h_id in HEMSIRELER:
                    nurse_data = {
                        "wristband_id": h_id,
                        "battery": random.randint(20, 100),
                        "signal": random.randint(-90, -30),
                        "location_x": round(random.uniform(0, 100), 2),
                        "location_y": round(random.uniform(0, 100), 2)
                    }
                    requests.post("http://localhost:8000/api/nurse-status", json=nurse_data)

            except Exception as e:
                print("Sunucuya ulaşılamadı!")
            
            time.sleep(1)

if __name__ == "__main__":
    start_live_simulation()