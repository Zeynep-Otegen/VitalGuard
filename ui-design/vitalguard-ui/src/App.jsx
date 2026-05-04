import React, { useState, useEffect } from 'react'; // useEffect eklendi
import axios from 'axios'; // axios eklendi
import PerformanceLogs from './PerformanceLogs';
import ActiveWristbands from './ActiveWristbands';
import NetworkManagement from './NetworkManagement';
import Settings from './Settings';

function App() {
  const [activeTab, setActiveTab] = useState('settings');

  const [alarms, setAlarms] = useState([]);// Gerçek alarmları tutacağımız yer

 const [nurses, setNurses] = useState([]); // Artık içi boş, veritabanından dolacak!

 const [perfLogs, setPerfLogs] = useState([]);

  // Toplam aktif cihaz (Oda) sayımız (örneğin 6 odamız var)
  const totalNodes = 6;
  
  useEffect(() => {
    // 1. Sayfa ilk açıldığında aktif alarmları veritabanından çek (Axios)
    const fetchActiveAlarms = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/alarms/active');
        setAlarms(response.data);
      } catch (error) {
        console.error("Alarmlar çekilirken hata oluştu:", error);
      }
    };
    fetchActiveAlarms();
// 1.5 Hemşire Listesini Veritabanından Çek
    const fetchNurses = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/nurses');
        setNurses(response.data);
      } catch (error) {
        console.error("Hemşireler çekilirken hata oluştu:", error);
      }
    };
    fetchNurses();
    
    // 1.6 Performans Loglarını Çek
    const fetchPerfLogs = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/performance-logs');
        setPerfLogs(response.data);
      } catch (error) {
        console.error("Loglar çekilirken hata oluştu:", error);
      }
    };
    fetchPerfLogs();
    
    // Bunu da interval içine ekleyebilirsin, böylece kriz çözüldükçe tablo otomatik güncellenir:
    const logsInterval = setInterval(fetchPerfLogs, 3000);
    // Hemşirelerin durumunu ve konumunu canlı tutmak için her 3 saniyede bir güncelle
    const nurseInterval = setInterval(fetchNurses, 3000);
    // 2. Canlı WebSocket Bağlantısını Başlat
    const socket = new WebSocket('ws://localhost:8000/ws/alarms');

    socket.onmessage = (event) => {
      const socketData = JSON.parse(event.data);
      
      // Eğer yeni bir kriz geldiyse listeye ekle
      if (socketData.status === "CRISIS") {
         setAlarms(prevAlarms => [{
           id: socketData.alarm_id,
           device_id: socketData.device_id,
           status: "Aktif Kriz",
           assigned_nurse: socketData.assigned_nurse,
           created_at: socketData.timestamp
         }, ...prevAlarms]);
      } 
      // Eğer bir kriz çözüldüyse listeden çıkar
      else if (socketData.status === "RESOLVED") {
         setAlarms(prevAlarms => prevAlarms.filter(a => a.id !== socketData.alarm_id));
      }
    };

    return () => {
      socket.close();
      clearInterval(nurseInterval);
      clearInterval(logsInterval);
    } // Temizlik
  }, []);

 const handleResolveAlarm = async (alarmId) => {
    console.log("Sistem tetiklendi! Gelen Alarm ID:", alarmId); 
    try {
      await axios.post(`http://localhost:8000/api/alarms/${alarmId}/resolve`);
      setAlarms(prevAlarms => prevAlarms.filter(a => a.id !== alarmId));
      
      const perfResponse = await axios.get('http://localhost:8000/api/performance-logs');
      setPerfLogs(perfResponse.data);
      
      const nurseResponse = await axios.get('http://localhost:8000/api/nurses');
      setNurses(nurseResponse.data);
    } catch (error) {
      console.error("Alarm çözülürken hata oluştu:", error);
    }
  };
  return (
    <div className="bg-[#f8f9fa] text-zinc-900 antialiased min-h-screen font-sans">
      {/* SideNavBar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 z-40 bg-white border-r border-zinc-200 flex flex-col h-full py-6 shadow-sm">
        <div className="px-6 mb-8">
          <h1 className="text-3xl font-black text-[#FF0000] tracking-tighter leading-none">VitalGuard</h1>
          <p className="text-[10px] font-bold tracking-widest uppercase text-zinc-500 mt-2">Başhemşire Paneli</p>
        </div>
        
        <nav className="flex-1 space-y-1">
          <button onClick={() => setActiveTab('dashboard')} className={`${activeTab === 'dashboard' ? 'bg-[#FF0000] text-white shadow-md' : 'text-zinc-600 hover:text-black hover:bg-zinc-50'} w-full text-left font-bold flex items-center gap-3 px-6 py-4 transition-all`}>
            <span className="material-symbols-outlined text-xl">dashboard</span>
            <span className="text-xs font-bold tracking-wider uppercase">Kontrol Paneli</span>
          </button>
          {[
            { id: 'watch', icon: 'watch', label: 'Aktif Bileklikler' },
            { id: 'hub', icon: 'hub', label: 'Ağ Yönetimi' },
            { id: 'history', icon: 'history', label: 'Performans Logları' },
            { id: 'settings', icon: 'settings', label: 'Ayarlar' }
          ].map((item, index) => (
            <button key={index} onClick={() => setActiveTab(item.id)} className={`${activeTab === item.id ? 'bg-[#FF0000] text-white shadow-md' : 'text-zinc-600 hover:text-black hover:bg-zinc-50'} w-full text-left flex items-center gap-3 px-6 py-4 transition-all`}>
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span className="text-xs font-bold tracking-wider uppercase">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <div className="px-6 mt-auto">
          <button className="w-full bg-[#FF0000] text-white py-4 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-700 transition-colors shadow-lg">
            Acil Durum Bildir
          </button>
        </div>
      </aside>

      {/* TopAppBar */}
      <header className="fixed top-0 right-0 left-64 h-20 z-30 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-4">
          {activeTab === 'watch' ? (
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-zinc-400 text-sm">search</span>
              <input className="pl-10 pr-4 py-2 border-none bg-surface-container-low text-xs font-semibold tracking-tight uppercase focus:ring-1 focus:ring-black w-64 outline-none" placeholder="HEMŞİRE VEYA BİRİM ARA..." type="text" />
            </div>
          ) : activeTab === 'hub' ? (
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-zinc-400 text-sm">search</span>
              <input className="pl-10 pr-4 py-2 border-none bg-surface-container-low text-xs font-semibold tracking-tight uppercase focus:ring-1 focus:ring-black w-64 outline-none" placeholder="DÜĞÜM ARA..." type="text" />
            </div>
          ) : (
            <>
              <span className="tracking-tight uppercase text-[11px] font-bold text-zinc-400">Network</span>
              <span className="material-symbols-outlined text-zinc-300 text-sm">chevron_right</span>
              <span className="tracking-tight uppercase text-[11px] font-black text-black">
                {activeTab === 'dashboard' ? 'Canlı İzleme Paneli' : activeTab === 'history' ? 'Performans Logları' : activeTab === 'settings' ? 'Ayarlar' : 'Panel'}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-6">
          <button className="p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="flex items-center gap-4 border-l border-zinc-200 pl-6">
            <div className="text-right">
              <p className="text-[11px] font-black text-black uppercase leading-none">Ayşe Yılmaz</p>
              <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Başhemşire</p>
            </div>
            <div className="w-9 h-9 bg-zinc-900 rounded flex items-center justify-center text-white text-[11px] font-black">AY</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ml-64 pt-20">
        {activeTab === 'dashboard' ? (
          <div className="p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Metrics Section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white border border-zinc-200 shadow-sm">
              <div className="p-8 border-r border-zinc-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Aktif Alarm Monitörü</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">{totalNodes}</span>
                  <span className="text-[11px] font-bold text-emerald-500 uppercase">Node Bağlı</span>
                </div>
                <p className="text-[9px] font-bold text-emerald-500 uppercase mt-4 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Veri Akışı Stabil
                </p>
              </div>
              <div className="p-8 border-r border-zinc-200">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Ağ Durumu</p>
                <span className="text-4xl font-black tracking-tighter uppercase text-zinc-900">Çalışıyor</span>
                <p className="text-[9px] font-bold uppercase text-zinc-400 mt-4">BLE Gecikme (Latency)<br/><span className="text-black">0.12ms</span></p>
              </div>
              <div className="p-8 border-l-4 border-l-[#FF0000] relative overflow-hidden">
                <div className="absolute inset-0 bg-red-50 opacity-50"></div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#FF0000] mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">warning</span> Bekleyen Alarmlar
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black tracking-tighter text-[#FF0000]">{alarms.length < 10 ? `0${alarms.length}` : alarms.length}</span>
                    <span className="text-[11px] font-bold text-[#FF0000] uppercase">Kritik</span>
                  </div>
                  <button className="w-full mt-4 py-3 bg-[#FF0000] text-white text-[11px] font-black uppercase hover:bg-red-700 transition-colors">Hemen Müdahale Et</button>
                </div>
              </div>
            </section>

            {/* Map and List Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Floor Map */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex justify-between items-end">
                  <h2 className="text-[13px] font-black uppercase tracking-widest">Kat Planı ve Konum Noktaları</h2>
                </div>
                <div className="relative bg-white border-4 border-zinc-800 aspect-[16/9] p-2">
                  <div className="grid grid-cols-5 grid-rows-2 gap-2 h-full opacity-60">
                    {[...Array(10)].map((_, i) => {
                      const roomNumber = 401 + i;
                      const roomStr = `Oda-${roomNumber}`;
                      const hasAlarm = alarms.some(alarm => alarm.device_id === roomStr);

                      return (
                        <div key={i} className={`border-2 flex items-start p-2 relative transition-all duration-300 ${hasAlarm ? 'border-[#FF0000] bg-red-100 shadow-inner' : 'border-zinc-200 bg-zinc-50'}`}>
                          <span className={`text-[9px] font-black ${hasAlarm ? 'text-[#FF0000]' : 'text-zinc-400'}`}>
                            {roomNumber}
                          </span>
                          
                          {/* Sadece kriz varsa yanan nokta */}
                          {hasAlarm && (
                            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-[#FF0000] rounded-full animate-pulse transform -translate-x-1/2 -translate-y-1/2 shadow-lg z-10 border-2 border-white"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* Nöbetçi Bankosu Box */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-zinc-400 px-6 py-2 text-[10px] font-black uppercase">
                    Nöbetçi Bankosu
                  </div>
                </div>
              </div>
              {/* Personnel List */}
              {/* Personnel List */}
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-[13px] font-black uppercase tracking-widest">Hemşire Durum Listesi</h2>
                <div className="space-y-3">
                  
                  {/* Hemşireleri State'den Çekerek Döndürüyoruz */}
                  {nurses.map((nurse, index) => (
                    <div key={index} className="bg-white border border-zinc-200 p-4 flex items-center justify-between shadow-sm animate-in fade-in duration-500">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200">
                          <span className="material-symbols-outlined text-xl">person</span>
                        </div>
                        <div>
                          {/* VERİTABANI İLE EŞLEŞTİRİLDİ: full_name */}
                          <div className="text-xs font-black uppercase text-zinc-900">{nurse.full_name}</div>
                          
                          {/* VERİTABANI İLE EŞLEŞTİRİLDİ: signal_strength ve wristband_id */}
                          <div className="text-[8px] font-bold text-zinc-500 uppercase mt-0.5 tracking-wider">
                            Sinyal: {nurse.signal_strength} dBm | Bileklik: {nurse.wristband_id}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Duruma göre renk belirleme */}
                        <span className={`text-[9px] font-black uppercase tracking-wider ${
                          nurse.status === 'MÜSAİT' ? 'text-emerald-600' : 
                          nurse.status === 'MEŞGUL' ? 'text-[#FF0000]' : 'text-amber-500'
                        }`}>
                          {nurse.status}
                        </span>
                        <div className={`w-2.5 h-2.5 shadow-sm ${
                          nurse.status === 'MÜSAİT' ? 'bg-emerald-500' : 
                          nurse.status === 'MEŞGUL' ? 'bg-[#FF0000]' : 'bg-amber-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}

                  <button className="w-full py-3 bg-zinc-100 border border-zinc-200 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:bg-zinc-200 transition-colors">
                    Toplam {nurses.length} Personel Aktif
                  </button>
                </div>
              </div>
            </div>

            {/* NEW SECTION: Alarms & Performance Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
              
              {/* Bekleyen Kritik Alarmlar */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex justify-between items-end border-b-2 border-[#FF0000] pb-2">
                  <h2 className="text-[13px] font-black text-[#FF0000] uppercase tracking-widest">Bekleyen Kritik Alarmlar</h2>
                  <span className="text-[9px] font-bold text-[#FF0000] uppercase tracking-wider">{alarms.length} Aktif Kuyruk</span>
                </div>
                <div className="space-y-3">
                 {/* SAHTE ALARMLAR YERİNE GERÇEK VERİ DÖNGÜSÜ */}
                  {alarms.length === 0 ? (
                    <div className="p-4 text-center text-sm font-bold text-zinc-500 uppercase">Aktif kriz bulunmuyor.</div>
                  ) : (
                    alarms.map((alarm) => (
                      <div key={alarm.id} className="bg-red-50 border border-red-100 p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-[#FF0000] text-white flex items-center justify-center font-black text-xs shadow-inner text-center">
                            {alarm.device_id}
                          </div>
                          <div>
                            <div className="text-sm font-black uppercase text-zinc-900 tracking-wide">Kritik Bulgular (Vitals)</div>
                            <div className="text-[10px] font-bold text-[#FF0000] uppercase mt-1 tracking-wider">
                              Yönlendirilen: {alarm.assigned_nurse}
                            </div>
                          </div>
                        </div>
                        <button 
  onClick={() => handleResolveAlarm(alarm.id)}
  className="px-5 py-2.5 border-2 border-emerald-500 text-emerald-600 text-[10px] font-black uppercase hover:bg-emerald-500 hover:text-white transition-colors bg-white shadow-sm">
  Müdahaleyi Tamamla
</button>
                      </div>
                    ))
                  )}

                </div>
              </div>

              {/* Performans Logları */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex justify-between items-end border-b-2 border-zinc-800 pb-2">
                  <h2 className="text-[13px] font-black uppercase tracking-widest text-zinc-900">Performans Logları</h2>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Verimlilik: %99.4</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {/* Log 1 */}
                  <div className="bg-white border border-zinc-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 uppercase tracking-wider">Başarılı</span>
                      <span className="text-[9px] font-bold text-zinc-400">12:30:11</span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Müdahale</div>
                    <div className="text-3xl font-black text-zinc-900 leading-none my-1">0.4s</div>
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Oda 402 - OK</div>
                  </div>
                  {/* Log 2 */}
                  <div className="bg-white border border-zinc-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 uppercase tracking-wider">Başarılı</span>
                      <span className="text-[9px] font-bold text-zinc-400">12:15:42</span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Müdahale</div>
                    <div className="text-3xl font-black text-zinc-900 leading-none my-1">1.2s</div>
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Oda 408 - OK</div>
                  </div>
                  {/* Log 3 */}
                  <div className="bg-white border border-zinc-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 uppercase tracking-wider">Başarılı</span>
                      <span className="text-[9px] font-bold text-zinc-400">12:02:15</span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Müdahale</div>
                    <div className="text-3xl font-black text-zinc-900 leading-none my-1">0.8s</div>
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Oda 312 - OK</div>
                  </div>
                  {/* Log 4 */}
                  <div className="bg-white border border-zinc-200 p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <span className="bg-zinc-100 text-zinc-600 text-[9px] font-black px-2 py-1 uppercase tracking-wider">Sistem Log</span>
                      <span className="text-[9px] font-bold text-zinc-400">11:55:00</span>
                    </div>
                    <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Ağ Optimizasyonu</div>
                    <div className="text-3xl font-black text-zinc-900 leading-none my-1">0ms</div>
                    <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Sync Tamam</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : activeTab === 'history' ? (
          <PerformanceLogs logs={perfLogs} />
        ) : activeTab === 'watch' ? (
          <ActiveWristbands nurses={nurses} />
        ) : activeTab === 'hub' ? (
          <NetworkManagement nurses={nurses} />
        ) : activeTab === 'settings' ? (
          <Settings />
        ) : (
          <div className="p-8 max-w-7xl mx-auto space-y-8 flex items-center justify-center min-h-[50vh]">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-zinc-300">İçerik Hazırlanıyor...</h2>
          </div>
        )}
      </main>

      <footer className="ml-64 bg-transparent p-8 opacity-60 mt-8">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
          <span>VitalGuard Network v3.1.0 • BLE Signal Response System</span>
          <span>Secure Network Node — Encrypted_Session_4410</span>
        </div>
      </footer>
    </div>
  );
}

export default App;