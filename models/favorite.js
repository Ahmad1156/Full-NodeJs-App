const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const User=require('./user');
const Dish=require('./dishes');

const favoriteSchema=new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    dishes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:Dish
    }
},{
        timestamps:true
});

module.exports=mongoose.model('favorites',favoriteSchema);

