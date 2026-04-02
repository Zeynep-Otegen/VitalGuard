import pandas as pd

def filter_vital_data(input_file="synthetic_sensor_data.csv", output_file="filtered_crisis_alarms.csv"):
    print(f"Gümrük Memuru (Filtre) '{input_file}' dosyasını okuyor...")
    
    try:
        # 1. Veriyi Oku
        df = pd.read_csv(input_file)
        
        # 2. Toplam veri sayısını göster
        total_records = len(df)
        print(f"Toplam {total_records} sensör kaydı inceleniyor...\n")
        
        # 3. FİLTRELEME MANTIĞI (Tıbbi Eşik Değerleri)
        # Kural: Nabız 120'den büyükse VEYA SpO2 90'dan küçükse bu GERÇEK bir krizdir!
        # Diğer her şey (Normal veya 92'ye düşmüş Gürültü) çöpe atılacak.
        
        crisis_condition = (df['Heart_Rate'] > 120) | (df['SpO2'] < 90)
        
        # Sadece kriz şartını sağlayan satırları yeni bir tabloya al
        filtered_df = df[crisis_condition]
        
        # 4. Sonuçları Kaydet
        filtered_records = len(filtered_df)
        filtered_df.to_csv(output_file, index=False)
        
        # 5. Raporlama
        eliminated_records = total_records - filtered_records
        print("-" * 40)
        print("🎯 FİLTRELEME RAPORU")
        print("-" * 40)
        print(f"Elenen Asılsız Alarm (Gürültü/Normal): {eliminated_records}")
        print(f"Onaylanan Gerçek Kriz (OMNeT++'a Gidecek): {filtered_records}")
        print("-" * 40)
        print(f"Başarılı! Temizlenmiş kriz verileri '{output_file}' olarak kaydedildi.")
        
    except FileNotFoundError:
        print(f"Hata: '{input_file}' dosyası bulunamadı. Lütfen önce data_generator.py dosyasını çalıştırın.")

if __name__ == "__main__":
    # Filtreyi çalıştır
    filter_vital_data()