import React from 'react';
import { useLocation } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import '../index.css'

function App() {
  const { state } = useLocation();

  return (
    <div>
      <h1>Results</h1>
      <p>Description: {state.description}</p>
      <p>Roast: {state.roast}</p>
      <Ratings ratings={state.rating} />
    </div>
  )
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

export default App;