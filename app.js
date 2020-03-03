var express = require('express');
var path = require('path');
var logger = require('morgan');
var mongoose = require('mongoose');  
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var app = express();
var studentmodel=require('./model/StudentSchema.js');
var url='mongodb://127.0.0.1/mydb';
var db=mongoose.connect(url, {useNewUrlParser: true,useUnifiedTopology: true},error => {
    if(error)
    {
        console.log("connection failed");
        console.log(JSON.stringify(error));
    }else{
        console.log("DB Connected Successfully");
    }
});
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));

// --------CREATE STUDENT INFORMATION------
app.post('/api/create', function(req, res) {
  
       console.log(req.body);
       // let newStudent = new studentmodel(req.body);
       var newStudent = new studentmodel();
       newStudent.fname=req.body.fname;
       newStudent.lname=req.body.lname;
       newStudent.dob=req.body.dob;
       newStudent.email=req.body.email;
       newStudent.phone=req.body.phone;
       newStudent.save(function(err,docs){
               
                if(err){
                    res.status(500).json("connection error");
                }
                else{
                    console.log(docs);
                    res.status(200).json({data:docs});
                    console.log("Added Successfully!!")
                }
              });
       });

 //---------READ STUDENT INFORMATION-------
 app.post('/api/getAllData',function(req,res){
      studentmodel.find({},{},function(err, data){
        
          if(err)
          {
            res.status(500).send(err);
          }
          else
          {
            console.log("Successfully Read");
            res.status(200).json(data);
          }
      });
  
  });

//--------UPDATE THE STUDENT INFORMATION------
app.post('/api/update',function(req, res){

    console.log(" updated _id:" + req.body._id);
    console.log(req.body.dob);

      var student = {
          fname: req.body.fname,
          lname: req.body.lname,
          dob:req.body.dob,
          email: req.body.email,
          phone: req.body.phone,
      };  
      studentmodel.findByIdAndUpdate(req.body._id, { $set: student },{new:true},(err, doc) => {
          if (!err) { 
            console.log(doc);
            console.log("updated Successfully");
            res.status(200).json(doc);
           }
           else
           {
             res.status(500).send(err);
           }
      });
  });

//--------DELETE THE STUDENT INFORMATION--------
app.get('/api/delete/:_id',function (req, res) {

  console.log("id:"+req.params._id);

       studentmodel.findByIdAndRemove({ _id: req.params._id},function (err, docs) {
         if (err) {
          res.status(500).send(err);
        }
         else {
          console.log("Successfully Deleted");
          res.status(200).json(docs);
         }
      });
  });

http.createServer(app).listen(8080,function(){
   console.log("App listening on port 8080");
});
   

 