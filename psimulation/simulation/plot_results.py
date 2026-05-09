from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt


# ==========================================================
# 1. DOSYA YOLLARI
# ==========================================================
BASE_DIR = Path(__file__).resolve().parent.parent
RESULTS_PATH = BASE_DIR / "results"

# Normal yük ana karşılaştırma grafikleri için ayrı klasör
PLOTS_PATH = RESULTS_PATH / "normal_comparison_plots"

BASELINE_CSV = RESULTS_PATH / "baseline_simulation_results.csv"
SMART_CSV = RESULTS_PATH / "smart_simulation_results.csv"


# ==========================================================
# 2. SONUÇLARI OKUMA
# ==========================================================
def load_results():
    baseline_df = pd.read_csv(BASELINE_CSV)
    smart_df = pd.read_csv(SMART_CSV)
    return baseline_df, smart_df


# ==========================================================
# 3. METRİK HESAPLAMA
# ==========================================================
def calculate_metrics(df):
    total_alarm = len(df)

    completed = df[df["status"] == "completed"]
    no_nurse = df[df["status"] == "no_available_nurse"]

    completed_count = len(completed)
    no_nurse_count = len(no_nurse)

    success_rate = (completed_count / total_alarm) * 100 if total_alarm > 0 else 0

    total_notifications = df["notification_count"].sum()
    avg_notifications = df["notification_count"].mean()

    avg_response_time = completed["response_time"].mean() if not completed.empty else 0
    avg_waiting_time = completed["waiting_time"].mean() if not completed.empty else 0

    return {
        "total_alarm": total_alarm,
        "completed_count": completed_count,
        "no_nurse_count": no_nurse_count,
        "success_rate": success_rate,
        "total_notifications": total_notifications,
        "avg_notifications": avg_notifications,
        "avg_response_time": avg_response_time,
        "avg_waiting_time": avg_waiting_time,
    }


# ==========================================================
# 4. GRAFİKLER
# ==========================================================
def plot_total_notifications(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]
    values = [
        baseline_metrics["total_notifications"],
        smart_metrics["total_notifications"]
    ]

    plt.figure(figsize=(8, 5))
    plt.bar(labels, values)
    plt.title("Toplam Gönderilen Bildirim Karşılaştırması")
    plt.ylabel("Bildirim Sayısı")

    for i, value in enumerate(values):
        plt.text(i, value + 8, f"{int(value)}", ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "01_toplam_bildirim_karsilastirmasi.png", dpi=300)
    plt.close()


def plot_avg_response_time(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]
    values = [
        baseline_metrics["avg_response_time"],
        smart_metrics["avg_response_time"]
    ]

    plt.figure(figsize=(8, 5))
    plt.bar(labels, values)
    plt.title("Ortalama Müdahale Başlangıç Süresi Karşılaştırması")
    plt.ylabel("Süre (saniye)")

    for i, value in enumerate(values):
        plt.text(i, value + 0.25, f"{value:.2f} sn", ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "02_ortalama_mudahale_baslangic_suresi.png", dpi=300)
    plt.close()


def plot_success_rate(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]
    values = [
        baseline_metrics["success_rate"],
        smart_metrics["success_rate"]
    ]

    plt.figure(figsize=(8, 5))
    plt.bar(labels, values)
    plt.title("Başarı Oranı Karşılaştırması")
    plt.ylabel("Başarı Oranı (%)")
    plt.ylim(0, 110)

    for i, value in enumerate(values):
        plt.text(i, value + 2, f"%{value:.2f}", ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "03_basari_orani_karsilastirmasi.png", dpi=300)
    plt.close()


def plot_completed_unassigned(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]

    completed_values = [
        baseline_metrics["completed_count"],
        smart_metrics["completed_count"]
    ]

    unassigned_values = [
        baseline_metrics["no_nurse_count"],
        smart_metrics["no_nurse_count"]
    ]

    x = range(len(labels))
    width = 0.35

    plt.figure(figsize=(8, 5))

    plt.bar(
        [i - width / 2 for i in x],
        completed_values,
        width,
        label="Tamamlanan Alarm"
    )

    plt.bar(
        [i + width / 2 for i in x],
        unassigned_values,
        width,
        label="Atanamayan Alarm"
    )

    plt.title("Tamamlanan ve Atanamayan Alarm Karşılaştırması")
    plt.ylabel("Alarm Sayısı")
    plt.xticks(list(x), labels)
    plt.legend()

    for i, value in enumerate(completed_values):
        plt.text(i - width / 2, value + 1, str(value), ha="center")

    for i, value in enumerate(unassigned_values):
        plt.text(i + width / 2, value + 1, str(value), ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "04_tamamlanan_atanamayan_alarm_karsilastirmasi.png", dpi=300)
    plt.close()


def create_comparison_table(baseline_metrics, smart_metrics):
    notification_reduction = (
        (
            baseline_metrics["total_notifications"]
            - smart_metrics["total_notifications"]
        )
        / baseline_metrics["total_notifications"]
    ) * 100

    response_difference = (
        baseline_metrics["avg_response_time"]
        - smart_metrics["avg_response_time"]
    )

    table_data = [
        ["Toplam alarm", baseline_metrics["total_alarm"], smart_metrics["total_alarm"]],
        ["Tamamlanan alarm", baseline_metrics["completed_count"], smart_metrics["completed_count"]],
        ["Atanamayan alarm", baseline_metrics["no_nurse_count"], smart_metrics["no_nurse_count"]],
        ["Başarı oranı", f"%{baseline_metrics['success_rate']:.2f}", f"%{smart_metrics['success_rate']:.2f}"],
        ["Toplam bildirim", int(baseline_metrics["total_notifications"]), int(smart_metrics["total_notifications"])],
        ["Alarm başına bildirim", f"{baseline_metrics['avg_notifications']:.2f}", f"{smart_metrics['avg_notifications']:.2f}"],
        ["Ortalama müdahale başlangıcı", f"{baseline_metrics['avg_response_time']:.2f} sn", f"{smart_metrics['avg_response_time']:.2f} sn"],
        ["Ortalama bekleme süresi", f"{baseline_metrics['avg_waiting_time']:.2f} sn", f"{smart_metrics['avg_waiting_time']:.2f} sn"],
        ["Bildirim azaltma oranı", "-", f"%{notification_reduction:.2f}"],
        ["Müdahale süresi iyileşmesi", "-", f"{response_difference:.2f} sn"],
    ]

    columns = ["Metrik", "Baseline", "Smart"]

    plt.figure(figsize=(10, 5.5))
    plt.axis("off")

    table = plt.table(
        cellText=table_data,
        colLabels=columns,
        loc="center",
        cellLoc="center"
    )

    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1, 1.5)

    plt.title("Baseline ve Smart Algoritma Karşılaştırma Tablosu", pad=20)

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "05_baseline_smart_karsilastirma_tablosu.png", dpi=300)
    plt.close()


# ==========================================================
# 5. ANA ÇALIŞMA
# ==========================================================
def main():
    PLOTS_PATH.mkdir(parents=True, exist_ok=True)

    baseline_df, smart_df = load_results()

    baseline_metrics = calculate_metrics(baseline_df)
    smart_metrics = calculate_metrics(smart_df)

    plot_total_notifications(baseline_metrics, smart_metrics)
    plot_avg_response_time(baseline_metrics, smart_metrics)
    plot_success_rate(baseline_metrics, smart_metrics)
    plot_completed_unassigned(baseline_metrics, smart_metrics)
    create_comparison_table(baseline_metrics, smart_metrics)

    print("Normal yük karşılaştırma grafikleri başarıyla oluşturuldu.")
    print(f"Kayıt klasörü: {PLOTS_PATH}")

    print("\nKullanılan güncel değerler:")
    print(f"Baseline toplam bildirim: {baseline_metrics['total_notifications']}")
    print(f"Smart toplam bildirim: {smart_metrics['total_notifications']}")
    print(f"Baseline başarı oranı: %{baseline_metrics['success_rate']:.2f}")
    print(f"Smart başarı oranı: %{smart_metrics['success_rate']:.2f}")
    print(f"Baseline ortalama müdahale başlangıcı: {baseline_metrics['avg_response_time']:.2f} sn")
    print(f"Smart ortalama müdahale başlangıcı: {smart_metrics['avg_response_time']:.2f} sn")


if __name__ == "__main__":
    main()