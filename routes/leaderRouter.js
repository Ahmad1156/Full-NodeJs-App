const express=require('express');
const leaderRouter=express.Router();

const authenticate=require('../authentication/authenticate');

const Leader=require('../models/leaders');

leaderRouter.route('/')
.get(async (req, res, next) => {
    try {
      const leaders = await Leader.find({});
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(leaders);
    } catch (err) {
      next(err);
    }
  })

  .post(authenticate.verifyUser,authenticate.verifyAdmin,async (req, res, next) => {
    try {
      const newLeader = await Leader.create(req.body);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(newLeader);
    } catch (err) {
      next(err);
    }
  })
  .put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.send("PUt operations are not supported on /leaders");
  })
  .delete(authenticate.verifyUser,authenticate.verifyAdmin,async(req, res,next) => {
    try {
        const resp=await Leader.deleteMany({});
        res.status=200;
        res.json(resp);
    } catch (error) {
        next(error);
    }
  });

leaderRouter
  .route("/:leaderId")
  .get(async(req, res,next) => {
    try {
        const { leaderId: id } = req.params;
        const specificLeader=await Leader.findById(id);
        res.status=200;
        res.contentType('application/json');
        res.json(specificLeader);
    } catch (error) {
        next(error);
    }
  })

  .post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res,next) => {
    res.send(
      "post operation is not supported on /leaders/" + req.params.leaderId
    );
  })

  .put(authenticate.verifyUser,authenticate.verifyAdmin,async(req, res,next) => {
    try {
        const updatedLeader = await Leader.findByIdAndUpdate(
          req.params.leaderId,
          { $set: req.body },
          { new: true }
        );
  
        res.statusCode = 200;
        res.setHeader("Contet-Type", "application/json");
        res.json(updatedLeader);
      } catch (err) {
        next(err);
      }
  })
  .delete(authenticate.verifyUser,authenticate.verifyAdmin,async(req, res,next) => {
    try{
        const resp=await Leader.findByIdAndRemove(req.params.leaderId);
        res.statusCode=200;
        res.setHeader("Contet-Type", "application/json");
        res.json(resp);
    }
   catch(error){
         next(error);
    }
  });


module.exports=leaderRouter;
