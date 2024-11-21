// const huffman = require('./encoding');
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const upload_dir = "/mnt/files/programms/huffman_project/upload";
if (!fs.existsSync(upload_dir)) {
  fs.mkdirSync(upload_dir,{recursive:true});
}

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,upload_dir);
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname);
  }
});

const upload=multer({ storage:storage});

app.post('/upload',upload.single('uploadfile'),(req,res)=>{
  if(!req.file){
    return res.status(400).json({error:'No file uploaded'});
  }
  console.log(req.file);
  res.json({message:'File uploaded',file:req.file});
});

app.listen(3000,()=>{
  console.log('Server running at 3000');
})