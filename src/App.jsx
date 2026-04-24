import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CitizenPage from './pages/CitizenPage';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import Navbar from './components/Navbar'; 
import UserManagement from './pages/UserManagement';
import About from './pages/About';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<CitizenPage />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/users" element={<UserManagement />} /> 
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;