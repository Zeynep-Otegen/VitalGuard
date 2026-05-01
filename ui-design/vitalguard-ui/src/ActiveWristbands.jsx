import React, { useState } from 'react';

export default function ActiveWristbands({ nurses = [] }) {
  // Seçili hemşireyi tutmak için State. Varsayılan olarak listedeki ilk hemşireyi seçiyoruz.
  const [selectedNurseId, setSelectedNurseId] = useState(null);

  // Seçili ID'ye göre hemşirenin tüm verilerini bul
  const selectedNurse = nurses.find(n => n.wristband_id === selectedNurseId) || nurses[0] || {};

  // Hemşirenin durumuna göre doğru renkleri döndüren yardımcı fonksiyon
  const getStatusStyles = (status) => {
    switch (status) {
      case 'MÜSAİT':
        return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-700' };
      case 'MEŞGUL':
        return { bg: 'bg-red-100', text: 'text-[#FF0000]', dot: 'bg-[#FF0000]' };
      case 'YOLDA':
        return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-700' };
      default:
        return { bg: 'bg-zinc-100', text: 'text-zinc-500', dot: 'bg-zinc-500' };
    }
  };

  return (
    <div className="px-8 pb-12 max-w-[1600px] mx-auto pt-4">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SOL KOLON: Hemşire Listesi ve Filtreler */}
        <div className="flex-1 space-y-8">
          <header>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Nöbetçi Hemşireler</h2>
            <p className="text-on-surface-variant text-sm font-medium">Aktif vardiyadaki hemşirelerin anlık durumu ve lokasyon verileri.</p>
          </header>
          
          {/* Filtre Çubuğu */}
          <div className="flex flex-wrap gap-4 items-end bg-surface-container p-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Birim Seçimi</label>
              <select className="bg-surface-container-lowest border-none text-xs font-bold p-2 uppercase focus:ring-1 focus:ring-black outline-none">
                <option>Tüm Birimler</option>
                <option>Acil Servis</option>
                <option>Yoğun Bakım</option>
                <option>Poliklinik</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Durum Filtresi</label>
              <select className="bg-surface-container-lowest border-none text-xs font-bold p-2 uppercase focus:ring-1 focus:ring-black outline-none">
                <option>Hepsi</option>
                <option>Müsait</option>
                <option>Meşgul</option>
              </select>
            </div>
            <button className="ml-auto bg-[#FF0000] text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity">Listeyi Yenile</button>
          </div>

          {/* Dinamik Hemşire Tablosu */}
          <div className="bg-surface-container-lowest overflow-hidden border border-outline-variant/20 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant">
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Hemşire</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Görev</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durum</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Koordinat</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {nurses.map((nurse) => {
                  const isSelected = selectedNurse.wristband_id === nurse.wristband_id;
                  const styles = getStatusStyles(nurse.status);

                  return (
                    <tr 
                      key={nurse.wristband_id} 
                      onClick={() => setSelectedNurseId(nurse.wristband_id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-zinc-100 border-l-4 border-black' : 'hover:bg-zinc-50 border-l-4 border-transparent'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-zinc-200 flex items-center justify-center overflow-hidden">
                            <span className="material-symbols-outlined text-zinc-500">person</span>
                          </div>
                          <div>
                            <div className="text-sm font-black uppercase text-zinc-900">{nurse.full_name}</div>
                            <div className="text-[10px] font-bold text-zinc-500">ID: {nurse.wristband_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold uppercase">{nurse.role}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 ${styles.bg} ${styles.text} text-[10px] font-black uppercase`}>
                          <span className={`w-1.5 h-1.5 ${styles.dot} rounded-full ${nurse.status === 'MEŞGUL' ? 'animate-pulse' : ''}`}></span>
                          {nurse.status}
                        </span>
                      </td>
                      <td className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                        X: {nurse.location_x} | Y: {nurse.location_y}
                      </td>
                      <td className="p-4 text-right">
                        <button className="material-symbols-outlined text-zinc-400 hover:text-black transition-colors">more_vert</button>
                      </td>
                    </tr>
                  );
                })}
                {nurses.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-xs font-bold text-zinc-500 uppercase">Aktif hemşire verisi bekleniyor...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SAĞ KOLON: Canlı Harita ve Detaylar */}
        <div className="w-full lg:w-96 space-y-8">
          <div className="bg-surface-container p-6 flex flex-col gap-6 shadow-sm border border-zinc-200 bg-white">
            <header className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-900">ANLIK LOKASYON</h3>
              <span className="material-symbols-outlined text-sm cursor-pointer hover:text-black">fullscreen</span>
            </header>
            
            {/* Dinamik Kat Planı */}
            <div className="relative aspect-square bg-zinc-50 border-4 border-zinc-900 overflow-hidden shadow-inner">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <line stroke="black" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20"></line>
                <line stroke="black" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50"></line>
                <line stroke="black" strokeWidth="0.5" x1="0" x2="100" y1="80" y2="80"></line>
                <line stroke="black" strokeWidth="0.5" x1="30" x2="30" y1="0" y2="100"></line>
                <line stroke="black" strokeWidth="0.5" x1="70" x2="70" y1="0" y2="100"></line>
              </svg>
              
              <div className="absolute inset-0 p-4 grid grid-cols-3 grid-rows-3 gap-2 opacity-50">
                <div className="border border-zinc-300 flex items-center justify-center text-[8px] font-black text-zinc-400 uppercase">401</div>
                <div className="border border-zinc-300 flex items-center justify-center text-[8px] font-black text-zinc-400 uppercase">402</div>
                <div className="border border-zinc-300 flex items-center justify-center text-[8px] font-black text-zinc-400 uppercase">403</div>
                <div className="col-span-2 border border-zinc-300 flex items-center justify-center text-[8px] font-black text-zinc-400 uppercase">Koridor A</div>
                <div className="border border-zinc-300 flex items-center justify-center text-[8px] font-black text-zinc-400 uppercase">Servis</div>
              </div>

              {/* Seçili Hemşirenin Dinamik İkonu */}
              {selectedNurse.wristband_id && (
                <div 
                  className="absolute group transition-all duration-700 ease-in-out"
                  style={{
                    top: `${selectedNurse.location_y}%`,
                    left: `${selectedNurse.location_x}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full scale-[3] animate-ping ${getStatusStyles(selectedNurse.status).bg} opacity-60`}></div>
                    <div className={`relative w-8 h-8 ${getStatusStyles(selectedNurse.status).dot} flex items-center justify-center text-white cursor-pointer z-10 shadow-lg border-2 border-white`}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white px-3 py-1.5 text-[9px] font-black uppercase whitespace-nowrap z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {selectedNurse.full_name}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Seçili Hemşire Detay Metrikleri */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-[10px] font-bold uppercase text-zinc-500">SEÇİLİ KİŞİ DURUMU</span>
                <span className={`text-xs font-black uppercase ${getStatusStyles(selectedNurse.status).text}`}>
                  {selectedNurse.status || 'BİLİNMİYOR'}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-[10px] font-bold uppercase text-zinc-500">SİNYAL GÜCÜ</span>
                <span className="text-xs font-black uppercase text-zinc-900">{selectedNurse.signal_strength || 0} dBm</span>
              </div>
              <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
                <span className="text-[10px] font-bold uppercase text-zinc-500">BATARYA</span>
                <span className="text-xs font-black uppercase text-zinc-900">%{selectedNurse.battery_level || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}