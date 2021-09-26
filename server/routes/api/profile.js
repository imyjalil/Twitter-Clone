const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const Post=require('../../schemas/PostSchema')
const auth=require('../../middleware/auth')
const User=require('../../schemas/UserSchema')

require('dotenv').config()
const aws=require('aws-sdk')
const multerS3=require('multer-s3')
const multer=require('multer')
const path=require('path')

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

const s3 = new aws.S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey:process.env.secretAccessKey,
    Bucket:process.env.bucket
})

const profileImgUpload = multer({
    storage: multerS3({
     s3: s3,
     bucket: process.env.bucket,
     acl: 'public-read',
     key: function (req, file, cb) {
         var newFileName="profilepic/"+req.user.username+path.extname( file.originalname )
      cb(null, newFileName)
     }
    }),
    limits:{ fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
    fileFilter: function( req, file, cb ){
     checkFileType( file, cb );
    }
   }).single('profileImage');

function checkFileType( file, cb ){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test( path.extname( file.originalname ).toLowerCase());
    // Check mime
    const mimetype = filetypes.test( file.mimetype );
    if( mimetype && extname ){
    return cb( null, true );
    } else {
    cb( 'Error: Images Only!' );
    }
}

router.post( '/profile-img-upload', auth, ( req, res ) => {
    profileImgUpload( req, res, async( error ) => {
      
      if( error ){
       console.log( 'errors', error );
       res.json( { error: error } );
      } else {
       // If File not found
       if( req.file === undefined ){
        console.log( 'Error: No File Selected!' );
        res.json( 'Error: No File Selected' );
       } else {
        // If Success
        const imageName = req.file.key;
        const imageLocation = req.file.location;
        var user=await User.findByIdAndUpdate(req.user._id,{profilePic:imageLocation},{new:true})
        req.user=user
        return res.status(204).send( {
         image: imageName,
         location: imageLocation,
         userLoggedIn:user
        } );
       }
      }
     });
    });

module.exports=router