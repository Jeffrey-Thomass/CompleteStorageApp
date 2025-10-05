import express from "express";
import { mkdir, readdir } from "fs/promises";
import { stat } from "fs/promises";
import path from "path";


const router = express.Router();

// Serving Dir Content
router.get("/:id", async (req, res) => {
    // const {0 : dirname} = req.params
    const dirname = path.join("/" , req.params[0]) 
    console.log(dirname)
    const fullDirPath = `./storage/${dirname ? dirname : ""}`
    try {
      const filesList = await readdir(fullDirPath);
    console.log(filesList);
    const resData = [];
    for (const item of filesList) {
      const stats = await stat(`${fullDirPath}/${item}`);
      resData.push({
        name: item,
        isDirectory: stats.isDirectory(),
      })
    }
    console.log(resData)
    res.json(resData);
    }
    catch(err){
      res.status(404).json({message: err.message})
    }
  });


  // Directory creation

router.post("/*", async (req, res) => {
    const { 0 : dirname} = req.params;
    try{
      await mkdir(`./storage/${dirname}`)
    res.json({message: "Directory created successfully"})
    }
    catch(err){
      res.status(404).json({message: err.message})
    }
})
 

export default router;