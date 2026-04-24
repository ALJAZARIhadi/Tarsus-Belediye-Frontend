import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Kullanacağız aynı stili / We will use the same style

function Login() {
  // State for login data / Giriş verileri için state
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // Form submit handler / Form gönderim işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save user to localStorage / Kullanıcıyı kaydet
      localStorage.setItem('user', JSON.stringify(response.data));

      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Giriş Başarılı.',
        showConfirmButton: false,
        timer: 1500
      });

      // Role based routing / Role göre yönlendirme
      setTimeout(() => {
        if (response.data.role === 'Auditor') {
          navigate('/admin'); // توجيه المدقق
        } else {
          navigate('/'); // توجيه المواطن
        }
      }, 1500);

    } catch (error) {
      Swal.fire('Hata!', 'Kullanıcı adı veya şifre hatalı.', 'error');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2><i className="fa-solid fa-right-to-bracket"></i> Sisteme Giriş</h2>
        <p>Login/Giriş Paneline Hoş Geldiniz</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group-custom">
            <label>Kullanıcı Adı</label>
            <input 
              type="text" 
              required 
              onChange={(e) => setFormData({...formData, username: e.target.value})} 
              placeholder="Kullanıcı adınızı girin" 
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

          <button type="submit" className="auth-btn">Giriş Yap</button>
        </form>
      </div>
    </div>
  );
}

export default Login;