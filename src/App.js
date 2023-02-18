import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadFile } from "react-s3";
window.Buffer = window.Buffer || require("buffer").Buffer;

const config = {
  bucketName: `${process.env.REACT_APP_BUCKET}`,
  region: 'us-west-2',
  accessKeyId: process.env.REACT_APP_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  s3Url: `https://${process.env.REACT_APP_BUCKET}.s3.amazonaws.com/`
}

const FLASK_APP = "http://127.0.0.1:5000";

function App() {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [desc, setDesc] = useState("");
  const [roast, setRoast] = useState("");

  useEffect(() => {
    if (image == null) return;
    setImageURL(URL.createObjectURL(image));
  }, [image]);

  function onImageChange(e) {
    setImage(e.target.files[0]);
  }

  async function uploadImage() {
    if (image == null) {
      console.log("No image!");
      return;
    }
    const data = await uploadFile(image, config);
    console.log(data);
    setImageURL(data.location);

    const desc = await getDesc(data.location);
    console.log("desc is ", desc);
    const roast = await getRoast(desc);
    console.log(roast);
  }

  async function getDesc(imageURL) {
    const res = await axios.get(`${FLASK_APP}/desc?url=${imageURL}`);
    console.log("Data", res.data);
    setDesc(res.data.desc);
    return res.data.desc;
  }

  async function getRoast() {
    axios.get(`${FLASK_APP}/roast?desc=${desc}`)
    .then(res => {
      setRoast(res.data.critique);
      return res.data.critique;
    })
    .catch(err => console.error(err));
  }

  return (
    // Change flex direction in Tailwind
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-4">
        {imageURL ? <img src={imageURL} alt="preview upload" className="w-64 h-64" /> : <input type="file" onChange={onImageChange} />}
      </div>
      <div className="p-4">
        <button onClick={uploadImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Image
        </button>
        <div className="p-4">Desc: {desc}</div>
        <div className="p-4">Roast: {roast}</div>
      </div>
    </div>
  );
}

export default App;
