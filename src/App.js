import React, { useState, useEffect } from 'react';
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

    await uploadFile(image, config)
    .then(data => setImageURL(data.location))
    .catch(err => console.error(err));
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        {imageURL ? <img src={imageURL} alt="preview upload" className="w-64 h-64" /> : <input type="file" onChange={onImageChange} />}
      </div>
      <div>
        <button onClick={() => {}} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Image
        </button>
      </div>
    </div>
  );
}

export default App;
