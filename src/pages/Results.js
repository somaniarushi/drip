import React from 'react';

function App(props) {
  console.log(props);

  return (
    <div>
      <h1>Results</h1>
      <p>{props.location.state.description}</p>
      <p>{props.location.state.roast}</p>
      <p>{props.location.state.rating}</p>
    </div>
  )
}

export default App;