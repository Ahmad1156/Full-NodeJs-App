const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const promoSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    label:{
        type:String,
        default:''
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    }
});

const promotions=mongoose.model('promotions',promoSchema);

module.exports=promotions;