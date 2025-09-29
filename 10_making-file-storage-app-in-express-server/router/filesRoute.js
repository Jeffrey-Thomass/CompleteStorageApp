import express from "express";
import { rm } from "fs/promises";
import { rename } from "fs/promises";
import { createWriteStream } from "fs";
const app = express();
import path from "path";

const router = express.Router();



// Serving File
router.get("/*" , (req, res) => {
    const filepath = path.join("/" , req.params[0]) 
    console.log(filepath)
    if(req.query.action === "download") {
      res.setHeader(
        "Content-Disposition",
        `attachment"`
      );
    }
    const fullPath = path.join(import.meta.dirname, "..", "storage", filepath);
    res.sendFile(fullPath , (err) => {
      if(err){
        res.status(404).json({message: err.message})
      }
    })
  });
  
// uploads

router.post("/*" , (req, res) => {
    const filepath = path.join("/" , req.params[0]) 
    const writeStream = createWriteStream(`./storage/${filepath}`);
    req.pipe(writeStream);
    req.on("end", () => {
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