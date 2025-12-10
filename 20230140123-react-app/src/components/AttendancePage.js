import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Webcam from 'react-webcam';
import 'leaflet/dist/leaflet.css';

// Fix untuk icon marker Leaflet
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

function PresensiPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [image, setImage] = useState(null); // Simpan foto
  const webcamRef = useRef(null); // Referensi webcam

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fungsi untuk capture foto dari webcam
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // Fungsi untuk mendapatkan lokasi pengguna
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setError(""); // Clear error jika berhasil
        },
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // Dapatkan lokasi saat komponen dimuat
  useEffect(() => {
    getLocation();
  }, []);

  const handleCheckIn = async () => {
    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    if (!image) {
      setError("Foto wajib ada! Silakan ambil foto terlebih dahulu.");
      return;
    }
    
    setError("");
    setMessage("");
    setLoadingIn(true);
    
    try {
      // Convert base64 image ke blob
      const blob = await (await fetch(image)).blob();
      
      // Buat FormData untuk mengirim file
      const formData = new FormData();
      formData.append('latitude', coords.lat);
      formData.append('longitude', coords.lng);
      formData.append('image', blob, 'selfie.jpg'); // Field name harus 'image' sesuai multer
      
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data' // Multer akan handle ini
          },
        }
      );
      setMessage(response.data.message);
      setImage(null); // Reset foto
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Check-in gagal. Coba lagi."
      );
    } finally {
      setLoadingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setError("");
    setMessage("");
    setLoadingOut(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Check-out gagal. Coba lagi."
      );
    } finally {
      setLoadingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800">
      {/* Header dengan tombol kembali */}
      <nav className="bg-white bg-opacity-10 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📝</span>
              <h1 className="text-white text-2xl font-bold">Presensi Mahasiswa</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white font-semibold rounded-lg shadow-md hover:bg-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition transform hover:scale-105"
            >
              <span>←</span>
              <span>Kembali</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-12 gap-6">
        {/* Visualisasi Peta */}
        {coords && (
          <div className="my-4 border rounded-lg overflow-hidden w-full max-w-md shadow-lg">
            <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '300px', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Webcam untuk Selfie */}
        <div className="my-4 border rounded-lg overflow-hidden bg-black w-full max-w-md shadow-lg">
          {image ? (
            <img src={image} alt="Selfie" className="w-full h-80 object-cover" />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-80 object-cover"
            />
          )}
        </div>

        {/* Tombol Ambil/Ulang Foto */}
        <div className="w-full max-w-md">
          {!image ? (
            <button
              onClick={capture}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
              📸 Ambil Foto
            </button>
          ) : (
            <button
              onClick={() => setImage(null)}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-semibold transition"
            >
              🔄 Foto Ulang
            </button>
          )}
        </div>

        {/* Card Check In dan Check Out */}
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Lakukan Presensi</h2>
            <p className="text-gray-600">Pilih check-in untuk masuk atau check-out untuk keluar</p>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>{message}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Status Lokasi */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700">
              <span>📍</span>
              <span className="font-semibold text-sm">
                {coords 
                  ? `Lokasi terdeteksi: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                  : "Menunggu lokasi..."}
              </span>
            </div>
            {!coords && (
              <button
                onClick={getLocation}
                className="mt-2 text-sm text-blue-600 underline hover:text-blue-800"
              >
                Coba lagi mendapatkan lokasi
              </button>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCheckIn}
              disabled={loadingIn || loadingOut}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition duration-300 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📥</span>
              <span className="text-lg">{loadingIn ? "Memproses..." : "Check-In"}</span>
            </button>
            
            <button
              onClick={handleCheckOut}
              disabled={loadingIn || loadingOut}
              className="w-full py-4 px-6 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-red-700 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 transition duration-300 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📤</span>
              <span className="text-lg">{loadingOut ? "Memproses..." : "Check-Out"}</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              💡 <strong>Tips:</strong> Pastikan Anda check-in saat tiba dan check-out saat pulang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PresensiPage;
