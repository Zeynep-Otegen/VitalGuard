import React from 'react';

export default function ActiveWristbands() {
  return (
    <div className="px-8 pb-12 max-w-[1600px] mx-auto pt-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Detailed Nurse List & Filters */}
        <div className="flex-1 space-y-8">
          <header>
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Nöbetçi Hemşireler</h2>
            <p className="text-on-surface-variant text-sm font-medium">Aktif vardiyadaki 12 hemşirenin anlık durumu ve lokasyon verileri.</p>
          </header>
          {/* Filters Row */}
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
            <button className="ml-auto bg-primary text-on-primary px-6 py-2 text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity">Listeyi Yenile</button>
          </div>
          {/* Personnel Table */}
          <div className="bg-surface-container-lowest overflow-hidden border border-outline-variant/20 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-outline-variant">
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Hemşire</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Görev</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durum</th>
                  <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Son Hareket</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {/* Row 1: Hem. Ayşe Ak */}
                <tr className="bg-surface-container-low border-l-4 border-[#FF0000]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-200 grayscale overflow-hidden">
                        <img alt="nurse portrait grayscale" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsP9eRXXbPhkNyK8oqJz55eLTzx0FghfqJWzQQ8A8remU6kGvUOL6UWKFim5BhQ0XZVaUH9HBObIvy4J9Lnq0bjQ2JHXGo3DznO2FoUHbUvXrjKU9n2nCP9pSNkON3J3jz7ZeDOzu6LcWk5969_WUO3wT7AEv-fGbhIj8uEDGBIsvXzi92GvzkqCRU8qMpeGKuTPQF-iO0B24_X_tIeh-aXQGLP9FCDNIDcVfYU9rg1qmVVnnEFzDXeC0lHB-frDdUE6Q556T7bFjR"/>
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase">Hem. Ayşe Ak</div>
                        <div className="text-[10px] text-on-surface-variant">ID: 48301</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium uppercase">Klinik Hemşiresi</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 text-[#FF0000] text-[10px] font-black uppercase">
                      <span className="w-1.5 h-1.5 bg-[#FF0000] rounded-full animate-pulse"></span>
                      MEŞGUL
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-on-surface-variant">15:05 - Oda 402</td>
                  <td className="p-4 text-right">
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-black transition-colors">more_vert</button>
                  </td>
                </tr>
                {/* Row 2: Hem. Fatma Yılmaz */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-200 grayscale overflow-hidden">
                        <img alt="professional nurse portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbBHKq4RJ6lDMiTTvoQuaSpBewGDNiuBJ2iYRFQGA0g1fyax0vhLdffdmJq2wszEx7nuvjqrxo3hzvaHsc6o6BiiCRzP0Ww-EkNOb-qjRLmVdmOwpXwkA1yY9wLyYUhNTEZJ88Al6YUh5ieCREeNXP4fxSEiDDC0lK1J4zVcTNQN5DVToZlyfgPCH1x6InrwJX7V5c3PtUEVVPyGW_JpR4fqrD-loWbZPIz3IXelo5Acljd655MXIJFXQxT6PXu3_KFRK5CIyeL731"/>
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase">Hem. Fatma Yılmaz</div>
                        <div className="text-[10px] text-on-surface-variant">ID: 48322</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium uppercase">Yoğun Bakım Hem.</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase">
                      <span className="w-1.5 h-1.5 bg-green-700 rounded-full"></span>
                      MÜSAİT
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-on-surface-variant">14:55 - Kat 2 Oda 212</td>
                  <td className="p-4 text-right">
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-black transition-colors">more_vert</button>
                  </td>
                </tr>
                {/* Row 3: Hem. Elif Can */}
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-200 grayscale overflow-hidden">
                        <img alt="nurse headshot" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH_MDVKMWyIR7fwlxbyOgGrsUpsc9fSbKBMzBOzDff7BTBSlL-0YMNd41dj_mR6gZjWGAbSCbRA_6bAvXlhaly33i73gaGQRzFGd2nE6WP27F1o1dUSXVkBYRj_r-mxUgJB_ty8sBQlbMSvAvNzTXp-wLXqL8HR48YxZc3l8jEpLP2t__Nw6OjWAiSMzdjEXUTZ6YIAQZkUii0dfkkW6xnBLhe6-Q5ie6kK7UjOAPW_AE64_lsN8xivpXNAZN9CSBbQe-ERpZkWtgC"/>
                      </div>
                      <div>
                        <div className="text-sm font-bold uppercase">Hem. Elif Can</div>
                        <div className="text-[10px] text-on-surface-variant">ID: 48345</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs font-medium uppercase">Acil Servis Hem.</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase">
                      <span className="w-1.5 h-1.5 bg-green-700 rounded-full"></span>
                      MÜSAİT
                    </span>
                  </td>
                  <td className="p-4 text-xs font-medium text-on-surface-variant">15:10 - Kat 4 Oda 405</td>
                  <td className="p-4 text-right">
                    <button className="material-symbols-outlined text-on-surface-variant hover:text-black transition-colors">more_vert</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Right Column: Floor Plan */}
        <div className="w-full lg:w-96 space-y-8">
          {/* Live Tracking Widget */}
          <div className="bg-surface-container p-6 flex flex-col gap-6">
            <header className="flex justify-between items-center">
              <h3 className="text-xs font-black uppercase tracking-widest">ANLIK LOKASYON: KAT 4</h3>
              <span className="material-symbols-outlined text-sm cursor-pointer hover:text-black">fullscreen</span>
            </header>
            {/* Mini Floor Plan */}
            <div className="relative aspect-square bg-surface-container-highest border border-outline-variant/30 overflow-hidden shadow-inner">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <line stroke="black" strokeWidth="0.5" x1="0" x2="100" y1="20" y2="20"></line>
                <line stroke="black" strokeWidth="0.5" x1="0" x2="100" y1="50" y2="50"></line>
                <line stroke="black" strokeWidth="0.5" x1="0" x2="100" y1="80" y2="80"></line>
                <line stroke="black" strokeWidth="0.5" x1="30" x2="30" y1="0" y2="100"></line>
                <line stroke="black" strokeWidth="0.5" x1="70" x2="70" y1="0" y2="100"></line>
              </svg>
              <div className="absolute inset-0 p-4 grid grid-cols-3 grid-rows-3 gap-2">
                <div className="bg-surface-container-low border border-outline-variant flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase">401</div>
                <div className="bg-surface-container-low border border-outline-variant flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase">402</div>
                <div className="bg-surface-container-low border border-outline-variant flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase">403</div>
                <div className="col-span-2 bg-surface-container-lowest border border-outline-variant/50 flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase">Koridor A</div>
                <div className="bg-surface-container-low border border-outline-variant flex items-center justify-center text-[8px] font-bold text-zinc-400 uppercase">Servis</div>
              </div>
              {/* Selected Nurse Highlight */}
              <div className="absolute top-[22%] left-[45%] group">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#FF0000]/20 rounded-full scale-[3] animate-ping"></div>
                  <div className="relative w-6 h-6 bg-[#FF0000] flex items-center justify-center text-white cursor-pointer z-10 shadow-md">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white px-2 py-1 text-[8px] font-bold uppercase whitespace-nowrap z-20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Hem. Ayşe Ak (402)
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">SEÇİLİ KİŞİ DURUMU</span>
                <span className="text-xs font-black uppercase text-[#FF0000]">MEŞGUL</span>
              </div>
              <div className="flex justify-between items-center border-b border-outline-variant pb-2">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">SİNYAL GÜCÜ</span>
                <span className="text-xs font-black uppercase">%98 (BEACON 4-A)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
