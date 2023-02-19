import { useState } from 'react';
import ReactSimplyCarousel from 'react-simply-carousel';
import Heart from '../assets/icons/heart.png';
import '../index.css'

function Carousel({state}) {
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // get first sentence of roast
  const roast = state.roast.split('.')[0];

  // get rest of sentences of roast
  const roastRest = state.roast.split('.').slice(1).join('.');

  return (
    <div className="flex flex-col justify-content h-full w-full overflow-y-scroll">
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
        backwardBtnProps={{
          //here you can also pass className, or any other button element attributes
          style: {
            padding: '20px 0',
          },
          children: <p>🔥 back</p>,
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
        {/* here you can also pass any other element attributes. Also, you can use your custom components as slides
        <div className="carousel-slide">
          <h3 className="header text-3xl">This is what we see...</h3>
          <br />
          <p>{state.description}</p>
        </div>
        */}
        <div className="carousel-slide">
          <div>
            <img src={Heart} alt="heart" className="w-10 inline-block" />
            <h3 className="header text-3xl">Feedback</h3>
          </div>
          <br />
          <p className="header gradient">{roast}.</p>
          <br />
          <p>{roastRest}</p>
        </div>
        <div className="carousel-slide">
          <Ratings ratings={state.rating} />
        </div>
        <div className="carousel-slide">
          slide 3
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
          <img src={Heart} alt="heart" className="w-10 inline-block" />
          <h3 className="header text-3xl">Ratings</h3>
        </div>
        <br />
      <div className="flex flex-row justify-center">
        <div className="meter" style={{height: "20px", marginBottom: '30px', marginRight: "30px"}}>
            <span style={{width: avgPercent + "%"}}></span>
        </div>
        <p>{avgPercent + "%"}</p>
      </div>

      <p>Originality</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '30px', marginRight: "30px"}}>
            <span style={{width: ratings['originality'] + "0%",
                            background: "linear-gradient(175deg, rgb(244, 104, 239), rgb(255, 255, 255))"
          }}></span>
        </div>
        <p>{ratings['originality'] + "0%"}</p>
      </div>

      <p>Flair</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '30px', marginRight: "30px"}}>
            <span style={{width: ratings['flair'] + "0%",
                          background: "linear-gradient(175deg, rgb(244, 104, 239), rgb(255, 255, 255))"
            }}></span>
        </div>
        <p>{ratings['flair'] + "0%"}</p>
      </div>

      <p>Cohesiveness</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '30px', marginRight: "30px"}}>
            <span style={{width: ratings['cohesiveness'] + "0%",
                          background: "linear-gradient(175deg, rgb(248, 158, 109), rgb(249, 163, 246))"
          }}></span>
        </div>
        <p>{ratings['cohesiveness'] + "0%"}</p>
      </div>

      <p>Execution</p>
      <div className="flex flex-row justify-center">
        <div className="meter" style={{marginBottom: '30px', marginRight: "30px"}}>
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