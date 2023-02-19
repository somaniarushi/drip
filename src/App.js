import React, { useState, useEffect } from 'react';
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
const LOADING_FLAVOR = [
  "Analyzing your fit...",
  "Evaluating your vibes...",
  "Swiping right...",
  "Constructing compliments...",
  "Thinking of a witty caption...",
  "Brainstorming your style...",
]

function App() {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFlavor, setLoadingFlavor] = useState(LOADING_FLAVOR[0]);

  // Rotating loading flavor text
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingFlavor(LOADING_FLAVOR[Math.floor(Math.random() * LOADING_FLAVOR.length)]);
      }, 1000);
      return () => clearInterval(interval);
    }
  })

  useEffect(() => {
    if (image == null) return;

    const url = URL.createObjectURL(image);
    setImageURL(url);
  }, [image]);

  async function submitImage(e) {
    const img = e.target.files[0];
    setImage(img);
    setLoading(true);
    
    if (img == null) {
      console.log("Image is null");
      return;
    }

    console.log(img);

    // Upload image to S3
    const data = await uploadFile(img, config);
    console.log(data);

    // Get description from backend
    const desc = await getDesc(data.location);
    console.log("desc is ", desc);
    const roast = await getRoast(desc);
    console.log(roast);
    const rating = await getRating(desc, roast);
    console.log(rating);

    setLoading(false);
  }

  async function getRating(desc, roast) {
    const res = await axios.get(`${FLASK_APP}/rating?desc=${desc}&roast=${roast}`);
    console.log("Rating", res.data);
    return res.data.rating;
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
      return res.data.critique;
    })
    .catch(err => console.error(err));
  }

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
          <p>{loading ? loadingFlavor : "Refine your aesthetic.\nCurate excellence."}</p>
        </div>
      </div>
      <div className="flex items-center justify-center file-upload-container z-10">
        {imageURL ?
          (
            <div>
              <img src={imageURL} alt="preview upload" className="w-64 h-64" />
            </div>
          ) :
          <Upload submitImage={submitImage} />
        }
      </div> 
      {/* bg images */}
      <div className="z-0">
        <img src={person2} alt="decoration" className="absolute opacity-50 bg-image" style={{left: "35%", bottom: "-8%"}} />
        <img src={person1} alt="decoration" className="absolute opacity-20 bg-image" style={{left: "45%", bottom: "10%"}} />
        <img src={person3} alt="decoration" className="absolute opacity-30 bg-image" style={{left: "30%", top: "-10%"}} />
        <img src={person4} alt="decoration" className="absolute opacity-40 bg-image" style={{left: "-5%", bottom: "10%"}} />
      </div>

    </div>
  );
}

function Upload({submitImage}) {
  return (
    <label className="flex flex-col items-center justify-center w-full border-2 file-upload border-dashed rounded-lg cursor-pointer bg-transparent hover:opacity-50 p-5">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <img src={inputBox} alt="input box" className="w-full" />
        <p className="mb-2 text-sm color-white text-center">
          <span className="font-semibold">Click to choose a picture of your fit</span> and get it analyzed by our AI.
        </p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" onChange={submitImage} />
    </label>
  )
}

export default App;
