import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';
import Heart from '../assets/icons/heart.png';
import Lightbulb from '../assets/icons/lightbulb.png';
import Drops from '../assets/icons/drops.png';
import '../index.css'

function Carousel({state}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // get first sentence of roast
  const roast = state.roast.split('.')[0];

  // get rest of sentences of roast
  const roastRest = state.roast.split('.').slice(1).join('.');

  // get first sentence of aura
  const aura = state.aura.description.split('.')[0];

  // get rest of sentences of aura
  const auraRest = state.aura.description.split('.').slice(1).join('.');

  return (
    <div className="flex flex-col justify-content h-full w-full items-center mt-10">
      <ReactSimplyCarousel
        activeSlideIndex={activeSlideIndex}
        onRequestChange={setActiveSlideIndex}
        infinite={false}
        itemsToShow={1}
        itemsToScroll={1}
        forwardBtnProps={{
          //here you can also pass className, or any other button element attributes
          style: {
            padding: '20px 0',
          },
          children: <p>next 🔥</p>,
        }}
        responsiveProps={[
          {
            itemsToShow: 1,
            itemsToScroll: 1,
            minWidth: 768,
          },
        ]}
        speed={400}
        centerMode={true}
        easing="ease-in-out"
      >
        <div className="carousel-slide">
          <div>
            <img src={Lightbulb} alt="lightbulb" className="w-10 inline-block" />
            <h3 className="header text-3xl">This is what we see from you...</h3>
          </div>
          <br />
          <p>{state.description}</p>
        </div>
        <div className="carousel-slide">
          <div>
            <img src={Heart} alt="heart" className="w-10 inline-block" />
            <h3 className="header text-3xl">This is what we'd like to see...</h3>
          </div>
          <br />
          <p className="header gradient-text">{roast}.</p>
          <br />
          <p>{roastRest}</p>
        </div>
        <div className="carousel-slide">
          <Ratings ratings={state.rating} />
        </div>
        <div className="carousel-slide">
          <div>
            <h3 className="header text-3xl">Your drip aura is...</h3>
            <h3 className="header gradient-text text-3xl">
              {state.aura.aura.toUpperCase()}
            </h3>
          </div>
          <br />
          <p className="header gradient-text">{aura}.</p>
          <br />
          <p>{auraRest}</p>
          <br />
        </div>
      </ReactSimplyCarousel>
    </div>
  );
}

function Ratings({ ratings }) {
  // Change all the ratings to integers
  for (const key in ratings) {
    ratings[key] = parseInt(ratings[key]);
  }
  // Calculate the average rating
  const avg = (ratings['originality'] + ratings['flair'] + ratings['cohesiveness'] + ratings['execution']) / 4;
  // Round the average rating to the nearest integer
  const roundedAvg = Math.round(avg);
  // Calculate it to be out of 100
  const avgPercent = roundedAvg * 10;
  return (
    <div>
      <div>
          <img src={Drops} alt="drops" className="w-10 inline-block" />
          <h3 className="header text-3xl">The Dripmeter</h3>
          <p>On our patented Dripmeter, you've earned the following scores:</p>
      </div>
      <br />

      <p className="header"><b>Overall</b></p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{height: "20px", marginBottom: '30px', marginRight: "30px"}}>
            <span style={{width: avgPercent + "%"}}></span>
        </div>
        <p className="header">{avgPercent + "%"}</p>
      </div>

      <p>Originality</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '10px', marginRight: "30px"}}>
            <span style={{width: ratings['originality'] + "0%",
                            background: "linear-gradient(175deg, rgb(244, 104, 239), rgb(255, 255, 255))"
          }}></span>
        </div>
        <p>{ratings['originality'] + "0%"}</p>
      </div>

      <p>Flair</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '10px', marginRight: "30px"}}>
            <span style={{width: ratings['flair'] + "0%",
                          background: "linear-gradient(175deg, rgb(244, 104, 239), rgb(255, 255, 255))"
            }}></span>
        </div>
        <p>{ratings['flair'] + "0%"}</p>
      </div>

      <p>Cohesiveness</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '10px', marginRight: "30px"}}>
            <span style={{width: ratings['cohesiveness'] + "0%",
                          background: "linear-gradient(175deg, rgb(248, 158, 109), rgb(249, 163, 246))"
          }}></span>
        </div>
        <p>{ratings['cohesiveness'] + "0%"}</p>
      </div>

      <p>Execution</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '10px', marginRight: "30px"}}>
            <span style={{width: ratings['execution'] + "0%",
                          background: "linear-gradient(175deg, rgb(248, 158, 109), rgb(249, 163, 246))"
          }}></span>
        </div>
        <p>{ratings['execution'] + "0%"}</p>
        </div>
      </div>
  )
}

export default Carousel;