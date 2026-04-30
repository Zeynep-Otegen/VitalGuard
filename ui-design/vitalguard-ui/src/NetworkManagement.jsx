import React from 'react';

export default function NetworkManagement() {
  return (
    <div className="flex-1 p-8 space-y-12 max-w-[1600px] mx-auto">
      {/* SUMMARY STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        {/* Card 1 */}
        <div className="bg-surface-container-lowest p-6 border-l-4 border-primary shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Toplam Düğüm</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none">124</span>
            <span className="text-[0.65rem] text-on-surface-variant font-medium">NODE</span>
          </div>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container-lowest p-6 border-l-4 border-primary shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-2">Aktif Düğüm (Node)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none text-emerald-600">118</span>
            <span className="text-[0.65rem] text-on-surface-variant font-medium uppercase">Aktif</span>
          </div>
        </div>
        {/* Card 3 */}
        <div className="bg-surface-container-lowest p-6 border-l-4 border-[#FF0000] shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FF0000] mb-2">Kritik Batarya Seviyesi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none text-[#FF0000]">4</span>
            <span className="text-[0.65rem] text-[#FF0000] font-medium">LİMT DIŞI</span>
          </div>
        </div>
        {/* Card 4 */}
        <div className="bg-surface-container-lowest p-6 border-l-4 border-[#FF0000] shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FF0000] mb-2">Sinyal Kaybı (Offline)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none text-[#FF0000]">2</span>
            <span className="text-[0.65rem] text-[#FF0000] font-medium">AĞ DIŞI</span>
          </div>
        </div>
      </section>

      {/* DEVICE LISTING TABLE */}
      <section className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-outline-variant/30">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-on-surface-variant">Filtrele:</span>
              <select className="bg-transparent border-none text-xs font-bold uppercase focus:ring-0 cursor-pointer outline-none">
                <option>TÜM DÜĞÜMLER</option>
                <option>GATEWAYLER</option>
                <option>BİLEKLİKLER</option>
                <option>SENSÖRLER</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-on-surface-variant">Konum:</span>
              <select className="bg-transparent border-none text-xs font-bold uppercase focus:ring-0 cursor-pointer outline-none">
                <option>TÜM KATLAR</option>
                <option>KAT 1</option>
                <option>KAT 2</option>
                <option>KAT 4 (YOĞUN BAKIM)</option>
              </select>
            </div>
          </div>
          <div className="text-[0.6rem] font-mono text-on-surface-variant">
            SON GÜNCELLEME: 14:32:01 GMT+3
          </div>
        </div>

        {/* Technical Table */}
        <div className="w-full overflow-x-auto shadow-sm">
          <table className="w-full text-left border-collapse bg-surface-container-lowest">
            <thead>
              <tr className="bg-surface-container text-on-surface-variant">
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant">Düğüm Adı / SN</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant">Pil Durumu</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant text-center">Sinyal</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant text-center">Sinyal Gücü (RSSI)</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant">Durum</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant">Son Sinyal (Ping)</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest border-b border-outline-variant text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {/* BLE Gateway Row */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-tight">BLE Gateway GW-04</span>
                    <span className="text-[0.6rem] text-on-surface-variant font-mono uppercase">SN: VG-992384-G</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 bg-surface-container-highest">
                      <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                    </div>
                    <span className="text-xs font-bold font-mono">AC</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">signal_cellular_4_bar</span>
                </td>
                <td className="px-6 py-5 text-center font-mono text-xs">-52 dBm</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[0.65rem] font-black uppercase tracking-tighter text-emerald-600">ONLINE</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-mono uppercase">0.4s ago</td>
                <td className="px-6 py-5 text-right">
                  <button className="px-4 py-1.5 border border-outline hover:bg-primary hover:text-white transition-all text-[0.65rem] font-black uppercase tracking-widest">
                    DETAY
                  </button>
                </td>
              </tr>
              {/* Akıllı Bileklik Row */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-tight">Akıllı Bileklik AB-22</span>
                    <span className="text-[0.6rem] text-on-surface-variant font-mono uppercase">SN: VG-110293-W</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 bg-surface-container-highest">
                      <div className="h-full bg-[#FF0000]" style={{ width: '12%' }}></div>
                    </div>
                    <span className="text-xs font-bold font-mono text-[#FF0000]">12%</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">signal_cellular_2_bar</span>
                </td>
                <td className="px-6 py-5 text-center font-mono text-xs">-84 dBm</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[0.65rem] font-black uppercase tracking-tighter text-emerald-600">ONLINE</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-mono uppercase">1.2s ago</td>
                <td className="px-6 py-5 text-right">
                  <button className="px-4 py-1.5 border border-outline hover:bg-primary hover:text-white transition-all text-[0.65rem] font-black uppercase tracking-widest">
                    DETAY
                  </button>
                </td>
              </tr>
              {/* Offline BLE Beacon Row */}
              <tr className="hover:bg-surface-container-low transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold uppercase tracking-tight">BLE Beacon BN-R9</span>
                    <span className="text-[0.6rem] text-on-surface-variant font-mono uppercase">SN: VG-445582-B</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-1 bg-surface-container-highest">
                      <div className="h-full bg-primary" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-xs font-bold font-mono">45%</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="material-symbols-outlined text-sm text-on-surface-variant">signal_cellular_connected_no_internet_4_bar</span>
                </td>
                <td className="px-6 py-5 text-center font-mono text-xs">N/A</td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#FF0000]"></div>
                    <span className="text-[0.65rem] font-black uppercase tracking-tighter text-[#FF0000]">OFFLINE</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-mono uppercase text-[#FF0000]">14 min ago</td>
                <td className="px-6 py-5 text-right">
                  <button className="px-4 py-1.5 border border-outline hover:bg-primary hover:text-white transition-all text-[0.65rem] font-black uppercase tracking-widest">
                    DETAY
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination / Info */}
        <div className="flex items-center justify-between py-6">
          <span className="text-[0.65rem] font-medium uppercase tracking-widest text-on-surface-variant">124 düğümden 3 tanesi gösteriliyor</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-primary bg-primary text-white font-bold text-xs shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant hover:bg-surface-container-low text-xs transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center border border-outline-variant hover:bg-surface-container-low text-xs transition-colors">3</button>
            <button className="px-3 h-8 flex items-center justify-center border border-outline-variant hover:bg-surface-container-low text-xs font-bold uppercase tracking-tighter transition-colors">Sıradaki</button>
          </div>
        </div>
      </section>
    </div>
  );
}
