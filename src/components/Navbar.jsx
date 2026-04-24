import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Stil dosyası / Style file

function Navbar() {
  const navigate = useNavigate();
  // Kullanıcı bilgisini al / Get user data from localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Çıkış yapma fonksiyonu / Logout function
  const handleLogout = () => {
    localStorage.removeItem('user'); // Veriyi sil / Clear data
    navigate('/login'); // Giriş sayfasına yönlendir / Redirect to login
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-container">
        {/* Logo / Title */}
        <Link to="/" className="navbar-logo">
          <i className="fa-solid fa-city"></i> Tarsus Belediyesi
        </Link>

        {/* Linkler / Links */}
        <div className="navbar-links">
          
          {/* Eğer kullanıcı ADMIN ise / If user is Admin */}
          {user?.role === 'Admin' && (
            <>
              <Link to="/admin" className="nav-link">Bildirim Yönetimi</Link>
              <Link to="/admin/users" className="nav-link">Kullanıcı Yönetimi</Link>
              <Link to="/about" className="nav-link">Hakkımızda</Link>
            </>
          )}

          {/* Eğer kullanıcı SADECE DENETMEN ise / If user is ONLY Auditor */}
          {user?.role === 'Auditor' && (
            <>
              <Link to="/admin" className="nav-link">Bildirim Yönetimi</Link>
              <Link to="/about" className="nav-link">Hakkımızda</Link>
            </>
          )}

          {/* Eğer kullanıcı VATANDAŞ ise veya GİRİŞ YAPMAMIŞSA / If Citizen or Guest */}
          {(user?.role === 'Citizen' || !user) && (
            <>
              <Link to="/" className="nav-link">Bildirim Oluştur</Link>
              <Link to="/about" className="nav-link">Hakkımızda</Link>
            </>
          )}

        </div>

        {/* Giriş / Çıkış Butonları - Auth Buttons */}
        <div className="navbar-auth">
          {user ? (
            // Kullanıcı giriş yapmışsa / If logged in
            <div className="user-menu">
              <span className="welcome-text">Merhaba, {user.fullName}</span>
              <button onClick={handleLogout} className="logout-btn">
                <i className="fa-solid fa-right-from-bracket"></i> Çıkış Yap
              </button>
            </div>
          ) : (
            // Giriş yapmamışsa / If not logged in
            <>
              <Link to="/login" className="login-btn">Giriş Yap</Link>
              <Link to="/register" className="register-btn">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;