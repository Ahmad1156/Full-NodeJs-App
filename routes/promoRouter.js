const express=require('express');
const promoRouter=express.Router();

promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res)=>{
   res.send('Will send all the promotions to you!');
})

.post((req,res)=>{
   res.send("add promotion: "+req.body.name+" with details "+req.body.description);
})
.put((req,res)=>{
   res.statusCode=403;
   res.send('PUt operations are not supported on promotions');
})
.delete((req,res)=>{ 
   res.send('deleting all the promotions');
});

promoRouter.route('/:promoId')
.get((req,res)=>{
    const {promoId:id}=req.params;
    res.send('Will send details of the dish '+id);
})

.post((req,res)=>{
    res.send("post operation is not supported on /promotions/"+req.params.promoId);
})
.put((req,res)=>{
    res.statusCode=403;
    res.write('updating the promotion with '+req.params.promoId+'\n');
    res.end("will update the promotions: "+req.params.name+" by the following details "+req.body.description);
     
})
.delete((req,res)=>{ 
    res.send('deleting the promotion with id '+req.params.promoId);
});


module.exports=promoRouter;
