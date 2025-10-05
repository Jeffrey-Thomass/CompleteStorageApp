import express from "express";
import { mkdir, readdir } from "fs/promises";
import { stat } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with {type: "json"};

const router = express.Router();

// Serving Dir Content
router.get("/:id?", async (req, res) => {
  const {id} = req.params;
  if(!id){
    const directoryData = directoriesData[0]
  }
  else{
    const directoryData = directoriesData.find((dir) => {
      return dir.id === id;
    })
    res.json(directoryData)
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