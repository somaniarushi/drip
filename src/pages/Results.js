import React from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel';
import logo from '../assets/icons/logo.svg';

function App() {
  const { state } = useLocation();

  return (
    <div className="flex flex-col justify-center h-screen max-w-4xl mx-auto w-full">
      {/* header */}
      <div className="ml-5 mr-5 mt-5 h-20 flex flex-row justify-center items-center">
        {/* left */}
        <div className="flex-1 flex flex-row justify-start items-center">
          <img src={logo} alt="logo" className="w-20" />
        </div>
        {/* right */}
        <div className=" flex-1 flex flex-row justify-end items-center">
          <a className="hover:opacity-50 header" href="/">
            RE-TAKE 📸 
          </a>
        </div>
      </div>
      <div className="ml-5 mr-5 mb-10">
        <h1 className="text-5xl text-center align-center w-full">
          <span className="header-outline">YOUR DRIP </span>
          
          <span className="header">
          RESULTS
          </span>
        </h1>
        <div className="flex flex-row justify-center items-center">
          <div className="flex flex-col mr-10 w-full">
            <br /><br />
            <div className="flex justify-center">
              <img src={state.imageURL} alt="your fit" className="w-80 bg-gray-100"/>
            </div>
          </div>
          <div className="w-full flex flex-col justify-center items-center">
            <Carousel state={state} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;
