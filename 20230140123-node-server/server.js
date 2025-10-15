// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// --- Routing dasar ---
app.get('/', (req, res) => {
  res.send('📚 Home Page for API');
});

// --- Routing Buku ---
const bookRoutes = require('./routes/books');
app.use('/api/books', bookRoutes);

// --- Jalankan server ---
app.listen(PORT, () => {
  console.log(`✅ Express server running at http://localhost:${PORT}/`);
});
