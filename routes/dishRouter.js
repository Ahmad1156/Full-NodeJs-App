const express = require("express");
const dishRouter = express.Router();
const cors=require('./cors');
const Dishes = require("../models/dishes");

const authenticate = require("../authentication/authenticate");


dishRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,(req, res, next) => {
    Dishes.find({})
      .populate("comments.author")
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

  .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dishes.create(req.body)
      .then(
        (dish) => {
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(dish);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.end("PUt operations are not supported on dishes");
  })
  .delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
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
    }
  );

dishRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,async (req, res, next) => {
    try {
      const { dishId: id } = req.params;
      const dish = await Dishes.findById(id).populate("comments.author");
      res.statusCode = 200;
      res.setHeader("Contet-Type", "application/json");
      res.json(dish);
    } catch (err) {
      next(err);
    }
  })

  .post(cors.corsWithOptions,authenticate.verifyUser, authenticate.verifyAdmin, (req, res) => {
    res.statusCode = 403;
    res.send("post operation is not supported on /dishes/" + req.params.dishId);
  })
  .put(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
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
    }
  )
  .delete(cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    async (req, res, next) => {
      try {
        const response = await Dishes.findOneAndRemove(req.params.dishId);
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(response);
      } catch (err) {
        next(err);
      }
    }
  );

//dealing with comments

dishRouter
  .route("/:dishId/comments")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId).populate(
        "comments.author"
      );
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
  .post(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        req.body.author = req.user._id;
        dish.comments.push(req.body);
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
  .put(cors.corsWithOptions,authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      "PUt operations are not supported on /dishes/" +
        req.params.dishId +
        "/comments"
    );
  })
  .delete(cors.corsWithOptions,authenticate.verifyUser,authenticate.verifyAdmin, async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        for (var i = dish.comments.length - 1; i >= 0; i--) {
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
  });

//dealing with specific comments

dishRouter
  .route("/:dishId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId).populate(  "comments.author" );
      
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(dish.comments.id(req.params.commentId));
      } else if (dish == null) {
        err = new Error("Dish " + req.params.dishId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      } else {
        err = new Error("comment " + req.params.commentId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      }
    } catch (err) {
      next(err);
    }
  })
  .post(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /dishes/" +
        req.params.dishId +
        "/comments/" +
        req.params.commentId
    );
  })

  .put(cors.corsWithOptions,authenticate.verifyUser, async (req, res, next) => {
    try {
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null && dish.comments.id(req.params.commentId) != null) {
        if (  req.user._id ==  dish.comments.id(req.params.commentId).author.toString() )
        {
          if (req.body.rating) {
            dish.comments.id(req.params.commentId).rating = req.body.rating;
          }
          if (req.body.comment) {
            dish.comments.id(req.params.commentId).comment = req.body.comment;
          }
          await dish.save();
          const popDish = await Dishes.findById(dish._id).populate("comments.author");
          res.statusCode = 200;
          res.setHeader("Contet-Type", "application/json");
          res.json(popDish);
        }
        else{
          var err=new Error("you are not authorized to do such operation!!")
           err.statusCode=403;
           next(err);
        }}
         else if (dish == null) {
          err = new Error("Dish " + req.params.dishId + " is not Found");
          res.statusCode = 404; //not Found
          return next(err);
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
      const dish = await Dishes.findById(req.params.dishId);
      if (dish != null) {
        if(req.user._id == dish.comments.id(req.params.commentId).author.toString())
        {
        await dish.comments.id(req.params.commentId).remove();

        await dish.save();
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(dish.comments);
      }
      else{
        err = new Error("you are not authorized to do this operation");
        res.statusCode = 404; //not Found
        return next(err);
      }}
       else if (dish == null) {
        err = new Error("Dish " + req.params.dishId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      } else {
        err = new Error("comment " + req.params.commentId + " is not Found");
        res.statusCode = 404; //not Found
        return next(err);
      } 
    } catch (err) {
      next(err);
    }
  });

module.exports = dishRouter;
