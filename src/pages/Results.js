import React from 'react';
import { useLocation } from 'react-router-dom';
import Carousel from '../components/Carousel';
import Header from '../components/Header';
import { FadeIn } from 'react-slide-fade-in';

function App() {
  const { state } = useLocation();

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto w-full">
      <div className="ml-5 mr-5">
        <Header />
        <FadeIn from="bottom" positionOffset={50} duration={300}>
          <h1 className="text-5xl text-center align-center w-full">
            <span className="header-outline">YOUR DRIP </span>
            <span className="header">
            RESULTS
            </span>
          </h1>
          <p className="text-center max-w-xl mx-auto">
            Click or drag back and forth to see what our professional AI stylist thinks of your drip.
          </p>
        </FadeIn>
        <div className="flex justify-center items-center w-full mt-10">
          <FadeIn from="bottom" positionOffset={100} duration={300} delay={300}>
            <img src={state.imageURL} alt="your fit" className="w-40 shine" />
          </FadeIn>
        </div>
        <div className="w-full flex flex-col justify-center items-center" style={{ marginTop: -70 }}>
          <FadeIn from="bottom" positionOffset={150} duration={200} delay={500}>
            <Carousel state={state} />
          </FadeIn>
        </div>
      </div>
    </div>
  )
}

export default App;
