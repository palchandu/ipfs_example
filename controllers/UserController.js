var mongoose = require("mongoose");
var User = require('../models/UserModel.js');

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if(!req.body.compamy_name) {
   // console.log("err:::::::::::::");
    return res.status(400).send({
        message: "User content can not be empty"
    });
}
else{
// Create User
const user = new User({
  name: req.body.name || "Test Company", 
  compamy_name: req.body.compamy_name,
  companyId:req.body.companyId,
  address:req.body.address,
  regdate:req.body.regdate,
  content:req.body.content
});

  // Save Note in the database
  user.save().then(data => {
    res.send({"status":"200","message":"Successfully user created","data":data});
}).catch(err => {
    res.status(500).send({
        message: err.message || "Some error occurred while creating the User."
    });
});
}
};

/*Retrieving all users list */
exports.findAll=(req,res)=>{
  User.find()
  .then(user_list=>{
    res.send(user_list);
  }).catch(err=>{
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving notes."
  });
  })
};

// Find a single user with a userId
exports.findByUserId=(req,res)=>{
  User.findById(req.params.userId)
  .then(user=>{
    if(!user){
      return res.status(404).send({
        message: "User not found with id " + req.params.userId
    });
    }
    res.send(user);
  }).catch(err=>{
    if(err.kind==="ObjectId"){
      return res.status(404).send({
        message: "User not found with id " + req.params.userId
    });
    }
    return res.status(500).send({
      message: "Error retrieving user with id " + req.params.userId
  });
  })
};

/*Deleting User */

exports.userDelete=(req,res)=>{
  User.findByIdAndRemove(req.params.userId)
  .then(user=>{
    if(!user){
      return res.status(404).send({
        message: "User not found with id " + req.params.userId
    })
    }
    res.send({message: "User deleted successfully!"});
  }).catch(err=>{
    if(err.kind === 'ObjectId' || err.name === 'NotFound') {
      return res.status(404).send({
          message: "User not found with id " + req.params.userId
      });                
  }
  return res.status(500).send({
      message: "Could not delete user with id " + req.params.userId
  });
  })
}
