import pandas as pd
import random
from datetime import datetime, timedelta

def generate_vital_data(num_records=500):
    data = []
    
    # Başlangıç zamanı 
    current_time = datetime.now()
    
    # 5 farklı hayali cihaz/yatak MAC adresi
    devices = ["MAC-001", "MAC-002", "MAC-003", "MAC-004", "MAC-005"]

    for _ in range(num_records):
        device_id = random.choice(devices)
        # Her bir kayıt arası 1 ile 5 saniye fark (sensör ping hızı)
        current_time += timedelta(seconds=random.randint(1, 5))
        timestamp = current_time.strftime("%Y-%m-%d %H:%M:%S")
        
        # Senaryo belirleme (%70 Normal, %15 Gürültü, %15 Kriz)
        scenario_chance = random.random()
        
        if scenario_chance < 0.70:
            # NORMAL DURUM
            heart_rate = random.randint(60, 100)
            spo2 = random.randint(95, 100)
            label = 0 # 0: Normal
            status = "Normal"
            
        elif scenario_chance < 0.85:
            # SENSÖR GÜRÜLTÜSÜ (Asılsız Alarm) - Filtremizin eleyeceği kısım
            # SpO2 anlık düşer veya Nabız sınıra yaklaşır ama kriz değildir
            heart_rate = random.randint(101, 115) 
            spo2 = random.randint(91, 94)
            label = 0 # 0: Hala Normal kabul ediliyor (Filtrelenecek)
            status = "Noise"
            
        else:
            # GERÇEK KRİZ (Acil Durum) - OMNeT++'a gidecek kısım
            # Taşikardi veya ciddi Hipoksi
            if random.choice([True, False]):
                heart_rate = random.randint(121, 160) # Yüksek Nabız
                spo2 = random.randint(90, 95)
            else:
                heart_rate = random.randint(70, 110)
                spo2 = random.randint(75, 89) # Düşük Oksijen
                
            label = 1 # 1: Kriz!
            status = "Crisis"

        data.append([device_id, timestamp, heart_rate, spo2, status, label])

    # Veriyi Pandas DataFrame'ine dönüştür
    df = pd.DataFrame(data, columns=["Device_ID", "Timestamp", "Heart_Rate", "SpO2", "Condition", "Is_Crisis"])
    
    return df

if __name__ == "__main__":
    print("Sentetik sensör verileri üretiliyor...")
    
    # 1000 satırlık veri seti oluştur
    synthetic_df = generate_vital_data(1000)
    
    # Veriyi algoritma klasörüne CSV olarak kaydet
    file_name = "synthetic_sensor_data.csv"
    synthetic_df.to_csv(file_name, index=False)
    
    print(f"Başarılı! Veriler '{file_name}' dosyasına kaydedildi.")
    print("\nVeri Seti Önizlemesi (İlk 5 Satır):")
    print(synthetic_df.head())