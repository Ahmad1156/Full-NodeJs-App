const express=require('express');
const leaderRouter=express.Router();

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    next();
})

.get((req,res)=>{
   res.send('Will send all the leaders to you!');
})

.post((req,res)=>{
   res.send("add leader: "+req.body.name+" with details "+req.body.description);
})
.put((req,res)=>{
   res.statusCode=403;
   res.send('PUt operations are not supported on leaders');
})
.delete((req,res)=>{ 
   res.send('deleting all the leaders');
});

leaderRouter.route('/:leaderId')
.get((req,res)=>{
    const {leaderId:id}=req.params;
    res.send('Will send details of the dish '+id);
})

.post((req,res)=>{
    res.send("post operation is not supported on /leaders/"+req.params.leaderId);
})
.put((req,res)=>{
    res.statusCode=403;
    res.write('updating the leader with '+req.params.leaderId+'\n');
    res.end("will update the leader: "+req.params.name+" by the following details "+req.body.description);
     
})
.delete((req,res)=>{ 
    res.send('deleting the leader with id '+req.params.leaderId);
});


module.exports=leaderRouter;
