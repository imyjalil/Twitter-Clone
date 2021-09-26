const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const Post=require('../../schemas/PostSchema')
const auth=require('../../middleware/auth')
const User=require('../../schemas/UserSchema')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.put("/:userId/follow",auth,async(req,res,next)=>{
    var userId=req.params.userId
    var user=await User.findById(userId)
    if(user==null){
        return res.sendStatus(404)
    }
    var isFollowing=user.followers && user.followers.includes(req.user._id)
    var option = isFollowing?"$pull":"$addToSet"

    req.user = await User.findByIdAndUpdate(req.user._id,{[option]:{following:userId}},{new:true})
    .catch((error)=>{
        console.log(error)
        return res.sendStatus(400)
    })

    User.findByIdAndUpdate(userId,{[option]:{followers:req.user._id}})
    .catch((error)=>{
        console.log(error)
        return res.sendStatus(400)
    })

    res.status(200).send(req.user)
})

module.exports = router