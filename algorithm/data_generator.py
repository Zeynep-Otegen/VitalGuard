import pandas as pd
import random
from datetime import datetime, timedelta

def generate_vital_data(num_records=1000):
    data = []
    current_time = datetime.now()
    devices = ["MAC-001", "MAC-002", "MAC-003", "MAC-004", "MAC-005"]

    # Her cihaz için krizin kaç adım (saniye) daha süreceğini takip eden sözlük
    crisis_counters = {dev: 0 for dev in devices}

    for _ in range(num_records):
        device_id = random.choice(devices)
        current_time += timedelta(seconds=random.randint(1, 3))
        timestamp = current_time.strftime("%Y-%m-%d %H:%M:%S")
        
        # 1. Eğer bu cihaz halihazırda bir krizin içindeyse, krizi sürdür
        if crisis_counters[device_id] > 0:
            heart_rate = random.randint(121, 150) # Nabız hala yüksek
            spo2 = random.randint(85, 89)         # Oksijen hala düşük
            status = "Sustained_Crisis"           # Sürdürülen gerçek kriz
            label = 1
            crisis_counters[device_id] -= 1       # Kriz sayacını bir azalt
            
        # 2. Cihaz krizde değilse yeni durum belirle
        else:
            scenario_chance = random.random()
            
            if scenario_chance < 0.70:
                # NORMAL DURUM
                heart_rate = random.randint(60, 100)
                spo2 = random.randint(95, 100)
                status = "Normal"
                label = 0 
                
            elif scenario_chance < 0.85:
                # GEÇİCİ SIÇRAMA (Transient Spike) - Hasta kolunu oynattı
                # Değerler anlık olarak eşiği geçer ama SADECE 1 KEZ olur
                heart_rate = random.randint(121, 130) 
                spo2 = random.randint(91, 94)
                status = "Transient_Spike"
                label = 0 
                
            else:
                # GERÇEK KRİZ BAŞLANGICI
                heart_rate = random.randint(121, 150)
                spo2 = random.randint(85, 89)
                status = "Crisis_Start"
                label = 1
                # Krizin art arda 3 ile 6 ölçüm boyunca devam etmesini sağla
                crisis_counters[device_id] = random.randint(3, 6) 

        data.append([device_id, timestamp, heart_rate, spo2, status, label])

    df = pd.DataFrame(data, columns=["Device_ID", "Timestamp", "Heart_Rate", "SpO2", "Condition", "Is_Crisis"])
    return df

if __name__ == "__main__":
    print("Sentetik sensör verileri üretiliyor...")
    synthetic_df = generate_vital_data(1000)
    file_name = "synthetic_sensor_data.csv"
    synthetic_df.to_csv(file_name, index=False)
    print(f"Başarılı! Veriler '{file_name}' dosyasına kaydedildi.")