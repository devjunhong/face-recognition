import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Register from './components/Register/Register';
import './App.css';

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

const initialState = {
  input: '',
  img_url: '',
  box: {},
  route: 'signin',
  isSignedin: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    join: '',
  }
}  


class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  componentDidMount(){
    fetch('http://localhost:5000/')
      .then(response => response.json())
      .then(console.log);
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        join: data.join,        
      }
    })
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
    fetch('http://localhost:5000/imageurl', {
      'method': 'post',
      'headers': {'Content-type': 'application/json'},
      'body': JSON.stringify({
        'input': this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('http://localhost:5000/image', {
          'method': 'put',
          'headers': {
            'Content-type': 'application/json'
          },
          'body': JSON.stringify({
            'id': this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => { 
            this.setState(Object.assign(this.state.user, {entries: count}));
          })
          .catch(console.log)
      this.displayFaceBox(this.calculateFaceLocation(response));
      }
    })
    .catch( err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route === 'home'){
      this.setState({isSignedin: true});
    }else if(route === 'signin') {
      this.setState(initialState);
    }
    this.setState({route: route});
  }

  render() {
    const {isSignedin, box, img_url, route} = this.state;
    const { name, entries } = this.state.user;  

    return (
      <div className="App">
        <Particles className='particles' params={particlesOptions}  />
        <Navigation onRouteChange={this.onRouteChange} isSignedin={isSignedin}/>
        {
          (route === 'signin'
            ? <Signin 
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}/>
            : (route === 'home'
              ? <div>
                  <Logo />
                  <Rank 
                  name={name}
                  entries={entries}/>
                  <ImageLinkForm 
                    onInputChange={this.onInputChange} 
                    onButtonClick={this.onButtonClick}
                  />
                  <FaceRecognition 
                  box={box} 
                  img_url={img_url}
                  />     
                </div>
                : <Register 
                onRouteChange={this.onRouteChange} 
                loadUser={this.loadUser}/>
            ))
        }
      </div>
    );
  }
}

export default App;
