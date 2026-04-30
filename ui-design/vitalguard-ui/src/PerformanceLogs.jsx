import React from 'react';

export default function PerformanceLogs() {
  return (
    <div className="p-8 pb-32">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-8">
        {/* Daily Alarm Intensity Chart */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-6 border border-outline-variant/20 shadow-sm">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">ALARM YOĞUNLUK MATRİSİ</h3>
              <p className="text-2xl font-black tracking-tighter uppercase">24 Saatlik SİSTEM YÜKÜ</p>
            </div>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-error-container text-error text-[10px] font-bold uppercase">Kritik Pikler Tespit Edildi</span>
            </div>
          </div>
          {/* Visual Data Representation */}
          <div className="h-64 flex items-end justify-between space-x-1 group">
            <div className="flex-1 bg-surface-container-high h-[20%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[25%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[40%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-red-600 h-[85%] relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">08:00</span>
            </div>
            <div className="flex-1 bg-surface-container-high h-[60%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[45%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[30%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-red-600 h-[95%] relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">12:00</span>
            </div>
            <div className="flex-1 bg-surface-container-high h-[70%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[55%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[40%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[35%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[45%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-red-600 h-[75%] relative">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold">18:00</span>
            </div>
            <div className="flex-1 bg-surface-container-high h-[50%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[30%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[20%] hover:bg-red-500 transition-colors"></div>
            <div className="flex-1 bg-surface-container-high h-[15%] hover:bg-red-500 transition-colors"></div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          <div className="bg-primary p-6 text-on-primary">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Ort. Müdahale Süresi</span>
            <div className="text-4xl font-black mt-2 tracking-tighter">1.42s</div>
            <div className="mt-4 h-1 bg-on-primary/20">
              <div className="w-3/4 h-full bg-red-500"></div>
            </div>
            <p className="text-[10px] mt-2 uppercase tracking-wide opacity-50">Hedef: &lt; 2.0s</p>
          </div>
          <div className="bg-surface-container p-6 border border-outline-variant/20">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Eskalasyon Oranı</span>
            <div className="text-4xl font-black mt-2 tracking-tighter">8.4%</div>
            <p className="text-[10px] mt-2 uppercase tracking-wide text-error font-bold">Düne göre +1.2%</p>
          </div>
        </div>

        {/* Detailed Alarm Report Table */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant/20">
          <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest">MÜDAHALE PERFORMANS KAYITLARI</h3>
            <button className="text-xs font-bold uppercase tracking-widest border border-primary px-3 py-1 hover:bg-primary hover:text-white transition-colors">CSV DIŞA AKTAR</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Olay Kimliği</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Zaman Damgası</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Cihaz / Düğüm</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Önem Derecesi</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">İlk Gecikme</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Çözüm Süresi</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-xs font-mono">#VG-9821</td>
                  <td className="px-6 py-4 text-xs">24 Eki, 08:42:11</td>
                  <td className="px-6 py-4 text-xs">NODE_B4-RM203</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold uppercase">KRİTİK</span></td>
                  <td className="px-6 py-4 text-xs font-bold">0.4s</td>
                  <td className="px-6 py-4 text-xs">1dk 12sn</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-green-600">Çözüldü</td>
                </tr>
                <tr className="bg-surface-container-low/30 hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-xs font-mono">#VG-9819</td>
                  <td className="px-6 py-4 text-xs">24 Eki, 08:35:04</td>
                  <td className="px-6 py-4 text-xs">GATEWAY_09</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase">UYARI</span></td>
                  <td className="px-6 py-4 text-xs font-bold">2.1s</td>
                  <td className="px-6 py-4 text-xs">4dk 05sn</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-zinc-400">Arşivlendi</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 text-xs font-mono">#VG-9815</td>
                  <td className="px-6 py-4 text-xs">24 Eki, 08:12:59</td>
                  <td className="px-6 py-4 text-xs">NODE_A1-RM101</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-error-container text-error text-[10px] font-bold uppercase">KRİTİK</span></td>
                  <td className="px-6 py-4 text-xs font-bold">0.8s</td>
                  <td className="px-6 py-4 text-xs">2dk 45sn</td>
                  <td className="px-6 py-4 text-[10px] font-bold uppercase text-green-600">Çözüldü</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Alarm Routing History */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-6 border border-outline-variant/20">
          <div className="flex items-center space-x-2 mb-6">
            <span className="material-symbols-outlined text-red-600">route</span>
            <h3 className="text-sm font-black uppercase tracking-widest">YÖNLENDİRME GEÇMİŞİ</h3>
          </div>
          <div className="space-y-6">
            <div className="relative pl-6 border-l-2 border-red-600">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-red-600 rounded-full border-4 border-white"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter">Alarm Tetiklendi: Oda 203</p>
                  <p className="text-[10px] text-zinc-500 uppercase mt-1">HEMŞİRE A'YA GÖNDERİLDİ (ADAMS, J.)</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">08:42:11.0</span>
              </div>
            </div>
            <div className="relative pl-6 border-l-2 border-zinc-200">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-zinc-400 rounded-full border-4 border-white"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter text-error">İSTEK REDDEDİLDİ</p>
                  <p className="text-[10px] text-zinc-500 uppercase mt-1">NEDEN: B KANADINDA MEŞGUL</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">+0.6s</span>
              </div>
            </div>
            <div className="relative pl-6 border-l-2 border-zinc-200">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-zinc-400 rounded-full border-4 border-white"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter">YÖNLENDİRİLDİ: HEMŞİRE B (BARNES, S.)</p>
                  <p className="text-[10px] text-zinc-500 uppercase mt-1">OTOMATİK YÖNLENDİRME PROTOKOLÜ</p>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">+0.8s</span>
              </div>
            </div>
            <div className="relative pl-6">
              <div className="absolute -left-[9px] top-0 w-4 h-4 bg-green-600 rounded-full border-4 border-white"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-tighter text-green-600">HEMŞİRE B TARAFINDAN KABUL EDİLDİ</p>
                  <p className="text-[10px] text-zinc-500 uppercase mt-1">MOBİL TERMİNAL ONAYLANDI</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-zinc-400">+1.8s</span>
                  <div className="text-[10px] font-bold text-green-600 uppercase mt-1">HEDEFE ULAŞILDI</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Chart: Distribution */}
        <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-6 border border-outline-variant/20 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-black uppercase tracking-widest">Alarm Önem Dağılımı</h3>
            <span className="text-[10px] font-bold uppercase bg-surface-container px-2 py-1">Son 7 Gün</span>
          </div>
          <div className="flex-1 flex items-center justify-center space-x-12">
            <div className="relative w-40 h-40 border-[12px] border-red-600 rounded-full flex items-center justify-center">
              <div className="absolute inset-0 border-[12px] border-zinc-200 rounded-full rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 70%)' }}></div>
              <div className="text-center">
                <span className="text-2xl font-black">72%</span>
                <p className="text-[8px] uppercase tracking-widest font-bold">Kritik</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-600"></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter w-20">Kritik</span>
                <span className="text-xs font-mono font-bold">142</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-zinc-400"></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter w-20">Uyarı</span>
                <span className="text-xs font-mono font-bold">48</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-zinc-200"></div>
                <span className="text-[10px] font-bold uppercase tracking-tighter w-20">Sistem</span>
                <span className="text-xs font-mono font-bold">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Glassmorphism Floating Detail */}
      <div className="fixed bottom-8 right-8 w-80 bg-surface-container-low/80 backdrop-blur-md p-4 border border-outline-variant/20 shadow-xl hidden md:block z-50">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">Aktif Alarm Monitörü</span>
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
        </div>
        <p className="text-xs font-medium mb-1 uppercase tracking-tighter">Mevcut Ağ Durumu: <span className="font-bold">Çalışıyor</span></p>
        <div className="h-1 bg-zinc-200 w-full mb-4">
          <div className="h-full bg-red-600 w-full"></div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase">
          <span>Çalışma Süresi: 99.98%</span>
          <span>Düğümler: 242/242</span>
        </div>
      </div>
    </div>
  );
}
