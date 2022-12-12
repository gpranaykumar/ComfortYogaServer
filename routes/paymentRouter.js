const router = require('express').Router();
const paymentCtrl = require('../controllers/paymentCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.post('/add', paymentCtrl.add)

router.get('/user', auth, paymentCtrl.getUserPayments)
router.get('/all', auth, authAdmin, paymentCtrl.getAllPayments)

module.exports = router;