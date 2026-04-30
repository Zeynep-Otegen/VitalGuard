import pandas as pd

class VitalFilter:
    def __init__(self, window_size=3):
        self.window_size = window_size
        # Her cihaz için son verileri tutan bir buffer (tampon)
        self.buffers = {} 

    def process_data(self, device_id, heart_rate, spo2):
        if device_id not in self.buffers:
            self.buffers[device_id] = []

        # Anlık kriz kontrolü
        is_instant_crisis = (heart_rate > 120) or (spo2 < 90)
        self.buffers[device_id].append(is_instant_crisis)

        # Sadece belirlenen pencere boyutu kadar veri tut
        if len(self.buffers[device_id]) > self.window_size:
            self.buffers[device_id].pop(0)

        # Eğer buffer dolduysa ve hepsi krizse ONAYLA
        if len(self.buffers[device_id]) == self.window_size and all(self.buffers[device_id]):
            return True # GERÇEK KRİZ!
        
        return False # Geçici sıçrama veya normal