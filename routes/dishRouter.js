const express = require("express");
const dishRouter = express.Router();

const Dishes = require("../models/dishes");

dishRouter
  .route("/")

  .get((req, res, next) => {
    Dishes.find({})
      .then(
        (dishes) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(dishes);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post((req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          console.log("Dish created ", dish);
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUt operations are not supported on dishes");
  })
  .delete((req, res, next) => {
    Dishes.deleteMany({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

dishRouter
  .route("/:dishId")

  .get(async (req, res, next) => {
    try {
      const { dishId: id } = req.params;
      const dish = await Dishes.findById(id);
      res.statusCode = 200;
      res.setHeader("Contet-Type", "application/json");
      res.json(dish);
    } catch (err) {
      next(err);
    }
  })

  .post((req, res) => {
    res.statusCode = 403;
    res.send("post operation is not supported on /dishes/" + req.params.dishId);
  })
  .put(async (req, res, next) => {
    try {
      const dish = await Dishes.findByIdAndUpdate(
        req.params.dishId,
        { $set: req.body },
        { new: true }
      );

      res.statusCode = 200;
      res.setHeader("Contet-Type", "application/json");
      res.json(dish);
    } catch (err) {
      next(err);
    }
  })
  .delete(async (req, res, next) => {
    try {
      const response = await Dishes.findOneAndRemove(req.params.dishId);
      res.statusCode = 200;
      res.setHeader("Contet-Type", "application/json");
      res.json(response);
    } catch (err) {
      next(err);
    }
  });

//dealing with comments

dishRouter
  .route("/:dishId/comments")

  .get(async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(dish.comments);
      } else {
        err = new Error("Dish " + req.params.dishId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
    try{
      const dish=await Dishes.findById(req.params.dishId);
      if(dish!=null){
        dish.comments.push(req.body);
        await dish.save();
        res.statusCode=200;
        res.setHeader("Contet-Type", "application/json");
        res.json(dish.comments);
      }
      else{
        err = new Error("Dish " + req.params.dishId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      }
    }
    catch(err){
        next(err);
    }
    
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUt operations are not supported on /dishes/"+req.params.dishId+"/comments");
  })
  .delete(async(req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId);
        if (dish != null) {
          
          for(var i=(dish.comments.length-1);i>=0;i--){
           await dish.comments.id(dish.comments[i]._id).remove();
          }
          await dish.save();
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(dish);
        } else {
          err = new Error("Dish " + req.params.dishId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
        }
      } catch (err) {
        next(err);
      }
    })

    //dealing with specific comments

dishRouter
  .route("/:dishId/comments/:commentId")
  .get(async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null&&dish.comments.id(req.params.commentId)!=null) {
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(dish.comments.id(req.params.commentId));
      } else if(dish==null) {
        err = new Error("Dish " + req.params.dishId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      }
      else{
        err = new Error("comment " + req.params.commentId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      }
    } catch (err) {
      next(err);
    }
  })
  .post(async (req, res, next) => {
     res.statusCode=403;
     res.end('POST operation not supported on /dishes/'+req.params.dishId+'/comments/'+req.params.commentId)
  })
    
  .put(async(req, res,next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId);
        if (dish != null&&dish.comments.id(req.params.commentId)!=null) {
          if(req.body.rating){
            dish.comments.id(req.params.commentId).rating=req.body.rating;
          }
          if(req.body.comment){
            dish.comments.id(req.params.commentId).comment=req.body.comment;
          }
          await dish.save();
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(dish.comments.id(req.params.commentId));
        } else if(dish==null) {
          err = new Error("Dish " + req.params.dishId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
        }
        else{
          err = new Error("comment " + req.params.commentId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
        }
      } catch (err) {
        next(err);
      }
})
  .delete(async(req, res, next) => {
    try {
        const dish = await Dishes.findById(req.params.dishId);
        if (dish != null) {
          
         await  dish.comments.id(req.params.commentId).remove();
       
          await dish.save();
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(dish.comments);
        } else if(dish==null) {
          err = new Error("Dish " + req.params.dishId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
        }
        else{
          err = new Error("comment " + req.params.commentId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
        }
      } catch (err) {
        next(err);
      }
    })

module.exports = dishRouter;
