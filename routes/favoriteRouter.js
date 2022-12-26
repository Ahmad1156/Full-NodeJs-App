const express=require('express');
const favRouter=express.Router();
const authenticate=require('../authentication/authenticate');
const Favorites=require('../models/favorite');



favRouter.route('/').
get(authenticate.verifyUser,async(req,res,next)=>{
    try {
        //only the favorites of this specific person
       const favoriteDishes=await Favorites.findOne({user:req.user._id}).populate('user dishes');//populate information of both dishes and users
       res.statusCode=200;
       res.json(favoriteDishes);
    } catch (error) {
       next(error);
    }
})
.post(authenticate.verifyUser,async(req,res,next)=>{
    try{
      const user=await Favorites.find({user:req.user._id});
     if(user!=null){
        for(var i=0;i<req.body.length;i++){
            user[0].dishes.push(req.body[i]);
        }
        await user[0].save();
        res.statusCode=200;
        res.json(user);
    }
    else{
        const newFavorite=await Favorites.create({
            user:req.user._id,//we get from the authentication payload
        });
        for(var i=0;i<req.body.length;i++){
            newFavorite.dishes.push(req.body[i]);
        }
        await newFavorite.save();
        res.statusCode=200;
        res.json(newFavorite);
    }}
    catch(error){
        next(error);
    }
})
.delete(authenticate.verifyUser,async(req,res,next)=>{
    try{
        const deleteAllfavorites=await Favorites.findOneAndRemove({user:req.user._id});
        res.statusCode=200;
        res.json(deleteAllfavorites);
    }catch(err){
       next(err);
    }
})


favRouter.route('/:dishId')
.post(authenticate.verifyUser,async(req,res,next)=>{
    try {
        const user=await Favorites.findOne({user:req.user._id});
        if(user==null){
            const newDish=await Favorites.create({ user:req.user._id});
            newDish.dishes.push(req.params.dishId);
            await newDish.save();
            res.statusCode=200;
            res.json(newDish);
        }else{
            user.dishes.push(req.params.dishId);
            await user.save();
            res.statusCode=200;
            res.json(user);
        }   
    } catch (error) {
        next(error);
    }
})
.delete(authenticate.verifyUser,async(req,res,next)=>{
    try {
        var favoriteDishes=await Favorites.findOne({user:req.user._id}).populate('dishes');
        favoriteDishes.dishes=favoriteDishes.dishes.filter((dish)=>dish._id.toString()!==req.params.dishId);
        await favoriteDishes.save();
        res.statusCode=200;
        res.json(favoriteDishes);
    
    } catch (error) {
        next(error);
    }
})

module.exports=favRouter;

