import express from "express";
import { rm } from "fs/promises";
import { rename } from "fs/promises";
import { createWriteStream } from "fs";
import { writeFile } from "fs/promises";
import path from "path";
import directoriesData from "../directoriesDB.json" with {type: "json"};
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
    const parentDirId = req.body.parentdirid || directoriesData[0].id;

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
          parentDirId
        })
        const parentDirData = directoriesData.find((dir) => dir.id === parentDirId)
        parentDirData.files.push()
        await writeFile("./filesDB.json" , JSON.stringify(filesData))  // here ./ because it will take relative to app.js 
        await writeFile("./directoriesDB.json" , JSON.stringify(directoriesData))
        res.json({message: "File uploaded successfully"})
    });
})

// delete 
router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const fileIndex = filesData.findIndex((file) => file.id === id);
    const fileData = filesData[fileIndex];
    try{
        await rm(`./storage/${id}${fileData.extension}`);
        filesData.splice(fileIndex, 1);

        const parentDirData = directoriesData.find((dir) => dir.id === fileData.parentDirId)
        parentDirData.files = parentDirData.files.filter((file) => file.id !== id) 

        await writeFile("./directoriesDB.json" , JSON.stringify(directoriesData)) 
        await writeFile("./filesDB.json" , JSON.stringify(filesData)) 
        res.json({message: "File deleted successfully"})
    }
    catch(err){
        res.status(404).json({message: err.message})
    }
})

//rename the file

router.patch("/:id", async (req, res) => {
    const {id} = req.params;

    const fileData = filesData.find((file) => {
      return file.id === id;
    })
    fileData.name = req.body.newFilename;
    await writeFile("./filesDB.json" , JSON.stringify(filesData)) 
    // await rename(`./storage/${filepath}`, `./storage/${req.body.newFilename}`)
    res.json({message: "File Renamed Successfully"})
})

export default router;