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
  return (
    <div>
      <h1>Ratings</h1>
      <p>Originality</p>
      <div class="meter">
          <span style={{width: ratings['originality'] + "0%"}}></span>
      </div>

      <p>Flair</p>
      <div class="meter">
          <span style={{width: ratings['flair'] + "0%"}}></span>
      </div>

      <p>Cohesiveness</p>
      <div class="meter">
          <span style={{width: ratings['cohesiveness'] + "0%"}}></span>
      </div>

      <p>Execution</p>
      <div class="meter">
          <span style={{width: ratings['execution'] + "0%"}}></span>
      </div>
    </div>
  )
}

export default Carousel;