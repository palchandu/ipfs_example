var express = require('express');
var mongoose = require("mongoose");
var User = require('../models/UserModel.js');
var ipfsAPI = require('ipfs-api');
var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'});
var fs = require('fs');
var buffer=require('buffer');
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

  // Save User in the database
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
};

exports.userFile=(req,res)=>{
  var file_base64 = req.body.file_upload;
  console.log(file_base64);
  var fileExt=req.body.extention;
  binaryData = new Buffer(file_base64, 'base64');
  fs.writeFile('public/demo.'+fileExt, binaryData, "binary", function(err) {
    if (err) {
      console.log("errror in writtting file")
      }
      else{
        fs.readFile('public/demo.'+fileExt, function(err, data) {  
          if (err){ 
            return res.send({"message":"Error in file reading","error":err});
          }
          else{
          ipfs.files.add(data, (err, result) => { // Upload buffer to IPFS
            if(err) {
              console.error(err)
              return res.send({"message":"Error in file upload to ipfs","error":err});
            }
            let url = `https://ipfs.io/ipfs/${result[0].hash}`;
            console.log(`Url --> ${url}`);
            return res.send({"message":"file uploaded successfully","hash":result[0].hash});
          })
        }
        });
      }
  });
  

};
