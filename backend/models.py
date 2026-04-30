# backend/models.py
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from database import Base

# Hastalar Tablosu
class Patient(Base):
    __tablename__ = "patients"
    
    id = Column(Integer, primary_key=True, index=True)
    name_surname = Column(String, index=True)
    room_no = Column(String, index=True)
    device_id = Column(String, unique=True, index=True) # MAC-001 gibi

# Personel Tablosu
class Staff(Base):
    __tablename__ = "staff"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String) # Hemşire, Doktor
    is_available = Column(Boolean, default=True) # Maliyet fonksiyonundaki a_i parametresi
    last_location = Column(String) # Hangi katta/odada

# Alarmlar ve Müdahaleler Tablosu (En Önemlisi)
class AlarmRecord(Base):
    __tablename__ = "alarms"
    
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String, index=True)
    status = Column(String) # "Aktif", "Müdahale Edildi"
    assigned_nurse = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # Makaledeki zaman damgası
    resolved_at = Column(DateTime(timezone=True), nullable=True) # Müdahale bitiş süresi