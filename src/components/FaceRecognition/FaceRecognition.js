import React from 'react'; 
import './FaceRecognition.css';

const FaceRecognition = ({ box, img_url }) => {
  return (
    <div className='center ma'>
      <div className='absolute mt2'>
        <img id='imageInput' alt='' src={img_url} width='500px' height='auto'/>
        <div className='bounding-box' style={{left: box.leftCol, right: box.rightCol, top: box.topRow, bottom: box.bottomRow}}/>
      </div>
    </div>
    );
}

export default FaceRecognition;