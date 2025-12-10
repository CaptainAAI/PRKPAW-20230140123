// routes/presensi.js
console.log('🟢 [presensi.js] Router file loaded');

const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/permissionMiddleware');
const { body, validationResult } = require('express-validator');
router.use(authenticateToken);
router.post('/check-in', presensiController.upload.single('image'), presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);
router.delete('/:id', presensiController.deletePresensi);
router.put('/:id', 
  body('waktuCheckIn').isISO8601().withMessage('waktuCheckIn must be a valid date'),
  body('waktuCheckOut').isISO8601().withMessage('waktuCheckOut must be a valid date'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  presensiController.updatePresensi
);

console.log('🟢 [presensi.js] Routes registered:');
router.stack.forEach(r => {
  if (r.route) console.log('   ', Object.keys(r.route.methods), r.route.path);
});

module.exports = router;
