from pathlib import Path

import pandas as pd
import matplotlib.pyplot as plt


# ==========================================================
# 1. DOSYA YOLLARI
# ==========================================================
BASE_DIR = Path(__file__).resolve().parent.parent
RESULTS_PATH = BASE_DIR / "results"
PLOTS_PATH = RESULTS_PATH / "plots"

BASELINE_CSV = RESULTS_PATH / "baseline_simulation_results.csv"
SMART_CSV = RESULTS_PATH / "smart_simulation_results.csv"


# ==========================================================
# 2. SONUÇLARI YÜKLEME
# ==========================================================
def load_results():
    baseline_df = pd.read_csv(BASELINE_CSV)
    smart_df = pd.read_csv(SMART_CSV)

    return baseline_df, smart_df


# ==========================================================
# 3. METRİK HESAPLAMA
# ==========================================================
def calculate_metrics(df):
    total_alarms = len(df)

    completed = df[df["status"] == "completed"]
    no_nurse = df[df["status"] == "no_available_nurse"]

    success_rate = (len(completed) / total_alarms) * 100 if total_alarms > 0 else 0
    fail_rate = (len(no_nurse) / total_alarms) * 100 if total_alarms > 0 else 0

    total_notifications = df["notification_count"].sum()
    avg_notifications = df["notification_count"].mean() if total_alarms > 0 else 0

    avg_response_time = completed["response_time"].mean() if not completed.empty else 0
    avg_waiting_time = completed["waiting_time"].mean() if not completed.empty else 0

    return {
        "total_alarms": total_alarms,
        "completed_count": len(completed),
        "no_nurse_count": len(no_nurse),
        "success_rate": success_rate,
        "fail_rate": fail_rate,
        "total_notifications": total_notifications,
        "avg_notifications": avg_notifications,
        "avg_response_time": avg_response_time,
        "avg_waiting_time": avg_waiting_time,
    }


# ==========================================================
# 4. GRAFİK FONKSİYONLARI
# ==========================================================
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
    plt.savefig(PLOTS_PATH / "01_success_rate_comparison.png", dpi=300)
    plt.close()


def plot_completed_vs_failed(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]

    completed_values = [
        baseline_metrics["completed_count"],
        smart_metrics["completed_count"]
    ]

    failed_values = [
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
        failed_values,
        width,
        label="Atanamayan Alarm"
    )

    plt.title("Tamamlanan ve Atanamayan Alarm Karşılaştırması")
    plt.ylabel("Alarm Sayısı")
    plt.xticks(list(x), labels)
    plt.legend()

    for i, value in enumerate(completed_values):
        plt.text(i - width / 2, value + 1, str(value), ha="center")

    for i, value in enumerate(failed_values):
        plt.text(i + width / 2, value + 1, str(value), ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "02_completed_failed_alarm_comparison.png", dpi=300)
    plt.close()


def plot_total_notifications(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]
    values = [
        baseline_metrics["total_notifications"],
        smart_metrics["total_notifications"]
    ]

    plt.figure(figsize=(8, 5))
    plt.bar(labels, values)
    plt.title("Toplam Gönderilen Bildirim Sayısı Karşılaştırması")
    plt.ylabel("Bildirim Sayısı")

    for i, value in enumerate(values):
        plt.text(i, value + 5, f"{int(value)}", ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "03_total_notifications_comparison.png", dpi=300)
    plt.close()


def plot_avg_notifications(baseline_metrics, smart_metrics):
    labels = ["Baseline", "Smart"]
    values = [
        baseline_metrics["avg_notifications"],
        smart_metrics["avg_notifications"]
    ]

    plt.figure(figsize=(8, 5))
    plt.bar(labels, values)
    plt.title("Alarm Başına Ortalama Bildirim Sayısı Karşılaştırması")
    plt.ylabel("Ortalama Bildirim Sayısı")

    for i, value in enumerate(values):
        plt.text(i, value + 0.05, f"{value:.2f}", ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "04_avg_notifications_comparison.png", dpi=300)
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
        plt.text(i, value + 0.2, f"{value:.2f} sn", ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / "05_avg_response_time_comparison.png", dpi=300)
    plt.close()


def plot_nurse_distribution(df, title, filename):
    completed = df[df["status"] == "completed"]

    nurse_counts = completed["selected_nurse"].value_counts().sort_index()

    plt.figure(figsize=(11, 6))
    plt.bar(nurse_counts.index, nurse_counts.values)
    plt.title(title)
    plt.ylabel("Görev Sayısı")
    plt.xticks(rotation=45)

    for i, value in enumerate(nurse_counts.values):
        plt.text(i, value + 0.2, str(value), ha="center")

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / filename, dpi=300)
    plt.close()


def plot_floor_distribution(df, title, filename):
    floor_counts = df.groupby(["floor", "status"]).size().unstack(fill_value=0)

    floor_counts.plot(kind="bar", figsize=(8, 5))
    plt.title(title)
    plt.xlabel("Kat")
    plt.ylabel("Alarm Sayısı")
    plt.xticks(rotation=0)

    plt.tight_layout()
    plt.savefig(PLOTS_PATH / filename, dpi=300)
    plt.close()


def create_comparison_table_image(baseline_metrics, smart_metrics):
    notification_reduction = (
        (
            baseline_metrics["total_notifications"]
            - smart_metrics["total_notifications"]
        )
        / baseline_metrics["total_notifications"]
    ) * 100

    response_improvement = (
        baseline_metrics["avg_response_time"]
        - smart_metrics["avg_response_time"]
    )

    table_data = [
        [
            "Toplam alarm",
            baseline_metrics["total_alarms"],
            smart_metrics["total_alarms"]
        ],
        [
            "Tamamlanan alarm",
            baseline_metrics["completed_count"],
            smart_metrics["completed_count"]
        ],
        [
            "Atanamayan alarm",
            baseline_metrics["no_nurse_count"],
            smart_metrics["no_nurse_count"]
        ],
        [
            "Başarı oranı",
            f"%{baseline_metrics['success_rate']:.2f}",
            f"%{smart_metrics['success_rate']:.2f}"
        ],
        [
            "Toplam bildirim",
            int(baseline_metrics["total_notifications"]),
            int(smart_metrics["total_notifications"])
        ],
        [
            "Alarm başına bildirim",
            f"{baseline_metrics['avg_notifications']:.2f}",
            f"{smart_metrics['avg_notifications']:.2f}"
        ],
        [
            "Ortalama müdahale başlangıcı",
            f"{baseline_metrics['avg_response_time']:.2f} sn",
            f"{smart_metrics['avg_response_time']:.2f} sn"
        ],
        [
            "Ortalama bekleme süresi",
            f"{baseline_metrics['avg_waiting_time']:.2f} sn",
            f"{smart_metrics['avg_waiting_time']:.2f} sn"
        ],
        [
            "Bildirim azaltma oranı",
            "-",
            f"%{notification_reduction:.2f}"
        ],
        [
            "Müdahale süresi farkı",
            "-",
            f"{response_improvement:.2f} sn"
        ],
    ]

    columns = ["Metrik", "Baseline", "Smart"]

    plt.figure(figsize=(10, 5))
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
    plt.savefig(PLOTS_PATH / "09_comparison_table.png", dpi=300)
    plt.close()


# ==========================================================
# 5. ANA ÇALIŞMA
# ==========================================================
def main():
    PLOTS_PATH.mkdir(parents=True, exist_ok=True)

    baseline_df, smart_df = load_results()

    baseline_metrics = calculate_metrics(baseline_df)
    smart_metrics = calculate_metrics(smart_df)

    plot_success_rate(baseline_metrics, smart_metrics)

    plot_completed_vs_failed(baseline_metrics, smart_metrics)

    plot_total_notifications(baseline_metrics, smart_metrics)

    plot_avg_notifications(baseline_metrics, smart_metrics)

    plot_avg_response_time(baseline_metrics, smart_metrics)

    plot_nurse_distribution(
        baseline_df,
        "Baseline Hemşire Görev Dağılımı",
        "06_baseline_nurse_distribution.png"
    )

    plot_nurse_distribution(
        smart_df,
        "Smart Hemşire Görev Dağılımı",
        "07_smart_nurse_distribution.png"
    )

    plot_floor_distribution(
        smart_df,
        "Smart Algoritma Kat Bazlı Alarm Durumu",
        "08_smart_floor_alarm_distribution.png"
    )

    create_comparison_table_image(baseline_metrics, smart_metrics)

    print("Grafikler başarıyla oluşturuldu.")
    print(f"Kayıt klasörü: {PLOTS_PATH}")

    print("\nGüncel karşılaştırma özeti:")
    print(f"Baseline toplam bildirim: {baseline_metrics['total_notifications']}")
    print(f"Smart toplam bildirim: {smart_metrics['total_notifications']}")
    print(f"Baseline başarı oranı: %{baseline_metrics['success_rate']:.2f}")
    print(f"Smart başarı oranı: %{smart_metrics['success_rate']:.2f}")
    print(
        "Baseline ortalama müdahale başlangıcı: "
        f"{baseline_metrics['avg_response_time']:.2f} sn"
    )
    print(
        "Smart ortalama müdahale başlangıcı: "
        f"{smart_metrics['avg_response_time']:.2f} sn"
    )


if __name__ == "__main__":
    main()