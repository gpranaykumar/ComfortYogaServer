const express = require("express");
const router = express.Router();
const userCtrl = require('../controllers/userCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.get('/hello', function(req, res){
    res.send("Hello User");
 });

router.post('/register', userCtrl.register)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)

router.get('/infor', auth, userCtrl.getUserInfor)
router.get('/all_infor', auth, authAdmin, userCtrl.getUsersAllInfor)
router.get('/logout', userCtrl.logout)

router.patch('/updatestatus', auth, userCtrl.updateUserStatus)

module.exports = router;