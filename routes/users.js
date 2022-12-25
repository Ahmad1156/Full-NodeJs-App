var express = require('express');
var router = express.Router();
var passport=require('passport');
const User=require('../models/user');
var authenticate = require('../authentication/authenticate');
const cors=require('./cors');
/* GET users listing. */
router.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get('/',cors.cors,authenticate.verifyUser,authenticate.verifyAdmin,async (req, res, next)=> {
   try{
    const users=await User.find({});
    res.json(users);
   }catch(err){
     next(err);
   }
});
//signUp route
router.post('/signup',cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if (req.body.firstName)
        user.firstName = req.body.firstName;
      if (req.body.lastName)
        user.lastName = req.body.lastName;
      user.save((err, user) => {
        if (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return ;
        }
        passport.authenticate('local',{session:false})(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});


router.post('/login',cors.corsWithOptions, passport.authenticate('local',{session:false}), async(req, res) => {
  const user=await User.findById({_id:req.user._id});
  var token = authenticate.getToken({_id: req.user._id,admin:user.admin});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true,token:token, status: 'You are successfully logged in!'});
});

  router.get('/logout',(req,res)=>{
    if(req.session){
      req.session.destroy();
      res.clearCookie('session-id');//from the client Side
      res.redirect('/');
    }
    else{
      var err=new Error('You are not loggen in!!');
      err.status=403;
      next(err);
    }
  });

  router.get('/facebook/token', passport.authenticate('facebook-token',{session:false}), (req, res) => {
    //here after the sucessful authentication by facebook,we will generate the token and send it to the client as before.
    if (req.user) {
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, token: token, status: 'You are successfully logged in!'});
    }
  });

module.exports = router;
