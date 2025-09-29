import { useEffect, useState } from "react";
import "./App.css";
import { Link, useParams } from "react-router-dom";

function DirectoryView() {
  const BASE_URL = "http://127.0.0.1:4000";
  const [directoryItems, setDirectoryItems] = useState([]);
  const [progress, setProgress] = useState(0);
  const [newFilename, setNewFilename] = useState("");
  const [dirName , setDirName] = useState("");
  const {"*" : dirPath} = useParams()
  console.log(dirPath)
  async function getDirectoryItems() {
    const response = await fetch(`${BASE_URL}/directory/${dirPath}`);
    const data = await response.json();
    setDirectoryItems(data);
  }
  useEffect(() => {
    getDirectoryItems();
  }, [dirPath]);

  async function uploadFile(e) {
    const file = e.target.files[0];
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/files/${dirPath}/${file.name}`, true);
    xhr.addEventListener("load", () => {
      console.log(xhr.response);
      getDirectoryItems();
    });
    xhr.upload.addEventListener("progress", (e) => {
      const totalProgress = (e.loaded / e.total) * 100;
      setProgress(totalProgress.toFixed(2));
    });
    xhr.send(file);
  }

  async function handleDelete(filename) {
    const response = await fetch(`${BASE_URL}/files/${dirPath}/${filename}`, {
      method: "DELETE",
    });
    const data = await response.text();
    console.log(data);
    getDirectoryItems();
  }

  async function renameFile(oldFilename) {
    console.log({ oldFilename, newFilename });
    setNewFilename(oldFilename);
  }

  async function saveFilename(oldFilename) {
    setNewFilename(oldFilename);
    const response = await fetch(`${BASE_URL}/files/${dirPath}/${oldFilename}`, {
      method: "PATCH",
      body: JSON.stringify({newFilename : `${dirPath}/${newFilename}` }),
      headers :{
        "Content-Type": "application/json"
      }
    });
    const data = await response.text();
    console.log(data);
    setNewFilename("")
    getDirectoryItems();
  }
  async function handleCreateDir(e){
    e.preventDefault();
    const URL = `${BASE_URL}/directory${dirPath? "/" + dirPath : ""  }/${dirName}`
    const response = await fetch(`${URL}`, {
      method : "POST",
      body : JSON.stringify({dirName})
    });
    const data = await response.json();
    console.log(data);
    getDirectoryItems();
    setDirName("")
  }

  return (
    <>
      <h1>My Files</h1>
      <input type="file" onChange={uploadFile} />
      <input
        type="text"
        onChange={(e) => setNewFilename(e.target.value)}
        value={newFilename}
      />
      <p>Progress: {progress}%</p>
      <form onSubmit={handleCreateDir}>
        <input type="text" onChange={(e) => setDirName(e.target.value)} value={dirName}/>
        <button>Create Folder</button>
      </form>
      {directoryItems.map(({ name, isDirectory }, i) => (
        <div key={i}>
          {name} {isDirectory && <Link to={`./${name}`}>Open</Link>}
          {!isDirectory && (
            <a href={`${BASE_URL}/file/${dirPath}/${name}?action=open`}>Open</a>
          )}{" "}
          {!isDirectory && (
            <a href={`${BASE_URL}/file/${dirPath}/${name}?action=download`}>Download</a>
          )}
          <button onClick={() => renameFile(name)}>Rename</button>
          <button onClick={() => saveFilename(name)}>Save</button>
          <button
            onClick={() => {
              handleDelete(name);
            }}
          >
            Delete
          </button>
          <br />
        </div>
      ))}
    </>
  );
}

export default DirectoryView;
