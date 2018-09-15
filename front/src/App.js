import React, { Component } from 'react';
import Clarifai from'clarifai';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
 apiKey: '639012d464404f3dae7d61f1fe35f9f2'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
         enable: true, 
         value_area: 200 
      }
    },
    color:{
      value: '#ffffff'
    }
  }
};

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      img_url: '',
      box: {},
      route: 'signin',
      isSignedin: false,
    }
  }

  calculateFaceLocation = (data) => {
    const faceBoxArr = data.outputs[0].data.regions;
    const face = faceBoxArr[0].region_info.bounding_box;
    const image = document.getElementById("imageInput");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height, 
      rightCol: width - (face.right_col * width),
      bottomRow: height - (face.bottom_row * height),
    }
  }

  displayFaceBox = box => this.setState({box: box})

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonClick = () => {
    this.setState({img_url: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then(response => this.calculateFaceLocation(response))
    .then(box => this.displayFaceBox(box))
    .catch( err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'home'){
      this.setState({isSignedin: true});
    }else if(route === 'signin') {
      this.setState({isSignedin: false});
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedin, box, img_url, route} = this.state
    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}  />
        <Navigation onRouteChange={this.onRouteChange} isSignedin={isSignedin}/>
        {
          (route === 'signin'
            ? <Signin onRouteChange={this.onRouteChange}/>
            : (route === 'home'
              ? <div>
                  <Logo />
                  <Rank />
                  <ImageLinkForm 
                    onInputChange={this.onInputChange} 
                    onButtonClick={this.onButtonClick}
                  />
                  <FaceRecognition 
                  box={box} 
                  img_url={img_url}
                  />     
                </div>
                : <Register onRouteChange={this.onRouteChange} />
            ))
        }
      </div>
    );
  }
}

export default App;
