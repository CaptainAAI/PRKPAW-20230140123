import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

function DashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('mahasiswa');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Update waktu setiap detik
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Ambil nama user dari token jika ada
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        try {
          const decoded = jwtDecode(token);
          setUserName(decoded.nama || 'User');
          setUserRole(decoded.role || 'mahasiswa');
          setUserId(decoded.id);
        } catch (error) {
          console.error('Error decoding token:', error);
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    }

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token'); // Hapus token dari local storage
    }
    navigate('/login'); // Arahkan kembali ke halaman login
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`min-h-screen ${
      userRole === 'admin' 
        ? 'bg-gradient-to-br from-purple-700 via-red-600 to-pink-700' 
        : 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800'
    }`}>
      {/* Header dengan Logout Button */}
      <nav className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{userRole === 'admin' ? '👑' : '📊'}</span>
              <h1 className="text-white text-2xl font-bold">
                {userRole === 'admin' ? 'Admin Dashboard' : 'Dashboard Mahasiswa'}
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition transform hover:scale-105"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 transform hover:scale-[1.02] transition duration-300">
          <div className="text-center">
            <div className="mb-4">
              <span className="text-6xl">{userRole === 'admin' ? '👨‍💼' : '👨‍🎓'}</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              Selamat Datang, {userName}!
            </h2>
            <p className="text-xl text-gray-600 mb-4">
              {userRole === 'admin' ? 'Dashboard Administrator' : 'Dashboard Mahasiswa'}
            </p>
            <div className="flex justify-center gap-3">
              <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                ✓ Status: Aktif
              </div>
              <div className={`inline-block px-4 py-2 rounded-full font-semibold ${
                userRole === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userRole === 'admin' ? '👑 Admin' : '📚 Mahasiswa'}
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Time Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">Waktu</h3>
              <span className="text-3xl">🕐</span>
            </div>
            <p className="text-3xl font-bold text-blue-600">{formatTime(currentTime)}</p>
            <p className="text-sm text-gray-500 mt-2">{formatDate(currentTime)}</p>
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                {userRole === 'admin' ? 'Total User' : 'Aktivitas'}
              </h3>
              <span className="text-3xl">{userRole === 'admin' ? '👥' : '📈'}</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {userRole === 'admin' ? '128' : '5'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {userRole === 'admin' ? 'Pengguna Terdaftar' : 'Tugas Selesai Hari Ini'}
            </p>
          </div>

          {/* Notification Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition duration-300">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-700">
                {userRole === 'admin' ? 'Pending' : 'Notifikasi'}
              </h3>
              <span className="text-3xl">{userRole === 'admin' ? '⏳' : '🔔'}</span>
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {userRole === 'admin' ? '12' : '3'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {userRole === 'admin' ? 'Validasi Menunggu' : 'Pesan Baru'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            {userRole === 'admin' ? 'Menu Admin' : 'Menu Mahasiswa'}
          </h3>
          
          {userRole === 'admin' ? (
            // Menu untuk Admin
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">👥</div>
                <div className="font-semibold">Kelola User</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-red-400 to-red-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📊</div>
                <div className="font-semibold">Laporan</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">✅</div>
                <div className="font-semibold">Validasi Presensi</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">⚙️</div>
                <div className="font-semibold">Pengaturan</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📈</div>
                <div className="font-semibold">Statistik</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-pink-400 to-pink-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📢</div>
                <div className="font-semibold">Pengumuman</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-indigo-400 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📝</div>
                <div className="font-semibold">Buat Tugas</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-teal-400 to-teal-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">🗂️</div>
                <div className="font-semibold">Arsip</div>
              </button>
            </div>
          ) : (
            // Menu untuk Mahasiswa
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-6 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📝</div>
                <div className="font-semibold">Presensi</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📊</div>
                <div className="font-semibold">Laporan</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">📚</div>
                <div className="font-semibold">Tugas Saya</div>
              </button>
              <button className="p-6 bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300">
                <div className="text-4xl mb-2">👤</div>
                <div className="font-semibold">Profil</div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

