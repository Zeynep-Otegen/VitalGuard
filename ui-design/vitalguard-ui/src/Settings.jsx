import React from 'react';

export default function Settings() {
  return (
    <div className="flex-1 overflow-y-auto p-8 max-w-[1600px] mx-auto space-y-12">
      <header className="border-b border-outline-variant pb-6 mt-4">
        <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Sistem Ayarları</h2>
        <p className="text-on-surface-variant text-sm font-medium">VitalGuard ağ ve bildirim parametrelerini yapılandırın.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sol Kolon */}
        <div className="space-y-8">
          {/* Bildirim Ayarları */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-outline-variant pb-4 mb-6 text-primary">Bildirim Tercihleri</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-tight">Kritik Acil Durum SMS</div>
                  <div className="text-[10px] text-on-surface-variant uppercase mt-1">Sadece kalp ritmi durması ve düşme vakaları</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none peer-checked:bg-[#FF0000] transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-tight">Batarya Uyarıları</div>
                  <div className="text-[10px] text-on-surface-variant uppercase mt-1">%15 altına düşen cihazlar için sistem bildirimi</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none peer-checked:bg-primary transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold uppercase tracking-tight">Bağlantı Kopma Alarmı</div>
                  <div className="text-[10px] text-on-surface-variant uppercase mt-1">Ağdan düşen nodelar için sesli ikaz</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none peer-checked:bg-[#FF0000] transition-colors"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 peer-checked:translate-x-5 transition-transform"></div>
                </label>
              </div>
            </div>
          </section>

          {/* Ağ Parametreleri */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-outline-variant pb-4 mb-6 text-primary">Ağ ve Sensör Parametreleri</h3>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">BLE Taraması Sıklığı (Saniye)</label>
                <input type="number" defaultValue="5" className="bg-surface-container p-3 border-none text-sm font-mono focus:ring-1 focus:ring-black outline-none" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kritik Nabız Alt Limiti (BPM)</label>
                <input type="number" defaultValue="50" className="bg-surface-container p-3 border-none text-sm font-mono focus:ring-1 focus:ring-black outline-none text-[#FF0000] font-bold" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Kritik Nabız Üst Limiti (BPM)</label>
                <input type="number" defaultValue="120" className="bg-surface-container p-3 border-none text-sm font-mono focus:ring-1 focus:ring-black outline-none text-[#FF0000] font-bold" />
              </div>
            </div>
          </section>
        </div>

        {/* Sağ Kolon */}
        <div className="space-y-8">
          {/* Hesap Ayarları */}
          <section className="bg-surface-container-lowest border border-outline-variant/30 p-8 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest border-b border-outline-variant pb-4 mb-6 text-primary">Kullanıcı Bilgileri</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-zinc-200 grayscale overflow-hidden">
                  <img alt="profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4r5WzrYlaWVgRnyO5o5BabYt_e8X1595JRQfV7RZOk-PHizyGkLzQO8g3uqqdBVEtMuocVwEqh1lUT5WOwoCgrctunCFNwBAhQRCxMIbJU-k-lWD-Yp4F5Vr_mxWu4NcgTgjFST_PBQDfhdlu4ylVr_aRVLLkX4077l0qjweuSuP4BC_XlA_8tv5dQg5tFfipCbM_eZwYghbjxGJr2QnfpczLy5vcZ_RMWj8Kjh6JbSwsW8lxYnmoVl9fafeGB0zcZrpBQDMowg13"/>
                </div>
                <div>
                  <div className="text-lg font-black uppercase tracking-tight">Ayşe Yılmaz</div>
                  <div className="text-xs text-on-surface-variant font-bold uppercase mt-1">Başhemşire</div>
                  <div className="text-[10px] text-on-surface-variant font-mono mt-2">ID: VG-ADMIN-01</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">E-posta Adresi</label>
                <input type="email" defaultValue="ayse.yilmaz@hastane.local" className="bg-surface-container p-3 border-none text-sm font-bold uppercase focus:ring-1 focus:ring-black outline-none text-zinc-500" disabled />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Sistem Parolası</label>
                <input type="password" defaultValue="********" className="bg-surface-container p-3 border-none text-sm font-bold focus:ring-1 focus:ring-black outline-none" />
              </div>
              
              <button className="bg-primary text-white w-full py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors">
                Bilgileri Güncelle
              </button>
            </div>
          </section>

          {/* Sistem Bilgisi */}
          <section className="bg-surface-container p-8 border border-outline-variant/30 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant mb-2">Sistem Durumu</h3>
            
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Sürüm</span>
              <span className="text-xs font-mono font-bold text-primary">v3.1.0</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Ağ Şifrelemesi</span>
              <span className="text-xs font-mono font-bold text-emerald-600">AKTİF (AES-256)</span>
            </div>
            <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
              <span className="text-[10px] font-bold uppercase text-on-surface-variant">Son Yedekleme</span>
              <span className="text-xs font-mono font-bold text-primary">BUGÜN, 04:00</span>
            </div>

            <button className="mt-4 border border-[#FF0000] text-[#FF0000] w-full py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#FF0000] hover:text-white transition-colors">
              Sistemi Yeniden Başlat
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
