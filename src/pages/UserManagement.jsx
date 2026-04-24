import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './UserManagement.css'; // Stil dosyası

function UserManagement() {
  const [users, setUsers] = useState([]);

  // Kullanıcıları API'den çek / Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Rol değiştirme / Change role
  const handleRoleChange = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${id}/role`, { role: newRole });
      Swal.fire({ toast: true, position: 'top-end', icon: 'success', title: 'Rol güncellendi', showConfirmButton: false, timer: 1500 });
      fetchUsers(); // Tabloyu yenile / Refresh table
    } catch (error) {
      Swal.fire('Hata!', 'Rol güncellenirken bir hata oluştu.', 'error');
    }
  };

  // Kullanıcı silme / Delete user
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Emin misiniz?',
      text: "Bu kullanıcıyı silmek istediğinize emin misiniz?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, Sil!',
      cancelButtonText: 'İptal'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        Swal.fire('Silindi!', 'Kullanıcı başarıyla silindi.', 'success');
        fetchUsers(); // Tabloyu yenile
      } catch (error) {
        Swal.fire('Hata!', 'Silme işlemi başarısız oldu.', 'error');
      }
    }
  };

  return (
    <div className="users-container">
      <h2><i className="fa-solid fa-users-gear"></i> Kullanıcı Yönetimi</h2>
      <p>Sistemdeki tüm kullanıcıları ve yetkilerini buradan yönetebilirsiniz.</p>

      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ad Soyad</th>
              <th>Kullanıcı Adı</th>
              <th>Yetki (Rol)</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>
                  {/* Rol seçici (Dropdown) */}
                  <select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className={`role-select ${
                      user.role === 'Admin' ? 'role-super' : 
                      user.role === 'Auditor' ? 'role-admin' : 'role-citizen'
                    }`}
                  >
                    <option value="Citizen">Vatandaş (Citizen)</option>
                    <option value="Auditor">Denetmen (Auditor)</option>
                    <option value="Admin">Sistem Yöneticisi (Admin)</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(user.id)} className="delete-user-btn">
                    <i className="fa-solid fa-trash"></i> Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;