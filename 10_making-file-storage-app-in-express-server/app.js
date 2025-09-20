import express from "express";
import { readdir } from "fs/promises";
import cors from 'cors';
import { rm } from "fs/promises";
import { rename } from "fs/promises";
const app = express();

// Enabling CORS
app.use(cors())
app.use(express.json())

// Serving File
app.get("/:filename" , (req, res) => {
  const {filename} = req.params;
  if(req.query.action === "download") {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
  }
  res.sendFile(`${import.meta.dirname}/storage/${filename}`)
});
 

// delete 
app.delete("/:filename", async (req, res) => {
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

app.patch("/:filename", async (req, res) => {
    const {filename} = req.params;
    console.log(filename);
    console.log(req.body)
    await rename(`./storage/${filename}`, `./storage/${req.body.newFilename}`)
    res.json({message: "File Renamed Successfully"})
})


// Serving Dir Content
app.get("/", async (req, res) => {
  const filesList = await readdir("./storage");
  console.log(filesList);
  res.json(filesList);
});
const port = 4000;
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
