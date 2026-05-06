import csv
import random
import os
from datetime import datetime

# Senin yazdığın o harika filtreyi import ediyoruz
from services.filter_service import VitalFilter

def export_filtered_data_to_csv():
    # 1. Arkadaşının CSV dosyasını beklediği klasörün yolunu belirliyoruz
    # Backend klasöründen bir üst klasöre (..) çıkıp 'psimulation' klasörüne giriyoruz
    export_dir = os.path.join("..", "psimulation", "data_exports")
    
    # Eğer alt klasör yoksa, Python bizim için otomatik oluştursun
    os.makedirs(export_dir, exist_ok=True)
    
    # Dosyanın tam adı ve yolu
    filepath = os.path.join(export_dir, "filtered_vitals.csv")
    
    # Sistemin kalbi: Senin filtren
    vital_filter = VitalFilter(window_size=3)
    cihazlar = ["Oda-401", "Oda-402", "Oda-403", "Oda-404", "Oda-405", "Oda-406"]
    
    kriz_verileri = []
    
    print("SimPy için ham veriler üretiliyor ve senin filtrenden geçiriliyor...")
    
    # Simülasyon için 500 adet rastgele sensör verisi üretelim
    for _ in range(500):
        cihaz = random.choice(cihazlar)
        hr = random.randint(70, 145)   # Hem normal hem kriz nabızları
        spo2 = random.randint(85, 99)  # Hem normal hem kriz oksijenleri
        
        # BÜYÜ BURADA GERÇEKLEŞİYOR: Veri asılsız mı, gerçek kriz mi?
        is_crisis = vital_filter.process_data(cihaz, hr, spo2)
        
        # Sadece algoritmanın "Bu gerçek bir kriz!" dediklerini listeye alıyoruz
        if is_crisis:
            zaman = datetime.now().strftime("%H:%M:%S.%f")[:-3] # Milisaniye hassasiyetinde zaman
            kriz_verileri.append([zaman, cihaz, hr, spo2, "KRİTİK ONAYLANDI"])
    
    # 2. Listeye aldığımız bu temiz verileri CSV (Excel) formatında kaydediyoruz
    with open(filepath, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Sütun Başlıkları
        writer.writerow(["Zaman_Damgasi", "Cihaz_ID", "Kalp_Atisi", "SpO2", "Durum"]) 
        # Veriler
        writer.writerows(kriz_verileri)
        
    print(f"\n✅ İŞLEM TAMAM! {len(kriz_verileri)} adet %100 filtrelenmiş gerçek kriz verisi arkadaşın için hazır.")
    print(f"Dosya Konumu: {filepath}")

if __name__ == "__main__":
    export_filtered_data_to_csv()