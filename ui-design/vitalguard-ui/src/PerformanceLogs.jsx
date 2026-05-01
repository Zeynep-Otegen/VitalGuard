import React from 'react';

export default function PerformanceLogs({ logs = [] }) {
  // --- DİNAMİK HESAPLAMALAR ---
  
  // Ortalama müdahale süresini hesapla
  const avgResponseTime = logs.length > 0 
    ? (logs.reduce((acc, curr) => acc + curr.response_time, 0) / logs.length).toFixed(2)
    : "0.00";

  // Eskalasyon Oranı (5 saniyeyi geçen "Gecikmeli" müdahalelerin yüzdesi)
  const delayedCount = logs.filter(log => log.status === 'Gecikmeli').length;
  const escalationRate = logs.length > 0 
    ? ((delayedCount / logs.length) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* ÜST BÖLÜM: Grafikler ve Özet Metrikler */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 24 Saatlik Sistem Yükü (Mock Grafik) */}
        <div className="lg:col-span-2 bg-white border border-zinc-200 p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">ALARM YOĞUNLUK MATRİSİ</p>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-900 mt-1">24 SAATLİK SİSTEM YÜKÜ</h3>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">KRİTİK PİKLER TESPİT EDİLDİ</span>
          </div>
          <div className="flex-1 flex items-end justify-around border-b border-zinc-200 pb-4 relative h-48">
            <div className="w-16 bg-[#FF0000] h-[60%] relative group cursor-pointer hover:opacity-80 transition-opacity">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500">08:00</span>
            </div>
            <div className="w-16 bg-[#FF0000] h-[85%] relative group cursor-pointer hover:opacity-80 transition-opacity">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500">12:00</span>
            </div>
            <div className="w-16 bg-[#FF0000] h-[50%] relative group cursor-pointer hover:opacity-80 transition-opacity">
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-zinc-500">18:00</span>
            </div>
          </div>
        </div>

        {/* Sağ Üst Metrikler */}
        <div className="space-y-8 flex flex-col">
          <div className="bg-white border border-zinc-200 p-6 shadow-sm flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">ORT. MÜDAHALE SÜRESİ</p>
            <div className="text-5xl font-black text-zinc-900">{avgResponseTime}s</div>
            <div className="mt-4 w-full h-1 bg-zinc-100">
              <div className="h-full bg-[#FF0000]" style={{ width: '70%' }}></div>
            </div>
            <p className="text-[9px] font-bold uppercase text-zinc-400 mt-2">HEDEF: &lt; 5.0S</p>
          </div>

          <div className="bg-white border border-zinc-200 p-6 shadow-sm flex-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">ESKALASYON ORANI</p>
            <div className="text-4xl font-black text-zinc-900">{escalationRate}%</div>
            <p className="text-[10px] font-bold uppercase text-zinc-900 mt-2 tracking-wider">
              {delayedCount} GECİKMELİ VAKA
            </p>
          </div>
        </div>
      </div>

      {/* ORTA BÖLÜM: Müdahale Performans Kayıtları Tablosu */}
      <div className="bg-white border border-zinc-200 shadow-sm">
        <div className="flex justify-between items-center p-6 border-b border-zinc-200">
          <h3 className="text-[13px] font-black uppercase tracking-widest text-zinc-900">MÜDAHALE PERFORMANS KAYITLARI</h3>
          <button className="px-4 py-2 border border-zinc-300 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors">
            CSV DIŞA AKTAR
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">OLAY KİMLİĞİ</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">ZAMAN DAMGASI</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">CİHAZ / DÜĞÜM</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">ÖNEM DERECESİ</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">İLK GECİKME</th>
                <th className="p-4 text-[10px] font-bold uppercase tracking-widest">DURUM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs font-bold text-zinc-500 uppercase">
                    Henüz çözülmüş bir kriz kaydı bulunmuyor.
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={index} className="hover:bg-zinc-50 transition-colors">
                    <td className="p-4 text-xs font-mono font-bold text-zinc-700">{log.id}</td>
                    <td className="p-4 text-xs font-medium text-zinc-600">{log.timestamp}</td>
                    <td className="p-4 text-xs font-bold uppercase text-zinc-800">{log.device}</td>
                    <td className="p-4 text-xs font-black uppercase text-[#FF0000]">{log.severity}</td>
                    <td className="p-4 text-sm font-black font-mono text-zinc-900">{log.response_time}s</td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${log.status === 'Başarılı' ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {log.status === 'Başarılı' ? 'ÇÖZÜLDÜ' : 'GECİKMELİ ÇÖZÜLDÜ'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
