import requests
import time
import random

# SADECE 4. KAT CİHAZLARI VE HEMŞİRELERİ
CIHAZLAR = ["Oda-401", "Oda-402", "Oda-403", "Oda-404", "Oda-405", "Oda-406"]
HEMSIRELER = ["BW-401", "BW-402", "BW-403", "BW-404", "BW-405"]

def start_live_simulation():
    print("🏥 4. Kat Simülasyonu Başlatıldı...")
    print("Veri akışı 5 saniyelik aralıklarla sağlanacak.\n")
    
    while True:
        secilen_cihaz = random.choice(CIHAZLAR)
        # Kriz ihtimalini %70 yapıldı
        is_crisis_moment = random.random() < 0.95
        
        print(f"--- {secilen_cihaz} izleniyor ---")
        
        for _ in range(3): # Seçilen cihaz için 1 saniye kesintisiz veri yolla
            if is_crisis_moment:
                hr = random.randint(125, 140)
                spo2 = random.randint(88, 91)
            else:
                hr = random.randint(70, 90)
                spo2 = random.randint(96, 99)

            sample_data = {"device_id": secilen_cihaz, "heart_rate": hr, "spo2": spo2}
            
            try:
                # 1. Hastabaşı Monitörü Verisi
                response = requests.post("http://localhost:8000/api/sensor-data", json=sample_data)
                res_json = response.json()
                
                if res_json.get("status") == "Alarm Tetiklendi":
                    print(f"🚨 KRİZ TESPİT EDİLDİ: {secilen_cihaz} | Atanan Hemşire: {res_json.get('nurse')}")
                elif res_json.get("status") == "Zaten Aktif Kriz Var":
                    pass # Konsolu kirletmemek için zaten aktifse sessiz kalıyoruz
                else:
                    print(f"Veri: {hr} BPM | %{spo2} SpO2")
                
                # 2. Hemşire Konumları Arka Planda Güncelleniyor
                for h_id in HEMSIRELER:
                    nurse_data = {
                        "wristband_id": h_id,
                        "battery": random.randint(70, 100),
                        "signal": random.randint(-85, -40),
                        "location_x": round(random.uniform(0, 100), 2),
                        "location_y": round(random.uniform(0, 100), 2)
                    }
                    requests.post("http://localhost:8000/api/nurse-status", json=nurse_data)

            except Exception as e:
                print("Sunucuya ulaşılamadı! FastAPI çalışıyor mu?")
            
            time.sleep(0.2) # Saniyede 0.5 veri gönderir
        
        # ANLATIM İÇİN 1 SANİYE MOLA
        print("⏳ Ağ dinleniyor, 1 saniye sonra diğer odaya geçilecek...\n")
        time.sleep(1)

if __name__ == "__main__":
    start_live_simulation()