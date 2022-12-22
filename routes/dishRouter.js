const express=require('express');
const dishRouter=express.Router();

dishRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res)=>{
   res.send('Will send all the dishes to you!');
})

.post((req,res)=>{
   res.send("add dish: "+req.body.name+" with details "+req.body.description);
})
.put((req,res)=>{
   res.statusCode=403;
   res.send('PUt operations are not supported on dishes');
})
.delete((req,res)=>{ 
   res.send('deleting all the dishes');
});

dishRouter.route('/:dishId')
.get((req,res)=>{
    const {dishId:id}=req.params;
    res.send('Will send details of the dish '+id);
})

.post((req,res)=>{
    res.send("post operation is not supported on /dishes/"+req.params.dishId);
})
.put((req,res)=>{
    res.statusCode=403;
    res.write('updating the dishe with '+req.params.dishId+'\n');
    res.end("will update the dish: "+req.params.name+" by the following details "+req.body.description);
     
})
.delete((req,res)=>{ 
    res.send('deleting the dish with id '+req.params.dishId);
});


module.exports=dishRouter;
