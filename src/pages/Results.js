import React from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const { state } = useLocation();

  return (
    <div>
      <h1>Results</h1>
      <p>{state.description}</p>
      <p>{state.roast}</p>
      <p>{state.rating}</p>
    </div>
  )
}

export default App;