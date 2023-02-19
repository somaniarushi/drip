import React from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const { state } = useLocation();

  return (
    <div>
      <h1>Results</h1>
      <p>Description: {state.description}</p>
      <p>Roast: {state.roast}</p>
      <p>Rating: {state.rating}</p>
    </div>
  )
}

export default App;