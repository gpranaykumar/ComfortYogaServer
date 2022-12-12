const Payments = require('../models/PaymentModel')
const Users = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const paymentCtrl ={
    add: async (req, res) => {
        try{
            const {userId, TransactionId, batch, status, name } = req.body
            if(!userId || !TransactionId || !batch || !status || !name){
                return res.status(400).json({ msg: "All fields are required."})
            }
            const newPayment = new Payments({
                userId, TransactionId, batch, status, name
            })
            await newPayment.save()

            // console.log("userAddPayment: ", user)
            if(status === 'success'){
                await Users.findOneAndUpdate({_id: userId}, {
                    batch, status: "Active"  ,lastPayment: new Date()
                })
                res.json({msg: "Payment Successfully"})
            }else{
                res.json({msg: "Payment Declined"})
            }
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getUserPayments: async (req, res) => {
        try{      
            console.log("getUserPayment: ",req.user.id)
            const result = await Payments.find({userId: req.user.id}).sort({"updatedAt":-1})
            res.json({result})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
    getAllPayments: async (req, res) => {
        try{      
            const result = await Payments.find().sort({"updatedAt":-1})
            res.json({result})
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = paymentCtrl