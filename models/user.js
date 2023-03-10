const mongoose=require('mongoose');
const Schema=mongoose.Schema;


const passportLocalMongoose=require('passport-local-mongoose');

const userSchema=new Schema({
    firstName:{
       type:String,
       default:''
    },
    lastName:{
        type:String,
        deault:''
    },
    facebookId:String,
    admin:{
        type:Boolean,
        default:false
    }
});

userSchema.plugin(passportLocalMongoose);


module.exports=mongoose.model('Users',userSchema);


