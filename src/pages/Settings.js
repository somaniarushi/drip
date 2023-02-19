import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Background from '../components/Background';
import { FadeIn } from 'react-slide-fade-in';
import { tsParticles } from "https://cdn.jsdelivr.net/npm/tsparticles-engine/+esm";
import { loadFull } from "https://cdn.jsdelivr.net/npm/tsparticles/+esm";
import { loadCardsShape } from "https://cdn.jsdelivr.net/npm/tsparticles-shape-cards/+esm";

const FLASK_APP = "http://127.0.0.1:5000";

function Settings() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const description = state.description;
  const imageURL = state.imageURL;

  const [roastLevel, setRoastLevel] = useState("light");
  const [isLoading, setLoading] = useState(false)

  const handleRoastChange = (e) => {
    setRoastLevel(e.target.value);
  }

  async function submitRoastType(e) {
    setLoading(true);
    loadParticles(configs);

    // Get info from backend
    const roast = await getRoast(description, roastLevel);
    console.log(roast);
    const rating = await getRating(description, roast);
    console.log(rating);
    const aura = await getAura(description, roast);
    console.log(aura);

    // turn off particles
    const particles = tsParticles.domItem(0);
    particles.destroy();

    // Navigate to results page
    navigate('/results', { state: { description: description, roast: roast, rating: rating, aura: aura, imageURL: imageURL } });
  }

  async function getRating(description, roast) {
    const res = await axios.get(`${FLASK_APP}/rating?desc=${description}&roast=${roast}`);
    console.log("Rating", res.data);
    return res.data.rating;
  }

  async function getAura(description, roast) {
    const res = await axios.get(`${FLASK_APP}/aura?desc=${description}&roast=${roast}`);
    console.log("Aura", res.data);
    return res.data;
  }

  async function getRoast(description) {
    const res = await axios.get(`${FLASK_APP}/roast?desc=${description}&roastLevel=${roastLevel}`);
    console.log("Roast", res.data);
    return res.data.critique;
  }
  
  return (
    <div className="p-4 flex flex-col justify-center h-screen max-w-2xl mx-auto text-left">
      <div className="z-10">
        <FadeIn from="bottom" positionOffset={50} duration={500}>
          <img src={imageURL} alt="preview upload" className="w-1/2 mx-auto object-cover h-80 p-10 rounded-lg" />
        </FadeIn>
        <FadeIn from="bottom" positionOffset={100} duration={600}>
          <p>Almost there! One last step.</p>
          <h1 className="header text-2xl font-bold text-gray-900 dark:text-white">
            What kind of roast would you like?
          </h1>
          <label htmlFor="underline_select" className="sr-only">Underline select</label>
          <select id="underline_select" className="block py-2.5 px-0 w-full text-md text-gray-100 bg-transparent border-0 border-b-2 border-gray-100 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer text-lg" onChange={handleRoastChange}>
            <option defaultValue value="light">Light roast (to hype you up)</option>
            <option value="medium">Medium roast (to improve your fit)</option>
            <option value="dark">Dark roast (to feel the pain)</option>
          </select>
          <button onClick={submitRoastType} className="gradient font-bold py-2 px-4 mt-10 rounded text-black" disabled={isLoading}>
            {isLoading ? "LOADING..." : "SUBMIT FOR ANALYSIS"}
          </button>
        </FadeIn>

      </div>
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
      <Background />
    </div>
  );
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


export default Settings;