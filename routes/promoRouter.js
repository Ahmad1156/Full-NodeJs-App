const express = require("express");
const promoRouter = express.Router();
const authenticate=require('../authenticate');
const promotion = require("../models/promotions");

promoRouter
  .route("/")
  .get(async (req, res, next) => {
    try {
      const promotions = await promotion.find({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(promotions);
    } catch (err) {
      next(err);
    }
  })

  .post(authenticate.verifyUser,async (req, res, next) => {
    try {
      const newPromo = await promotion.create(req.body);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(newPromo);
    } catch (err) {
      next(err);
    }
  })
  .put(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.send("PUt operations are not supported on /promotions");
  })
  .delete(authenticate.verifyUser,async(req, res,next) => {
    try {
        const resp=await promotion.deleteMany({});
        res.status=200;
        res.json(resp);
    } catch (error) {
        next(error);
    }
  });

promoRouter
  .route("/:promoId")
  .get(async(req, res,next) => {
    try {
        const { promoId: id } = req.params;
        const specificPromotion=await promotion.findById(id);
        res.status=200;
        res.contentType('application/json');
        res.json(specificPromotion);
    } catch (error) {
        next(error);
    }
  })

  .post(authenticate.verifyUser,async(req, res,next) => {
    res.send(
      "post operation is not supported on /promotions/" + req.params.promoId
    );
  })

  .put(authenticate.verifyUser,async(req, res,next) => {
    try {
        const updatedPromotion = await promotion.findByIdAndUpdate(
          req.params.promoId,
          { $set: req.body },
          { new: true }
        );
  
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(updatedPromotion);
      } catch (err) {
        next(err);
      }
  })
  .delete(authenticate.verifyUser,async(req, res,next) => {
    try{
        const resp=await promotion.findByIdAndRemove(req.params.promoId);
        res.statusCode=200;
        res.setHeader("Contet-Type", "application/json");
        res.json(resp);
    }
   catch(error){
         next(error);
    }
  });

module.exports = promoRouter;
