import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Stil dosyası / Style file

function Register() {
  // Form verilerini tutmak için state / State to hold form data
  const [formData, setFormData] = useState({ username: '', password: '', fullName: '' });
  const navigate = useNavigate();

  // Form gönderim işlemi / Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API'ye kayıt isteği gönderme / Sending register request to API
      await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Başarılı mesajı / Success message
      Swal.fire('Başarılı!', 'Denetmen hesabı başarıyla oluşturuldu.', 'success');
      
      // Giriş sayfasına yönlendirme / Redirect to login page
      navigate('/login'); 
    } catch (error) {
      // Hata mesajı / Error message
      Swal.fire('Hata!', error.response?.data || 'Kayıt sırasında bir hata oluştu.', 'error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2><i className="fa-solid fa-user-plus"></i> Hesabınızı Oluşturun</h2>
        <p>Hesap Oluşturma Paneli</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group-custom">
            <label>Ad Soyad</label>
            <input 
              type="text" 
              required 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              placeholder="Örn: Ahmet Yılmaz" 
            />
          </div>

          <div className="input-group-custom">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              required 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              placeholder="denetmen_1" 
            />
          </div>

          <div className="input-group-custom">
            <label>Şifre</label>
            <input 
              type="password" 
              required 
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
              placeholder="********" 
            />
          </div>

          <button type="submit" className="auth-btn">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
}

export default Register;