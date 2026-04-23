import pandas as pd

def filter_vital_data(input_file="synthetic_sensor_data.csv", output_file="filtered_crisis_alarms.csv"):
    print(f"Gümrük Memuru (Akıllı Zaman Filtresi) '{input_file}' dosyasını okuyor...")
    
    try:
        # 1. Veriyi Oku ve Zamana Göre Sırala
        df = pd.read_csv(input_file)
        df['Timestamp'] = pd.to_datetime(df['Timestamp'])
        
        # Her cihazın verisi kendi içinde kronolojik sıraya konur
        df = df.sort_values(by=['Device_ID', 'Timestamp'])
        
        total_records = len(df)
        print(f"Toplam {total_records} sensör kaydı zaman serisi ile inceleniyor...\n")
        
        # 2. Anlık (Instantaneous) Eşik Kontrolü
        # WHO Sınırları: Nabız > 120 veya SpO2 < 90 durumu anlık olarak test edilir
        df['Anlik_Kriz'] = (df['Heart_Rate'] > 120) | (df['SpO2'] < 90)
        
        # 3. ZAMAN PENCERESİ (Rolling Window) KONTROLÜ
        # Kural: Anlık bir krizin alarm üretebilmesi için ART ARDA 3 KEZ (window=3) gerçekleşmesi gerekir.
        window_size = 3
        
        # Her bir cihazı kendi içinde grupla ve anlık krizlerin hareketli toplamını (rolling sum) al
        df['Kriz_Skoru'] = df.groupby('Device_ID')['Anlik_Kriz'].transform(
            lambda x: x.rolling(window=window_size, min_periods=1).sum()
        )
        
        # Eğer Kriz_Skoru 3'e ulaştıysa, bu durum geçici bir sıçrama (transient spike) değildir.
        # En az 3 ölçüm periyodu boyunca devam eden GERÇEK bir krizdir.
        crisis_condition = df['Kriz_Skoru'] >= window_size
        
        # Sadece onaylanmış gerçek kriz satırlarını yeni bir tabloya al
        filtered_df = df[crisis_condition].copy()
        
        # Analiz için kullandığımız geçici sütunları temizle
        filtered_df = filtered_df.drop(columns=['Anlik_Kriz', 'Kriz_Skoru'])
        
        # 4. Sonuçları Kaydet
        filtered_records = len(filtered_df)
        filtered_df.to_csv(output_file, index=False)
        
        # 5. Raporlama
        eliminated_records = total_records - filtered_records
        print("-" * 50)
        print("🎯 ZAMAN PENCERESİ (ROLLING WINDOW) RAPORU")
        print("-" * 50)
        print(f"Toplam Gelen Ham Veri: {total_records}")
        print(f"Elenen Asılsız Alarm ve Geçici Sıçramalar: {eliminated_records}")
        print(f"Onaylanan Kesintisiz Krizler (OMNeT++'a Gidecek): {filtered_records}")
        print("-" * 50)
        print(f"Başarılı! Uçtan uca filtrelenmiş veriler '{output_file}' olarak kaydedildi.")
        
    except FileNotFoundError:
        print(f"Hata: '{input_file}' dosyası bulunamadı. Lütfen önce data_generator.py dosyasını çalıştırın.")

if __name__ == "__main__":
    filter_vital_data()