import { useState } from 'react';
import axios from 'axios';

const FLASK_APP = "http://127.0.0.1:5000";

function App() {
  const [response, setResponse] = useState(null);

  function getResponse() {
    axios({
      method: 'GET',
      url: `${FLASK_APP}/hello`, // change this to your flask server
    }).then((res) => {
      setResponse(res.data);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div>
        <button onClick={getResponse} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Response
        </button>
        {response &&
          <p className="text-center">
            {response['description'].toString()}
          </p>
        }   
      </div>
    </div>
  );
}

export default App;
