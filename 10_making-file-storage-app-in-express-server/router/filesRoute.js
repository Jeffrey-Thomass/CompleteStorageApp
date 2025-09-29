import express from "express";
import { rm } from "fs/promises";
import { rename } from "fs/promises";
import { createWriteStream } from "fs";
import { writeFile } from "fs/promises";
const app = express();
import path from "path";
import filesData from "../filesDB.json" with {type: "json"};


const router = express.Router();



// Serving File
router.get("/:id" , (req, res) => {
    const {id} = req.params;
    const fileData = filesData.find((file) => {
      return file.id === id;
    })
    const fullname = `${id}${fileData.extension}`

    if(req.query.action === "download") {
      res.setHeader(
        "Content-Disposition"
        `attachment"`
      );
    }
    const fullPath = path.join(import.meta.dirname, "..", "storage", fullname);
    res.sendFile(fullPath , (err) => {
      if(err){
        res.status(404).json({message: err.message})
      }
    })
  });
  
// upload / create file

router.post("/:filename" , (req, res) => {
    const {filename} = req.params;
    const id = crypto.randomUUID();
    const extension = path.extname(filename);
    const fullFilename = `${id}${extension}`
    const writeStream = createWriteStream(`./storage/${fullFilename}`);
    req.pipe(writeStream);
    req.on("end", async() => {
        filesData.push({
          id,
          extension,
          name : filename,
        })
        await writeFile("./filesDB.json" , JSON.stringify(filesData))  // here ./ because it will take relative to app.js 
        res.json({message: "File uploaded successfully"})
    });
})

// delete 
router.delete("/*", async (req, res) => {
    const {0 : filename} = req.params;
    const filepath = `./storage/${filename}`
    try{
        await rm(filepath);
        res.json({message: "File deleted successfully"})
    }
    catch(err){
        res.status(404).json({message: err.message})
    }
})

//rename the file

router.patch("/*", async (req, res) => {
    const { 0 : filepath} = req.params;

    console.log(req.body)
    await rename(`./storage/${filepath}`, `./storage/${req.body.newFilename}`)
    res.json({message: "File Renamed Successfully"})
})

export default router;