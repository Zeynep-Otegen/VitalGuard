import random
from pathlib import Path

import pandas as pd
import simpy


# ==========================================================
# 1. DOSYA YOLLARI VE TEMEL AYARLAR
# ==========================================================
# Bu dosya şu konumda çalışır:
# psimulation/simulation/main.py
#
# BASE_DIR değişkeni psimulation klasörünü temsil eder.
# Böylece CSV ve sonuç dosyalarına göreli yol ile ulaşabiliriz.
BASE_DIR = Path(__file__).resolve().parent.parent

# Filtrelenmiş kritik alarm verilerinin bulunduğu CSV dosyası
CSV_PATH = BASE_DIR / "data_exports" / "filtered_vitals.csv"

# Simülasyon sonuçlarının kaydedileceği klasör
RESULTS_PATH = BASE_DIR / "results"


# ==========================================================
# 2. HEMŞİRE MODELİ
# ==========================================================
class Nurse:
    """
    Simülasyonda her hemşireyi temsil eden sınıf.

    nurse_id: Hemşire kimliği
    floor: Hemşirenin sabit görev katı
    position: Hemşirenin kattaki anlık koridor pozisyonu
    route: Hemşirenin kendi katında boşta gezerken takip edeceği rota
    available: Hemşirenin müsait olup olmadığını gösterir
    active_tasks: Hemşirenin aktif görev sayısı
    """

    def __init__(self, nurse_id, floor, position, route=None):
        self.nurse_id = nurse_id
        self.floor = floor
        self.position = position
        self.available = True
        self.active_tasks = 0

        # Hemşire sadece kendi katında hareket eder.
        # Bu listedeki sayılar kattaki koridor pozisyonlarını temsil eder.
        self.route = route if route is not None else [1, 2, 3, 4, 5, 6, 5, 4, 3, 2]

        # Hemşirenin rotada hangi noktada olduğunu tutar.
        self.route_index = 0


# ==========================================================
# 3. ODA BİLGİSİNDEN KAT VE POZİSYON ÇIKARMA
# ==========================================================
def extract_floor(device_id):
    """
    Cihaz_ID içinden kat bilgisini çıkarır.

    Örnek:
    Oda-404 -> 4. kat
    Oda-305 -> 3. kat
    Oda-201 -> 2. kat
    """
    room_number = str(device_id).split("-")[1]
    return int(room_number[0])


def extract_room_position(device_id):
    """
    Cihaz_ID içinden odanın koridor pozisyonunu çıkarır.

    Örnek:
    Oda-404 -> 4
    Oda-405 -> 5
    Oda-401 -> 1

    Bu simülasyonda oda numarasının son iki hanesi,
    odanın kattaki basit konumu olarak kabul edilmiştir.
    """
    room_number = str(device_id).split("-")[1]
    return int(room_number[-2:])


def calculate_distance(nurse, room_position):
    """
    Hemşire ile hasta odası arasındaki basit mesafeyi hesaplar.

    Gerçek hastane haritası olmadığı için burada tek boyutlu
    koridor modeli kullanılmıştır.
    """
    return abs(nurse.position - room_position)

def nurse_movement_process(env, nurse):
    """
    Hemşirenin boşta olduğu zamanlarda kendi katındaki koridorda hareket etmesini sağlar.

    Hemşire sadece kendi katında hareket eder.
    Kat değiştirmez.
    Görevdeyken hareket etmez.
    """
    while True:
        if nurse.available:
            # Rotadaki bir sonraki koridor pozisyonu alınır.
            next_position = nurse.route[nurse.route_index]

            # Mevcut pozisyon ile hedef pozisyon arasındaki hareket süresi hesaplanır.
            move_time = abs(nurse.position - next_position) * 2

            # Aynı pozisyondaysa minimum 1 saniye bekletilir.
            move_time = max(1, move_time)

            # Hemşirenin o noktaya gitmesi simüle edilir.
            yield env.timeout(move_time)

            # Hareket tamamlanınca hemşirenin anlık pozisyonu güncellenir.
            nurse.position = next_position

            #print(
    #f"[ZAMAN {env.now:.1f}] {nurse.nurse_id} "
    #f"{nurse.floor}. katta pozisyon {nurse.position} konumuna geçti."
   #)

            # Rotadaki bir sonraki noktaya geçilir.
            nurse.route_index = (nurse.route_index + 1) % len(nurse.route)

        else:
            # Hemşire görevdeyse kendi koridor devriyesini durdurur.
            yield env.timeout(1)


# ==========================================================
# 4. KAT BAZLI İZOLASYON VE HEMŞİRE FİLTRELEME
# ==========================================================
def filter_nurses_by_floor(alarm, nurses):
    """
    Kat bazlı izolasyon fonksiyonu.

    Alarm hangi kattan geldiyse sadece o katta görevli
    hemşireleri aday listesine alır.
    """
    return [
        nurse for nurse in nurses
        if nurse.floor == alarm["floor"]
    ]


def filter_available_nurses(nurses):
    """
    Müsaitlik kontrolü.

    Aday hemşireler arasından o anda başka bir görevde
    olmayan hemşireleri seçer.
    """
    return [
        nurse for nurse in nurses
        if nurse.available
    ]


def select_nearest_nurse(alarm, nurses):
    """
    En yakın hemşire seçimi.

    Verilen hemşire listesi içerisinden hastanın odasına
    en yakın hemşireyi seçer.
    """
    if not nurses:
        return None

    return min(
        nurses,
        key=lambda nurse: calculate_distance(nurse, alarm["room_position"])
        + nurse.active_tasks * 5
    )


# ==========================================================
# 5. BASELINE ALGORİTMASI
# ==========================================================
def select_baseline_nurse(alarm, nurses):
    """
    Baseline algoritma, karşılaştırma amacıyla kullanılan basit sistemdir.

    Bu algoritmada:
    - Kat bazlı izolasyon uygulanmaz.
    - En yakın hemşire seçimi yapılmaz.
    - Tüm müsait hemşireler aday kabul edilir.
    - Rastgele bir hemşire seçilir.

    Bu yöntem klasik/kontrolsüz alarm yönlendirme yaklaşımını temsil eder.
    """
    available_nurses = filter_available_nurses(nurses)

    if not available_nurses:
        return None, 0

    selected_nurse = random.choice(available_nurses)

    # Baseline senaryoda alarm tüm müsait hemşirelere bildirim gitmiş gibi sayılır.
    # Bu metrik alarm yorgunluğunu karşılaştırmak için kullanılır.
    notification_count = len(available_nurses)

    return selected_nurse, notification_count


# ==========================================================
# 6. SMART ALGORİTMA
# ==========================================================
def select_smart_nurse(alarm, nurses):
    """
    Önerilen smart algoritma.

    Çalışma sırası:
    1. Kat bazlı izolasyon uygulanır.
    2. Sadece alarmın geldiği kattaki hemşireler aday olur.
    3. Bu hemşireler arasından müsait olanlar seçilir.
    4. Hastaya en yakın hemşire belirlenir.

    Bu yapı gereksiz bildirimleri azaltmayı ve alarm yorgunluğunu
    düşürmeyi hedefler.
    """
    same_floor_nurses = filter_nurses_by_floor(alarm, nurses)
    available_same_floor_nurses = filter_available_nurses(same_floor_nurses)

    if not available_same_floor_nurses:
        return None, 0

    selected_nurse = select_nearest_nurse(alarm, available_same_floor_nurses)

    # Smart senaryoda sadece aynı kattaki müsait hemşirelere bildirim gider.
    notification_count = len(available_same_floor_nurses)

    return selected_nurse, notification_count


def select_nurse_by_mode(alarm, nurses, mode):
    """
    Simülasyonun hangi algoritmayla çalışacağını belirler.

    mode = "baseline" -> klasik karşılaştırma algoritması
    mode = "smart"    -> önerilen kat bazlı akıllı algoritma
    """
    if mode == "baseline":
        return select_baseline_nurse(alarm, nurses)

    if mode == "smart":
        return select_smart_nurse(alarm, nurses)

    raise ValueError(f"Bilinmeyen algoritma modu: {mode}")


# ==========================================================
# 7. SİMPY ALARM SÜRECİ
# ==========================================================
def handle_alarm(env, alarm, nurses, results, mode, intervention_time_range=(60, 180)):
    """
    Her alarm için çalışan SimPy sürecidir.

    Bu süreç şunları simüle eder:
    - Alarmın simülasyon zamanında oluşması
    - Uygun hemşirenin seçilmesi
    - Hemşire yoksa belirli aralıklarla tekrar denenmesi
    - Bildirim, kabul, odaya ulaşma ve müdahale sürelerinin hesaplanması
    - Sonucun kayıt altına alınması
    """
    # Alarmın kendi simülasyon zamanına kadar beklenir.
    yield env.timeout(alarm["sim_time"] - env.now)

    # Seçilen algoritmaya göre hemşire atanır.
    selected_nurse, notification_count = select_nurse_by_mode(alarm, nurses, mode)

    waited_time = 0
    max_wait_time = 120
    retry_interval = 5

    # Eğer o anda hemşire yoksa alarm hemen silinmez.
    # Sistem belirli aralıklarla tekrar müsait hemşire arar.
    while selected_nurse is None and waited_time < max_wait_time:
        yield env.timeout(retry_interval)
        waited_time += retry_interval
        selected_nurse, notification_count = select_nurse_by_mode(alarm, nurses, mode)

    # Maksimum bekleme süresi sonunda hâlâ hemşire yoksa alarm atanamamış sayılır.
    if selected_nurse is None:
        results.append({
            "alarm_id": alarm["alarm_id"],
            "algorithm": mode,
            "alarm_time": round(alarm["sim_time"], 2),
            "device_id": alarm["device_id"],
            "floor": alarm["floor"],
            "heart_rate": alarm["heart_rate"],
            "spo2": alarm["spo2"],
            "status": "no_available_nurse",
            "selected_nurse": None,
            "notification_count": notification_count,
            "waiting_time": waited_time,
            "response_time": None,
            "intervention_time": None,
            "completed_at": None
        })
        return

    # Hemşirenin alarm atandığı andaki pozisyonu kaydedilir.
    nurse_position_at_assignment = selected_nurse.position
    distance_at_assignment = calculate_distance(selected_nurse, alarm["room_position"])

     # Hemşire görevi aldığı anda meşgul yapılır.
    selected_nurse.available = False
    selected_nurse.active_tasks += 1

     # Gerçek sistemdeki küçük gecikmeler rastgele değerlerle modellenir.
    notification_delay = random.uniform(2, 5)
    accept_delay = random.uniform(5, 15)
    travel_time = distance_at_assignment * 2
    intervention_time = random.uniform(
    intervention_time_range[0],
    intervention_time_range[1]
)

    # Müdahale başlangıç süresi:
    # bekleme + bildirim + kabul + odaya ulaşma
    response_time = waited_time + notification_delay + accept_delay + travel_time

    # Bildirim ve kabul süresi beklenir.
    yield env.timeout(notification_delay + accept_delay)

     # Hemşire hasta odasına doğru gider.
    yield env.timeout(travel_time)

     # Hemşire artık hasta odasına ulaşmıştır.
     # Kat değişmez; çünkü smart algoritmada zaten aynı kattaki hemşire atanır.
    selected_nurse.position = alarm["room_position"]

     # Müdahale süresi boyunca hemşire meşgul kalır.
    yield env.timeout(intervention_time)

     # Görev bitince hemşire tekrar müsait hale gelir.
     # Hemşire bulunduğu hasta odası pozisyonundan devriyeye devam eder.
    selected_nurse.available = True
    selected_nurse.active_tasks -= 1

    # Başarılı alarm kaydı tutulur.
    results.append({
    "alarm_id": alarm["alarm_id"],
    "algorithm": mode,
    "alarm_time": round(alarm["sim_time"], 2),
    "device_id": alarm["device_id"],
    "floor": alarm["floor"],6
    "room_position": alarm["room_position"],
    "heart_rate": alarm["heart_rate"],
    "spo2": alarm["spo2"],
    "status": "completed",
    "selected_nurse": selected_nurse.nurse_id,
    "nurse_position_at_assignment": nurse_position_at_assignment,
    "distance_at_assignment": distance_at_assignment,
    "notification_count": notification_count,
    "waiting_time": round(waited_time, 2),
    "response_time": round(response_time, 2),
    "intervention_time": round(intervention_time, 2),
    "completed_at": round(env.now, 2)
})


# ==========================================================
# 8. CSV VERİSİNİ SİMÜLASYONA HAZIRLAMA
# ==========================================================
def load_alarms(alarm_interval=20):
    """
    Filtrelenmiş kritik alarm CSV dosyasını okur.

    Orijinal CSV'deki alarm değerleri korunur.
    Ancak simülasyon senaryosu için alarmlar 2, 3 ve 4. katlara
    dengeli şekilde dağıtılır.

    Yeni model:
    - 3 kat: 2, 3, 4
    - Her katta 6 oda: 1, 2, 3, 4, 5, 6
    """
    df = pd.read_csv(CSV_PATH)

    df["alarm_id"] = range(1, len(df) + 1)

    # Simülasyon senaryosu için kullanılan katlar ve oda pozisyonları
    floors = [2, 3, 4]
    room_positions = [1, 2, 3, 4, 5, 6]

    # Alarmlar katlara dengeli dağıtılır.
    # Örnek:
    # 1. alarm -> 2. kat
    # 2. alarm -> 3. kat
    # 3. alarm -> 4. kat
    df["floor"] = [
        floors[i % len(floors)]
        for i in range(len(df))
    ]

    # Oda pozisyonu her 3 alarmda bir ilerler.
    # Böylece her katta 1-6 arası tüm odalar kullanılır.
    df["room_position"] = [
        room_positions[(i // len(floors)) % len(room_positions)]
        for i in range(len(df))
    ]

    # Yeni simülasyon oda kimliği oluşturulur.
    # Örnek: floor=2, room_position=4 -> Oda-204
    df["sim_device_id"] = df.apply(
        lambda row: f"Oda-{int(row['floor'])}{int(row['room_position']):02d}",
        axis=1
    )

    # CSV'deki zamanlar birbirine çok yakın olduğu için,
    # simülasyonda alarmlar 20 saniye arayla verilmiştir.
    df["sim_time"] = df.index * alarm_interval

    alarms = []

    for _, row in df.iterrows():
        alarms.append({
            "alarm_id": int(row["alarm_id"]),
            "sim_time": float(row["sim_time"]),
            "device_id": row["sim_device_id"],
            "floor": int(row["floor"]),
            "room_position": int(row["room_position"]),
            "heart_rate": int(row["Kalp_Atisi"]),
            "spo2": int(row["SpO2"]),
            "condition": row["Durum"]
        })

    return alarms
# ==========================================================
# 9. HEMŞİRELERİ OLUŞTURMA
# ==========================================================
def create_nurses():
    """
    Simülasyonda kullanılacak hemşireleri oluşturur.

    Yeni model:
    - 3 kat vardır: 2, 3 ve 4. kat
    - Her katta 4 hemşire vardır
    - Her katta 6 oda pozisyonu vardır
    - Hemşireler sadece kendi katlarında hareket eder
    """
    return [
        # 4. kat hemşireleri
        Nurse("Hemsire-4A", floor=4, position=1),
        Nurse("Hemsire-4B", floor=4, position=2),
        Nurse("Hemsire-4C", floor=4, position=4),
        Nurse("Hemsire-4D", floor=4, position=6),

        # 3. kat hemşireleri
        Nurse("Hemsire-3A", floor=3, position=1),
        Nurse("Hemsire-3B", floor=3, position=2),
        Nurse("Hemsire-3C", floor=3, position=4),
        Nurse("Hemsire-3D", floor=3, position=6),

        # 2. kat hemşireleri
        Nurse("Hemsire-2A", floor=2, position=1),
        Nurse("Hemsire-2B", floor=2, position=2),
        Nurse("Hemsire-2C", floor=2, position=4),
        Nurse("Hemsire-2D", floor=2, position=6),
    ]

def test_nurse_movement():
    """
    Sadece hemşire hareketlerini test eder.
    Alarm simülasyonu çalışmaz.
    """
    env = simpy.Environment()
    nurses = create_nurses()

    for nurse in nurses:
        env.process(nurse_movement_process(env, nurse))

    print("\nHemşire hareket testi başladı.\n")

    env.run(until=30)

    print("\nHemşire hareket testi bitti.\n")


# ==========================================================
# 10. SİMÜLASYON SONUÇLARINI ÖZETLEME
# ==========================================================
def print_summary(results_df, total_alarm_count):
    """
    Simülasyon sonunda temel performans metriklerini terminale yazdırır.
    """
    print("\nSimülasyon tamamlandı.")
    print(f"Toplam alarm sayısı: {total_alarm_count}")

    completed = results_df[results_df["status"] == "completed"]
    no_nurse = results_df[results_df["status"] == "no_available_nurse"]

    print(f"Tamamlanan alarm sayısı: {len(completed)}")
    print(f"Müsait hemşire bulunamayan alarm sayısı: {len(no_nurse)}")

    success_rate = (len(completed) / total_alarm_count) * 100
    fail_rate = (len(no_nurse) / total_alarm_count) * 100

    print(f"Başarı oranı: %{success_rate:.2f}")
    print(f"Atanamayan alarm oranı: %{fail_rate:.2f}")

    total_notifications = results_df["notification_count"].sum()
    average_notifications = results_df["notification_count"].mean()

    print(f"Toplam gönderilen bildirim sayısı: {total_notifications}")
    print(f"Alarm başına ortalama bildirim sayısı: {average_notifications:.2f}")

    if not completed.empty:
        print(f"Ortalama müdahale başlangıç süresi: {completed['response_time'].mean():.2f} saniye")
        print(f"En hızlı müdahale başlangıcı: {completed['response_time'].min():.2f} saniye")
        print(f"En yavaş müdahale başlangıcı: {completed['response_time'].max():.2f} saniye")
        print(f"Ortalama bekleme süresi: {completed['waiting_time'].mean():.2f} saniye")

        nurse_task_counts = completed["selected_nurse"].value_counts()
        print("\nHemşire görev dağılımı:")
        print(nurse_task_counts)

        print("\nKat bazlı alarm durumları:")
    print(results_df.groupby(["floor", "status"]).size())


# ==========================================================
# 11. SİMÜLASYONU ÇALIŞTIRMA
# ==========================================================
def run_simulation(
    mode,
    seed=42,
    scenario_name="normal_load",
    alarm_interval=20,
    intervention_time_range=(60, 180)
):
    """
    Belirtilen algoritma moduna göre simülasyonu çalıştırır.

    mode:
    - baseline
    - smart
    """
    random.seed(seed)
    RESULTS_PATH.mkdir(parents=True, exist_ok=True)

    env = simpy.Environment()
    nurses = create_nurses()
    alarms = load_alarms(alarm_interval=alarm_interval)
    results = []

  # Her hemşire için ayrı bir SimPy hareket süreci başlatılır.
    for nurse in nurses:
     env.process(nurse_movement_process(env, nurse))

# Her alarm için ayrı bir SimPy süreci başlatılır.
    for alarm in alarms:
     env.process(
        handle_alarm(
            env,
            alarm,
            nurses,
            results,
            mode,
            intervention_time_range
        )
    )

    # Tüm olaylar tamamlanana kadar simülasyon çalışır.
    simulation_end_time = max(alarm["sim_time"] for alarm in alarms) + 500
    env.run(until=simulation_end_time)

    results_df = pd.DataFrame(results)
    results_df = results_df.sort_values("alarm_id")

    # Her algoritma için ayrı sonuç dosyası oluşturulur.
    scenario_results_path = RESULTS_PATH / f"{scenario_name}_{mode}_simulation_results.csv"
    results_df.to_csv(scenario_results_path, index=False)

    print(f"\nÇalışan algoritma: {mode}")
    print(f"Sonuç dosyası: {scenario_results_path}")

    print_summary(results_df, total_alarm_count=len(alarms))


# ==========================================================

# 12. PROGRAMIN BAŞLANGIÇ NOKTASI
# ==========================================================
if __name__ == "__main__":
    # Normal yük testi
    run_simulation(
        mode="baseline",
        seed=42,
        scenario_name="normal_load",
        alarm_interval=20
    )

    run_simulation(
        mode="smart",
        seed=42,
        scenario_name="normal_load",
        alarm_interval=20
    )

    # Yoğun yük testi
    run_simulation(
        mode="baseline",
        seed=42,
        scenario_name="high_load",
        alarm_interval=10
    )

    run_simulation(
        mode="smart",
        seed=42,
        scenario_name="high_load",
        alarm_interval=10
    )
        # Eskalasyon testi
    run_simulation(
        mode="baseline",
        seed=42,
        scenario_name="escalation_test",
        alarm_interval=5,
        intervention_time_range=(180, 300)
    )

    run_simulation(
        mode="smart",
        seed=42,
        scenario_name="escalation_test",
        alarm_interval=5,
        intervention_time_range=(180, 300)
    )