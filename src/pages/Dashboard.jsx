import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

// Fix for Leaflet icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ariza');
      setReports(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Hata:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  const updateStatus = async (report, newStatus) => {
    const updatedReport = { ...report, status: parseInt(newStatus) };
    try {
      await axios.put(`http://localhost:5000/api/ariza/${report.id}`, updatedReport);
      fetchReports();
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Durum Güncellendi', showConfirmButton: false, timer: 1500 });
    } catch (error) { Swal.fire('Hata!', 'Güncelleme başarısız.', 'error'); }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({ title: 'Emin misiniz?', text: "Bu işlem geri alınamaz!", icon: 'warning', showCancelButton: true, confirmButtonText: 'Evet, sil!' });
    if (result.isConfirmed) {
      await axios.delete(`http://localhost:5000/api/ariza/${id}`);
      fetchReports();
    }
  };

  if (loading) return <div className="text-center mt-5">Yükleniyor...</div>;

  return (
    <div className="admin-container">
      <div className="container">
        <h2 className="dashboard-title"><i className="fa-solid fa-toolbox"></i> Belediye Yönetim Paneli</h2>
        
        {/* الخريطة العلوية مع شرط التأكد من الإحداثيات */}
        <div style={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        <MapContainer center={[36.9188, 34.8783]} zoom={13} style={{ height: '400px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {reports.map((r) => {
            // التأكد من أن الإحداثيات أرقام صحيحة وليست 0 أو فارغة
            const hasValidCoords = r.latitude && r.longitude && r.latitude !== 0;
            
            return hasValidCoords ? (
                <Marker key={r.id} position={[r.latitude, r.longitude]}>
                <Popup>
                    <div style={{ textAlign: 'left' }}>
                    <strong>{r.category}</strong><br/>
                    {r.description.substring(0, 50)}...
                    </div>
                </Popup>
                </Marker>
            ) : null;
            })}
        </MapContainer>
        </div>

        {/* شبكة الكروت (3 في السطر دائماً بفضل CSS Grid) */}
        <div className="cards-grid">
          {reports.map((r) => (
            <div className="report-card" key={r.id}>
              
              {/* الصورة */}
              <div className="card-img-container">
                {r.photoPath && r.photoPath !== "no-photo.png" ? (
                  <img src={`http://localhost:5000/uploads/${r.photoPath}`} alt="Arıza" />
                ) : (
                  <img src={`http://localhost:5000/uploads/no-photo.png`} alt="Görsel Yok" />
                )}
              </div>

              {/* المحتوى */}
              <div className="card-content">
                <h5 className="card-title-text">{r.category}</h5>
                <p className="card-desc-text">{r.description}</p>
                
                {/* تغيير الحالة */}
                <div className="status-section">
                  <span className="status-label">Durumu Değiştir</span>
                  <select 
                    className="custom-select" 
                    value={r.status}
                    onChange={(e) => updateStatus(r, e.target.value)}
                  >
                    <option value="0">Yeni (New)</option>
                    <option value="1">Onaylandı (Approved)</option>
                    <option value="2">İşlemde (In Progress)</option>
                    <option value="3">Tamamlandı (Done)</option>
                  </select>
                </div>

                {/* التذييل (الآي دي وزر الحذف) */}
                <div className="card-footer-custom">
                  <span className="id-badge">ID: #{r.id}</span>
                  <button className="delete-btn" onClick={() => handleDelete(r.id)}>
                    <i className="fa-solid fa-trash"></i> Sil
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;