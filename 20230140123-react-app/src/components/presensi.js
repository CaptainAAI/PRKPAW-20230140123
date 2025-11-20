import React, { useState } from "react";
import axios from "axios";

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingIn, setLoadingIn] = useState(false);
  const [loadingOut, setLoadingOut] = useState(false);

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleCheckIn = async () => {
    setError("");
    setMessage("");
    setLoadingIn(true);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Lakukan Presensi</h2>
        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            disabled={loadingIn || loadingOut}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 disabled:opacity-60"
          >
            {loadingIn ? "Memproses..." : "Check-In"}
          </button>
          <button
            onClick={handleCheckOut}
            disabled={loadingIn || loadingOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 disabled:opacity-60"
          >
            {loadingOut ? "Memproses..." : "Check-Out"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
