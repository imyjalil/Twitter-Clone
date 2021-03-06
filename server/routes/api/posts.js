const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const Post=require('../../schemas/PostSchema')
const auth=require('../../middleware/auth')
const User=require('../../schemas/UserSchema')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.get("/",auth,async(req,res,next)=>{
    var searchObj=req.query
    if(searchObj.isReply!==undefined){
        var isReply=searchObj.isReply=="true"
        searchObj.replyTo={$exists:isReply}
        delete searchObj.isReply
    }

    if(searchObj.followingOnly !== undefined){
        var followingOnly=searchObj.followingOnly=="true"
        if(followingOnly){
            var objectIds=[]
            if(!req.user.following){
                req.user.following=[]
            }
            req.user.following.forEach(user=>{
                objectIds.push(user._id)
            })
            objectIds.push(req.user._id)
            searchObj.postedBy={$in:objectIds}
        }
        delete searchObj.followingOnly
    }
    var results = await getPosts(searchObj);
    res.status(200).send(results);
})

router.get("/:id",auth,async(req,res,next)=>{
    var postId=req.params.id
    var results = await getPosts({_id:postId});
    results=results[0]
    res.status(200).send(results);
})

router.post("/", auth, async (req, res, next) => {
    if(!req.body.content){
        return res.sendStatus(400)
    }

    var postData = {
        content:req.body.content,
        postedBy:req.user
    }

    if(req.body.replyTo){
        postData.replyTo = req.body.replyTo
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

router.put("/:id",auth,async(req,res,next)=>{
    
    if(req.body.pinned !== undefined){
        var pinnedPost=await getPosts({pinned:true})
        if(pinnedPost !== null && pinnedPost.length !== 0){
            req.body.pinned=false
        }
        await Post.updateMany({postedBy:req.user._id},{pinned:false})
        .catch((error)=>{
            console.log(error)
            res.sendStatus(400)
        })
    }
    var postId=req.params.id
    Post.findByIdAndUpdate(postId,req.body)
        .then(()=>res.sendStatus(204))
        .catch(error=>{
            console.log(error)
            res.sendStatus(400)
        })
})

router.post("/:id/retweet", auth, async (req, res, next) => {
    var postId=req.params.id
    var userId=req.user._id

    var deletedPost=await Post.findOneAndDelete({postedBy:userId,retweetData:postId})
    .catch((error)=>{
        console.log(error)
        return res.sendStatus(400)
    })

    var option=deletedPost != null?"$pull":"$addToSet"

    var repost=deletedPost

    if(repost==null){
        repost=await Post.create({postedBy:userId,retweetData:postId})
        .catch((error)=>{
            console.log(error)
            res.sendStatus(400)
        })
    }

    await User.findByIdAndUpdate(userId,{[option]:{retweets:repost._id}},{new:true})

    var post=await Post.findByIdAndUpdate(postId,{[option]:{retweetUsers:userId}},{new:true})
    .catch((error)=>{
        console.log(error)
        res.sendStatus(400)
    })

    return res.status(200).send(post)
})

router.delete("/:id",auth,async(req,res,next)=>{
    var postId=req.params.id
    Post.findByIdAndDelete(postId)
        .then(()=>res.sendStatus(202))
        .catch(error=>{
            console.log(error)
            res.sendStatus(400)
        })
})

async function getPosts(filter){
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ "createdAt": -1 })
    .catch(error => console.log(error))

    results=await User.populate(results,{path:"replyTo.postedBy"})
    return await User.populate(results, { path: "retweetData.postedBy"});
}

module.exports = router