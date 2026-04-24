import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Bildirim kütüphanesi - Notification library
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css'; // Özel stillerimiz - Our custom styles

// Harita ikonu sorunu çözümü - Fixing map icon issue
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Haritada tıklanan yeri yakalama bileşeni - Component to catch clicked location on map
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
}

function CitizenPage() {
  // Durum değişkenleri - State variables
  const [photoFile, setPhotoFile] = useState(null);
  const [position, setPosition] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
  });

  // Form gönderimi - Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      Swal.fire({ icon: 'warning', title: 'Konum Eksik!', text: 'Lütfen harita üzerinden arıza noktasını seçiniz.' });
      return;
    }

    // استخدام FormData لإرسال الملفات بشكل صحيح
    const formDataToSend = new FormData();
    formDataToSend.append('category', formData.category);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('Latitude', position.lat.toString().replace('.', ','));
    formDataToSend.append('Longitude', position.lng.toString().replace('.', ','));
    
    if (photoFile) {
      formDataToSend.append('photo', photoFile); // إرفاق الصورة
    }

    try {
      const response = await axios.post('http://localhost:5000/api/ariza', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' } // إخبار السيرفر أننا نرسل ملفات
      });
      
      Swal.fire({ icon: 'success', title: 'Başarılı!', text: `Bildiriminiz alınmıştır. Kayıt No: ${response.data.id}` });
      setFormData({ category: '', description: '' });
      setPosition(null);
      setPhotoFile(null); // تفريغ الصورة
      document.getElementById('photo').value = ''; // تفريغ حقل الإدخال
    } catch (error) {
      console.error("Hata:", error);
      Swal.fire({ icon: 'error', title: 'Hata!', text: 'Sunucuya bağlanılamadı.' });
    }
  };

  return (
    <>
      {/* Üst Kısım - Hero Header */}
      <header className="hero-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <h1><i className="fa-solid fa-city"></i> Akıllı Şehir Bildirim Paneli</h1>
          <p>Daha güvenli ve yaşanabilir bir çevre için arızaları bize bildirin.</p>
        </div>
      </header>

      {/* Ana İçerik - Main Content */}
      <main className="container">
        <section className="form-container shadow-lg">
          <form id="reportForm" onSubmit={handleSubmit}>
            
            {/* Kategori Seçimi - Category Selection */}
            <div className="form-group">
              <label htmlFor="Category"><i className="fa-solid fa-triangle-exclamation"></i> Arıza Türü</label>
              <select 
                id="Category" 
                className="custom-input" 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="" disabled>Lütfen bir tür seçiniz...</option>
                <option value="Yol Çukuru">Yol Çukuru</option>
                <option value="Sokak Lambası">Sokak Lambası</option>
                <option value="Kaldırım Hasarı">Kaldırım Hasarı</option>
                <option value="Su Patlağı">Su Patlağı</option>
                <option value="Diğer">Diğer</option>
              </select>
            </div>

            {/* Açıklama - Description */}
            <div className="form-group">
              <label htmlFor="Description"><i className="fa-solid fa-align-left"></i> Arıza Açıklaması</label>
              <textarea 
                id="Description" 
                className="custom-input" 
                rows="3" 
                placeholder="Arıza hakkında detaylı bilgi yazınız..." 
                required
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Harita - Map */}
            <div className="form-group">
              <label><i className="fa-solid fa-map-location-dot"></i> Arıza Konumu <span className="text-muted">(Harita üzerinden tam noktayı seçin)</span></label>
              <MapContainer center={[36.9188, 34.8784]} zoom={12.2} className="map-box">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>

            {/* Fotoğraf Yükleme - Photo Upload */}
            <div className="form-group">
              <label htmlFor="photo"><i className="fa-solid fa-camera"></i> Fotoğraf Yükle (İsteğe Bağlı)</label>
            <input 
            type="file" 
            id="photo" 
            accept="image/*" 
            className="custom-input file-input" 
            onChange={(e) => setPhotoFile(e.target.files[0])} 
            />            
            </div>

            {/* Gönder Butonu - Submit Button */}
            <button type="submit" className="btn-submit">
              <i className="fa-solid fa-paper-plane"></i> Bildirimi Gönder
            </button>
            
          </form>
        </section>
      </main>

      {/* Alt Kısım - Footer */}
      <footer className="site-footer">
        <p>&copy; 2026 Akıllı Şehir Yönetim Sistemi - Tüm Hakları Saklıdır.</p>
      </footer>
    </>
  );
}

export default CitizenPage;