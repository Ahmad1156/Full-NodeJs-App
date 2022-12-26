const express = require("express");

const cors=require('./cors');
const Comments = require("../models/comments");
const Dishes=require('../models/dishes');
const authenticate = require("../authentication/authenticate");
const commentRouter = express.Router();

commentRouter.route('/')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,async (req, res, next) => {
    try {
      const comments = await Comments.find(req.query).populate(
        "author"
      );
      if (comments != null) {
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(comments);
      }
    } catch (err) {
      next(err);
    }
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    try {
        if(req.body!=null){
            req.body.author=req.user._id;
            const comment=await Comments.create(req.body);
            const popComment=await Comments.findById(comment._id).populate('author');
            res.statusCode=200;
            res.json(popComment);
        }
        else{
            err=new Error('Comment is not found in req body');
            err.status=404;
            return next(err);
        }
    }catch(err){
        next(err);
    }
})
  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      "PUt operations are not supported on /comments/" 
    );
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const removed=await Comments.remove({});
      res.statusCode=200;
      res.json(removed);
    } catch (err) {
      next(err);
    }
  });

//dealing with specific comments

commentRouter
  .route('/:commentId')
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,async (req, res, next) => {
    try {
      const comment = await Comments.findById(req.params.commentId).populate(  "author" );
      res.statusCode = 200;
      res.setHeader("Contet-Type", "application/json");
      res.json(comment);
    } catch (err) {
      next(err);
    }
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /comments/"+req.params.commentId
    );
  })

  .put(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    try {
      const comment = await Comments.findById(req.params.commentId);
      if (comment != null ) {
        if ( comment.author.equals( req.user._id  )){
        req.body.author=req.user._id;
         const updatedComment= await Comments.findByIdAndUpdate(req.params.commentId,{
            $set:req.body
          },{new:true});
          const popComment=Comments.findById(updatedComment._id).populate('author');
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(popComment);
        }
        } else {
          err = new Error("comment " + req.params.commentId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
      } 
    } catch (err) {
      next(err);
    }
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    try {
      const comment = await Comments.findById(req.params.commentId);
      if (dish != null) {
        if(comment.author.equals(req.user._id))
        {
        await Comments.findByIdAndRemove(comment._id);
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(Comments);
      }
      else{
        err = new Error("you are not authorized to do this operation");
        res.statusCode = 404; //not Found
        return next(err);
      }}
     else {
        err = new Error("comment " + req.params.commentId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      } 
    } catch (err) {
      next(err);
    }
  });

  module.exports=commentRouter;