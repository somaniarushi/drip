import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadFile } from "react-s3";
import inputBox from '../assets/input/image-input-box.svg';
import { useNavigate } from 'react-router-dom';
import Background from '../components/Background';
import Header from '../components/Header';
import { tsParticles } from "https://cdn.jsdelivr.net/npm/tsparticles-engine/+esm";
import { loadFull } from "https://cdn.jsdelivr.net/npm/tsparticles/+esm";
import { loadCardsShape } from "https://cdn.jsdelivr.net/npm/tsparticles-shape-cards/+esm";
import { FadeIn } from 'react-slide-fade-in';

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
];

function App() {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const [loadingFlavor, setLoadingFlavor] = useState(LOADING_FLAVOR[0]);

  // 0: need image, 1: loading, 2: done with description
  const [phase, setPhase] = useState(0);

  const navigate = useNavigate();

  // Rotating loading flavor text
  useEffect(() => {
    if (phase) {
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
    loadParticles(configs);

    const img = e.target.files[0];
    setImage(img);
    setPhase(1);
    
    if (img == null) {
      console.log("Image is null");
      return;
    }

    console.log(img);

    // Upload image to S3
    const data = await uploadFile(img, config);
    console.log(data);
    setImageURL(data.location);

    // Get description
    const description = await getDesc(data.location);
    console.log(description);

    // Set phase to done
    setPhase(2);

    // turn off particles
    const particles = tsParticles.domItem(0);
    particles.destroy();

    // navigate away
    navigate('/settings', { state: { description: description, imageURL: data.location } });
  }

  async function getDesc(imageURL) {
    const res = await axios.get(`${FLASK_APP}/desc?url=${imageURL}`);
    console.log("Description", res.data);
    return res.data.desc;
  }

  return (
    <div className="responsive-flex p-20">
      <div className="flex flex-col justify-center mr-10 z-10">
        <FadeIn from="bottom" positionOffset={50} duration={300}>
          <Header />
          <div className="text-6xl">
            <h1 className="header">DRIP</h1>
            <h1 className="header-outline">
              OR DROWN
            </h1>
          </div>
          <div className="text-1xl">
            {phase > 0 ? (
              <>
                <p>Fit uploaded successfully! Hang tight.</p>
                {phase > 1 ? <p>Almost done...</p> : <p>{loadingFlavor}</p>}
              </>            
            ): (
              <p>Refine your aesthetic.<br />Curate excellence.</p>
            )}
          </div>
        </FadeIn>
      </div>
      <div className="flex items-center justify-center file-upload-container z-10">
        {imageURL ?
          (
            <div>
              <img src={imageURL} alt="preview upload" className="w-64 shine" />
            </div>
          ) :
          <Upload submitImage={submitImage} />
        }
      </div> 
      <Background />
      <p className="fixed bottom-10 left-10 text-xs color-white sm-hidden">
        {phase > 0 ? "LOADING..." : "*AI is not perfect. We are not responsible for any bad fits."}
      </p>
    </div>
  );
}

function Upload({submitImage}) {
  return (
    <label className="flex flex-col items-center justify-center w-full file-upload cursor-pointer bg-transparent hover:opacity-50 p-5">
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <img src={inputBox} alt="input box" className="w-full" />
        <p className="mb-2 text-sm color-white text-center">
          <span className="font-semibold">Click to choose a picture of your fit</span> and get it analyzed by our expert AI stylist*.
        </p>
      </div>
      <input id="dropzone-file" type="file" className="hidden" onChange={submitImage} />
    </label>
  )
}

async function loadParticles(options) {
  await loadFull(tsParticles);
  await loadCardsShape(tsParticles);

  await tsParticles.load(options);
}

const configs = {
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "repulse"
      }
    }
  }, 
  particles: {
    number: {
      value: 100
    },
    shape: {
      type: "character",
      options: {
        character: {
          value: "💧",
        },
      }
    },
    move: {
      enable: true,
      angle: 0,
      speed: 9,
      direction: "bottom",
    },
    size: {
      random: {
        enable: true,
        maximumValue: 20,
        minimumValue: 10
      }
    },
    opacity: {
      value: { min: 0, max: 0.4 },
      animation: {
        count: 1,
        enable: true,
        speed: 0.5,
        startValue: "min",
        sync: false
      }
    },
  },
};


export default App;
