const jwt = require('jsonwebtoken');

// NOTE: For simplicity we reuse the same secret as in authController.
// In a real project move this to a shared config or environment variable.
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'] || req.headers['Authorization'];
	if (!authHeader) {
		return res.status(401).json({ message: 'Token tidak disertakan' });
	}

	const token = authHeader.startsWith('Bearer ')
		? authHeader.slice(7)
		: authHeader;

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Token tidak valid atau kadaluarsa' });
	}
};

exports.isAdmin = (req, res, next) => {
	if (req.user && req.user.role === 'admin') {
		console.log('Middleware: Izin admin diberikan.');
		next();
	} else {
		console.log('Middleware: Gagal! Pengguna bukan admin.');
		return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
	}
};