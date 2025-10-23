// middleware/permissionMiddleware.js

// Middleware untuk menambahkan data user (dummy)
exports.addUserData = (req, res, next) => {
  console.log('Middleware: Menambahkan data user dummy...');
  req.user = {
    id: 20230140123,
    nama: 'Alexander Ananda',
    role: 'admin' // ubah ke 'admin' kalau mau test laporan harian
  };
  next();
};

// Middleware untuk izin akses admin
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan.');
    next(); // lanjut ke controller
  } else {
    console.log('Middleware: Gagal! Pengguna bukan admin.');
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
  }
};
