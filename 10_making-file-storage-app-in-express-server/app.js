import express from "express";
import { readdir } from "fs/promises";
import cors from 'cors';
import { rm } from "fs/promises";
import { rename } from "fs/promises";
import { createWriteStream } from "fs";
const app = express();
import { stat } from "fs/promises";

// Enabling CORS
app.use(cors())
app.use(express.json());

// Serving File
app.get("/files/:filename" , (req, res) => {
  const {filename} = req.params;
  if(req.query.action === "download") {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`)
});
 
// uploads

app.post("/files/:filename" , (req, res) => {
    const writeStream = createWriteStream(`./storage/${req.params.filename}`);
    req.pipe(writeStream);
    req.on("end", () => {
        res.json({message: "File uploaded successfully"})
    });
})

// delete 
app.delete("/files/:filename", async (req, res) => {
    const {filename} = req.params;
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

app.patch("/files/:filename", async (req, res) => {
    const {filename} = req.params;
    console.log(filename);
    console.log(req.body)
    await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`)
    res.json({message: "File Renamed Successfully"})
})


// Serving Dir Content
app.get("/directory/:dirname?", async (req, res) => {
  const {dirname} = req.params
  const fullDirPath = `./storage/${dirname ? dirname : ""}`
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
});
const port = 4000;
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
