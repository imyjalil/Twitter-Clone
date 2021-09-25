const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const Post=require('../../schemas/PostSchema')
const auth=require('../../middleware/auth')
const User=require('../../schemas/UserSchema')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get("/:username",auth,async(req,res,next)=>{
    username=req.params.username
    var user=await User.findOne({username:username})
    if(user==null){
        return res.status(404).send({
            userLoggedIn:req.user,
            errorMessage:'User not found'
        })
    }
    return res.status(200).send({
        userLoggedIn:req.user,
        profileUser:user
    });
})

module.exports=router