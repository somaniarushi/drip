import { useState, useEffect } from 'react';
import axios from 'axios';

const FLASK_APP = "http://127.0.0.1:5000";

function App() {
  const [response, setResponse] = useState(null);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState("");

  useEffect(() => {
    if (image == null) return;
    setImageURL(URL.createObjectURL(image));
  }, [image]);

  function onImageChange(e) {
    setImage(e.target.files[0]);
  }

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
        {imageURL ? <img src={imageURL} alt="preview upload" className="w-64 h-64" /> : <input type="file" onChange={onImageChange} />}
      </div>
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
