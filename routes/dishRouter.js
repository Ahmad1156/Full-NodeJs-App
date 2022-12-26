const express = require("express");
const dishRouter = express.Router();
const cors=require('./cors');
const Dishes = require("../models/dishes");

const authenticate = require("../authentication/authenticate");


dishRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
  .get(cors.cors,(req, res, next) => {
    Dishes.find(req.query)
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
      const dish = await Dishes.findById(id);
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


module.exports = dishRouter;
