import React from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Header from '../components/Header';

function App() {
  const { state } = useLocation();

  return (
    <div className="flex flex-col justify-center h-screen max-w-4xl mx-auto w-full">
      <Header />
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
