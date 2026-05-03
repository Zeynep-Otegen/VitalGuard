import React from 'react';

export default function NetworkManagement({ nurses = [] }) {
  // --- DİNAMİK HESAPLAMALAR ---
  
  // Sabit olarak 6 hasta odası monitörümüz olduğunu varsayıyoruz
  const patientMonitorCount = 6; 
  
  // Toplam cihaz sayısı (Bileklikler + Monitörler)
  const totalNodes = nurses.length + patientMonitorCount;
  
  // Bataryası %20'nin altında olan "Kritik" bileklik sayısı
  const criticalBatteryCount = nurses.filter(n => n.battery_level < 20).length;
  
  // Sinyal gücü -85 dBm'den kötü olan "Zayıf Sinyal" cihazları
  const signalLossCount = nurses.filter(n => n.signal_strength < -85).length;

  return (
    <div className="flex-1 p-8 space-y-12 max-w-[1600px] mx-auto">
      
      {/* ÖZET İSTATİSTİKLER (DİNAMİK) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
        <div className="bg-white p-6 border-l-4 border-zinc-900 shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2">Toplam Düğüm</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none">{totalNodes}</span>
            <span className="text-[0.65rem] text-zinc-400 font-medium tracking-tighter">CİHAZ</span>
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-emerald-500 shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2">Aktif Düğüm (Node)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none text-emerald-600">{totalNodes - signalLossCount}</span>
            <span className="text-[0.65rem] text-emerald-600 font-medium uppercase">Online</span>
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-[#FF0000] shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FF0000] mb-2">Kritik Batarya Seviyesi</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none text-[#FF0000]">{criticalBatteryCount}</span>
            <span className="text-[0.65rem] text-[#FF0000] font-medium uppercase tracking-tighter">Limit Dışı</span>
          </div>
        </div>

        <div className="bg-white p-6 border-l-4 border-[#FF0000] shadow-sm">
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FF0000] mb-2">Sinyal Kaybı (Zayıf)</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black leading-none text-[#FF0000]">{signalLossCount}</span>
            <span className="text-[0.65rem] text-[#FF0000] font-medium uppercase">Ağ Dışı/Zayıf</span>
          </div>
        </div>
      </section>

      {/* CİHAZ LİSTELEME TABLOSU */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-200">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[0.65rem] font-black uppercase tracking-widest text-zinc-500">Filtrele:</span>
              <select className="bg-transparent border-none text-xs font-bold uppercase outline-none cursor-pointer">
                <option>TÜM BİLEKLİKLER</option>
              </select>
            </div>
          </div>
          <div className="text-[0.6rem] font-mono text-zinc-400">
            SON GÜNCELLEME: {new Date().toLocaleTimeString()}
          </div>
        </div>

        <div className="w-full overflow-x-auto shadow-sm border border-zinc-100">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest">Bileklik Adı / SN</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest">Pil Durumu</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-center">Sinyal Gücü</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest">Durum</th>
                <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {nurses.map((nurse) => (
                <tr key={nurse.wristband_id} className="hover:bg-zinc-50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold uppercase tracking-tight text-zinc-900">{nurse.full_name} Bileklik</span>
                      <span className="text-[0.6rem] text-zinc-400 font-mono uppercase">ID: {nurse.wristband_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${nurse.battery_level < 20 ? 'bg-[#FF0000]' : 'bg-emerald-500'}`} 
                          style={{ width: `${nurse.battery_level}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs font-black font-mono ${nurse.battery_level < 20 ? 'text-[#FF0000]' : 'text-zinc-600'}`}>
                        %{nurse.battery_level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-mono text-xs font-bold text-zinc-700">
                    {nurse.signal_strength} dBm
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${nurse.signal_strength > -85 ? 'bg-emerald-500' : 'bg-[#FF0000]'}`}></div>
                      <span className={`text-[0.65rem] font-black uppercase ${nurse.signal_strength > -85 ? 'text-emerald-600' : 'text-[#FF0000]'}`}>
                        {nurse.signal_strength > -85 ? 'ONLINE' : 'ZAYIF SİNYAL'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-1.5 border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all text-[0.65rem] font-black uppercase tracking-widest">
                      DETAY
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}