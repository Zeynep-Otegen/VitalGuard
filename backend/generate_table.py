import matplotlib.pyplot as plt

# ==========================================================
# 1. TABLO VERİSİ (İNGİLİZCE)
# ==========================================================
columns = [
    "Test Scenario", 
    "Input Data\n(200ms Interval)", 
    "Expected Behavior", 
    "System Response\n(Log Output)", 
    "Result"
]

table_data = [
    [
        "1: False Alarm Spike", 
        "2x Crisis Data\n(HR:135, SpO2:88%)", 
        "Wait, do not\ntrigger alarm.", 
        "Status: Normal\n(No Alarm)", 
        "Passed"
    ],
    [
        "2: Sensor Correction", 
        "1x Normal Data\n(HR:80, SpO2:98%)", 
        "Reset filter\nmemory.", 
        "Status: Normal\n(Filter Reset)", 
        "Passed"
    ],
    [
        "3: Real Emergency", 
        "3x Crisis Data\n(HR:140, SpO2:85%)", 
        "Validate data and\ntrigger alarm.", 
        "Status: Alarm Triggered", 
        "Passed"
    ]
]

# ==========================================================
# 2. GÖRSEL OLUŞTURMA VE STİL AYARLARI (SİYAH-BEYAZ)
# ==========================================================
# Başlık olmadığı için yüksekliği biraz kıstık (3.0 yaptık)
fig, ax = plt.subplots(figsize=(12, 3.0))

# Eksenleri gizle
ax.axis("off")
ax.axis("tight")

# Tabloyu çiz
table = ax.table(
    cellText=table_data, 
    colLabels=columns, 
    loc="center", 
    cellLoc="center"
)

# Yazı tipi ve hücre boyutları
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1, 3.5) # Satır yüksekliği

# Hücreleri formatla: Tamamen Beyaz Arka Plan ve Siyah Çizgiler/Yazılar
for (row, col), cell in table.get_celld().items():
    cell.set_facecolor("white")       # Arka plan bembeyaz
    cell.set_edgecolor("black")       # Kenarlıklar siyah
    cell.set_text_props(color="black") # Yazı rengi siyah
    
    # Başlık satırını (row == 0) ve Result sütununu (col == 4) okunaklılık için sadece "kalın (bold)" yapıyoruz
    if row == 0:
        cell.set_text_props(weight="bold", color="black")
    elif col == 4 and row > 0:
        cell.set_text_props(weight="bold", color="black")

# ==========================================================
# 3. DIŞA AKTARMA (KAYDETME)
# ==========================================================
plt.tight_layout()
plt.savefig("10_vitalfilter_test_results_bw.png", dpi=300, bbox_inches="tight")
plt.close()

print("Tablo başarıyla saf siyah-beyaz olarak '10_vitalfilter_test_results_bw.png' adıyla kaydedildi!")