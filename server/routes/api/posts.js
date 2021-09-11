const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const Post=require('../../schemas/PostSchema')
const auth=require('../../middleware/auth')
const User=require('../../schemas/UserSchema')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

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

module.exports = router