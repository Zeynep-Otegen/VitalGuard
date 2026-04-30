# backend/schemas.py
from pydantic import BaseModel

class SensorData(BaseModel):
    device_id: str
    heart_rate: int
    spo2: int

class AlarmUpdate(BaseModel):
    device_id: str
    room_no: str
    status: str  # "Normal" veya "CRISIS"
    assigned_nurse: str = "Atanıyor..."