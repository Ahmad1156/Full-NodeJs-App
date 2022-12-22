const express = require("express");
const dishRouter = express.Router();

const Dishes = require("../models/dishes");

dishRouter
  .route('/')

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
  .get(async (req, res,next) => {
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
        { new: true } );
      
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(dish);
    } catch (err) {
      next(err);
    }
  })
  .delete(async(req, res,next) => {
    try{
     const response=await Dishes.findOneAndRemove(req.params.dishId);
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
     res.json(response);
    }catch(err){
        next(err);
    }
  });

module.exports = dishRouter;
