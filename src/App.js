import React, { useState } from 'react';
import axios from 'axios';
import { uploadFile } from "react-s3";
import inputBox from './assets/input/image-input-box.svg';
import person1 from './assets/people/person-1.png';
import person2 from './assets/people/person-2.png';
import person3 from './assets/people/person-3.png';
import person4 from './assets/people/person-4.png';
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
  const [desc, setDesc] = useState("");
  const [descUnclean, setDescUnclean] = useState("");
  const [roast, setRoast] = useState("");
  const [rating, setRating] = useState({});

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

    const desc = await getDesc(data.location);
    console.log("desc is ", desc);
    const roast = await getRoast(desc);
    console.log(roast);
    const rating = await getRating(desc, roast);
    console.log(rating);
  }

  async function getRating(desc, roast) {
    const res = await axios.get(`${FLASK_APP}/rating?desc=${desc}&roast=${roast}`);
    console.log("Rating", res.data);
    setRating(res.data.rating);
    return res.data.rating;
  }

  async function getDesc(imageURL) {
    const res = await axios.get(`${FLASK_APP}/desc?url=${imageURL}`);
    console.log("Data", res.data);
    setDesc(res.data.desc);
    setDescUnclean(res.data.result);
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

  /*
    // Change flex direction in Tailwind
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="p-4">
        {imageURL ? <img src={imageURL} alt="preview upload" className="w-64 h-64" /> : <input type="file" onChange={onImageChange} />}
      </div>
      <div className="p-4">
        <button onClick={uploadImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Upload Image
        </button>
        <div className="p-4">Desc Uncleaned: {descUnclean}</div>
        <div className="p-4">Desc: {desc}</div>
        <div className="p-4">Roast: {roast}</div>
        <div className="p-4">Rating: {JSON.stringify(rating)}</div>
      </div>
    </div>
    */

  return (
    <div className="flex items-center justify-center h-screen max-w-4xl mx-auto p-20">
      <div className="flex flex-col justify-center mr-10 z-10">
        <div className="text-6xl">
          <h1 className="header">DRIP</h1>
          <h1 className="header-outline">
            OR DROWN
          </h1>
        </div>
        <div className="text-1xl">
          <p>Refine your aesthetic.<br />Curate excellence.</p>
        </div>
      </div>
      <div class="flex items-center justify-center file-upload-container">
        <label for="dropzone-file" class="flex flex-col items-center justify-center w-full border-2 file-upload border-dashed rounded-lg cursor-pointer bg-transparent hover:opacity-50 p-5">
            <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <img src={inputBox} alt="input box" className="w-full" />
                <p className="mb-2 text-sm color-white text-center">
                  <span class="font-semibold">Click to choose a picture of your fit</span> and get it analyzed by our AI.
                </p>
            </div>
            <input id="dropzone-file" type="file" class="hidden" />
        </label>
      </div> 
      {/* bg images */}
      <div className="z-0">
        <img src={person1} alt="person 1" className="absolute bottom-12 left-13 opacity-50 bg-image" />
        <img src={person2} alt="person 1" className="absolute bottom-12 left-10 opacity-50 bg-image" />
      </div>

    </div>
  );
}

export default App;
