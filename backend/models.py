# backend/models.py
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

# Hastalar Tablosu (Sabit Kalabilir)
class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    name_surname = Column(String, index=True)
    room_no = Column(String, index=True)
    device_id = Column(String, unique=True, index=True) # Örn: Oda-401

# YENİ: Hemşireler Tablosu (Merve'nin Algoritmasının Kaynağı)
class Nurse(Base):
    __tablename__ = "nurses"
    
    id = Column(Integer, primary_key=True, index=True)
    wristband_id = Column(String, unique=True, index=True) # Bilekliğin MAC/Seri numarası
    full_name = Column(String)
    role = Column(String, default="Klinik Hemşiresi")
    status = Column(String, default="MÜSAİT")      # MÜSAİT, MEŞGUL, YOLDA
    battery_level = Column(Integer, default=100)
    signal_strength = Column(Integer, default=-50)
    location_x = Column(Float, default=0.0)        # Algoritma için X koordinatı
    location_y = Column(Float, default=0.0)        # Algoritma için Y koordinatı
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# GÜNCELLENEN: Alarmlar ve Müdahaleler Tablosu
class AlarmRecord(Base):
    __tablename__ = "alarms"
    
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    status = Column(String, default="AKTİF") # "AKTİF", "ÇÖZÜLDÜ"
    assigned_nurse_id = Column(Integer, ForeignKey("nurses.id"), nullable=True) # İlişkisel Bağlantı (Merve atayacak)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) 
    resolved_at = Column(DateTime(timezone=True), nullable=True) # Müdahale bitiş süresi

# YENİ: Performans Logları Tablosu (Makalenin Kalbi)
class PerformanceLog(Base):
    __tablename__ = "performance_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    alarm_id = Column(Integer, ForeignKey("alarms.id"), nullable=True) # Hangi alarmın kaydı?
    room_number = Column(String)
    response_time_seconds = Column(Float) # Örn: 1.42 saniye
    efficiency_status = Column(String, default="Başarılı") # "Başarılı", "Gecikmeli"
    created_at = Column(DateTime(timezone=True), server_default=func.now())