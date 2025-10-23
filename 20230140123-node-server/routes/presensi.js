// routes/presensi.js
console.log('🟢 [presensi.js] Router file loaded');

const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');

router.use(addUserData);
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

console.log('🟢 [presensi.js] Routes registered:');
router.stack.forEach(r => {
  if (r.route) console.log('   ', Object.keys(r.route.methods), r.route.path);
});

module.exports = router;
