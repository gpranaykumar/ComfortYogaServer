const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl ={
    register: async (req, res) => {
        try{
            // batch, status, lastPayment
            const {name, email, password, gender, dob, phoneNo, avatar} = req.body
            if(!name || !email || !password || !gender || !dob || !phoneNo  || !avatar){
                return res.status(400).json({ msg: "Please fill in all fields."})
            }

            if(!validateEmail(email)){
                return res.status(400).json({ msg: "Invalid email."}) 
            }
            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists."})
            if(password.length < 6) return res.status(400).json({msg: "Password must be at least 6 characters."})


            //const passwordHash = await bcrypt.hash(password, 12)
            const passwordHash = password

            const newUser = new Users({
                name, email, password: passwordHash, gender, dob, phoneNo, avatar
            })

            const resNewUser = await newUser.save()

            res.json({msg: "Account Created Successfully", resNewUser})
            
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try{
            const {email, password} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email does not exist."})

            //const isMatch = await bcrypt.compare(password, user.password)
            const isMatch = (password === user.password)
            if(!isMatch) return res.status(400).json({ msg: "Password is incorrect."})

            const refresh_token = createRefreshToken({id: user._id})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 //7days
            })

            res.json({msg: "Login success!", refreshtoken:refresh_token })
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getAccessToken: (req, res) => {
        try {
            //console.log("accestoken ------------")
            // console.log(req.body.refreshtoken)
            // const rfToken = req.cookies.refreshtoken
            // console.log(JSON.stringify(req.headers));
            // console.log("req.cookies: ", req.headers)
            const rfToken = req.body.refreshtoken
            console.log("rfToken: ", rfToken)
            if(!rfToken) return res.status(400).json({msg: "Please login now!"})

            jwt.verify(rfToken, process.env.REFRESH_TOKEN_SECRET, (err, user)=> {
                if(err) return res.status(400).json({msg: "Please login now!"})
                const accessToken = createAccessToken({id: user.id})
                res.json({accessToken})
            })
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getUserInfor: async (req, res) => {
        try{
            const user = await Users.findById(req.user.id).select('-password')
            //console.log(user)
            res.json({user})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getUsersAllInfor: async (req, res) => {
        try{      
            const users = await Users.find().select('-password').sort({"updatedAt":-1})
            res.json({users})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    logout: async (req, res) => {
        try{
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logged out."})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    updateUserStatus: async (req, res) => {
        try{
            const {status} = req.body
            await Users.findOneAndUpdate({_id: req.user.id}, {
                status
            })
            res.json({msg: "Update Success"})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
}
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m'})
}
const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d'})
}
module.exports = userCtrl