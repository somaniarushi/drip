import { useState, useEffect } from 'react';
import axios from 'axios';
import S3FileUpload from 'react-s3';
import { uploadFile } from "react-s3"
window.Buffer = window.Buffer || require("buffer").Buffer;


const config = {
  bucketName: 'dripdownbucket',
  region: 'us-west-2',
  accessKeyId: 'ACCESS_KEY_ID',
  secretAccessKey: 'SECRET_ACCESS_KEY',
  s3Url: 'https://dripdownbucket.s3.amazonaws.com/'
}

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

  async function getResponse() {
    const res = await uploadFile(image, config)
    .then(data => console.log(data))
    .catch(err => console.error(err));

    console.log(res);

    axios({
      method: 'GET',
      url: `dripdownbucket.s3.amazonaws.com/me.jpeg`, // change this to your flask server
    })
    .then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })


    // axios({
    //   method: 'GET',
    //   url: `${FLASK_APP}/roast`, // change this to your flask server
    //   params: {
    //     image: imageURL
    //   }
    // }).then((res) => {
    //   setResponse(res.data);
    // }).catch((err) => {
    //   console.log(err);
    // });
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
