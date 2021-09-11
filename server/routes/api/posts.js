const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const Post=require('../../schemas/PostSchema')
const auth=require('../../middleware/auth')
const User=require('../../schemas/UserSchema')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get("/",auth,(req,res,next)=>{
    Post.find()
    .populate("postedBy")
    .sort({"createdAt":-1})
    .then((results)=>{
        res.status(200).send(results)
    })
    .catch((error)=>{
        console.log(error)
        res.sendStatus(400)
    })
})

router.post("/", auth, async (req, res, next) => {
    
    if(!req.body.content){
        return res.sendStatus(400)
    }

    var postData = {
        content:req.body.content,
        postedBy:req.user
    }

    Post.create(postData)
    .then(async(newPost)=>{
        newPost=await User.populate(newPost,{path:"postedBy"})
        return res.status(201).send(newPost)
    })
    .catch(error=>{
        console.log(error)
        res.sendStatus(400)
    })

})

router.put("/:id/like", auth, async (req, res, next) => {
    
    var postId = req.params.id
    var userId = req.user._id
    
    var isLiked=req.user.likes && req.user.likes.includes(postId)
    var option=isLiked?"$pull":"$addToSet"
    //insert like in user
    await User.findByIdAndUpdate(userId,{[option]:{likes:postId}},{new:true}).catch((error)=>{
        console.log(error)
        return res.sendStatus(400)
    })
    
    //insert like in post
    var post=await Post.findByIdAndUpdate(postId,{[option]:{likes:userId}},{new:true}).catch((error)=>{
        console.log(error)
        return res.sendStatus(400)
    })

    res.status(200).send(post)
})

module.exports = router