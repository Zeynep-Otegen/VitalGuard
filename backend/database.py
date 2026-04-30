# backend/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()
# PostgreSQL Bağlantı Adresi (Kullanıcı adı ve şifreni kendine göre güncelleyebilirsin)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# EĞER POSTGRESQL KURULU DEĞİLSE, ŞİMDİLİK ALTTAKİ SQLITE SATIRINI AÇABİLİRSİN:
# SQLALCHEMY_DATABASE_URL = "sqlite:///./vitalguard.db"
if not SQLALCHEMY_DATABASE_URL:
    print("KRİTİK HATA: .env dosyası okunamadı veya DATABASE_URL bulunamadı!")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Veritabanı oturumu açma/kapatma fonksiyonu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()