import express from "express";
import cors from 'cors';
import directoryRoutes from "./router/directoryRoutes.js";
import filesRoute from "./router/filesRoute.js";
const app = express();


// Enabling CORS
app.use(cors())
app.use(express.json());
app.use("/directory", directoryRoutes)
app.use("/file", filesRoute);
// // Serving File
// app.get("/files/*" , (req, res) => {
//   const filepath = path.join("/" , req.params[0]) 
//   console.log(filepath)
//   if(req.query.action === "download") {
//     res.setHeader(
//       "Content-Disposition",
//       `attachment"`
//     );
//   }
//   res.sendFile(`${import.meta.dirname}/storage/${filepath}` , (err) => {
//     if(err){
//       res.status(404).json({message: err.message})
//     }
//   })
// });


// // Directory creation

// app.post("/directory/*", async (req, res) => {
//     const { 0 : dirname} = req.params;
//     try{
//       await mkdir(`./storage/${dirname}`)
//     res.json({message: "Directory created successfully"})
//     }
//     catch(err){
//       res.status(404).json({message: err.message})
//     }
// })
 
// // uploads

// app.post("/files/*" , (req, res) => {
//     const filepath = path.join("/" , req.params[0]) 
//     const writeStream = createWriteStream(`./storage/${filepath}`);
//     req.pipe(writeStream);
//     req.on("end", () => {
//         res.json({message: "File uploaded successfully"})
//     });
// })

// // delete 
// app.delete("/files/*", async (req, res) => {
//     const {0 : filename} = req.params;
//     const filepath = `./storage/${filename}`
//     try{
//         await rm(filepath);
//         res.json({message: "File deleted successfully"})
//     }
//     catch(err){
//         res.status(404).json({message: err.message})
//     }
// })

// //rename the file

// app.patch("/files/*", async (req, res) => {
//     const { 0 : filepath} = req.params;

//     console.log(req.body)
//     await rename(`./storage/${filepath}`, `./storage/${req.body.newFilename}`)
//     res.json({message: "File Renamed Successfully"})
// })


// // Serving Dir Content
// app.get("/directory/?*", async (req, res) => {
//   // const {0 : dirname} = req.params
//   const dirname = path.join("/" , req.params[0]) 
//   console.log(dirname)
//   const fullDirPath = `./storage/${dirname ? dirname : ""}`
//   try {
//     const filesList = await readdir(fullDirPath);
//   console.log(filesList);
//   const resData = [];
//   for (const item of filesList) {
//     const stats = await stat(`${fullDirPath}/${item}`);
//     resData.push({
//       name: item,
//       isDirectory: stats.isDirectory(),
//     })
//   }
//   console.log(resData)
//   res.json(resData);
//   }
//   catch(err){
//     res.status(404).json({message: err.message})
//   }
// });
const port = 4000;
app.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
