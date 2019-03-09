import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkform/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: 'ffeee19f143242f384d460e704563cb6'
});

const particlesOptions={
  particles:{
    number:{
      value:50,
      density:{
        enable:true,
        value_area:300
      }

    }
  }
}
class App extends Component {
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      box: {},
      route: 'signIn',
      isSignedIn: false,
     user:{
       
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
      }
    }
  }

 onLoadUser=(data)=>{
    this.setState({user:{
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation=(data)=>{

   const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
   const image= document.getElementById('inputimage');
   const width= Number(image.width);
   const height= Number(image.height);
   return{
    leftCol: clarifaiFace.left_col*width,
    topRow: clarifaiFace.top_row*width,
    rightCol: width-(clarifaiFace.right_col*width),
    bottomRow: height-(clarifaiFace.bottom_row*height),
   }
  }
  displayFaceBox=(box)=>{
    this.setState({box: box});
  }
  onInputChange=(event)=>{
   
    this.setState({input: event.target.value});
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input});
   
   app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
   .then(response => {
    if(response){
       fetch('http://localhost:3000/image', {
      method: 'put',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        id: this.state.user.id,
        
      })
    }).then(response => response.json())
      .then(data => {
        console.log(data);
        this.onLoadUser(data);

      })
   
    }
    this.displayFaceBox(this.calculateFaceLocation(response))
   .catch(err => console.log(err));
  
  })
 }
  onRouteChange=(route)=>{
    
    if(route==='home'){
     this.setState({isSignedIn: true}); 
    }
    else if(route==='signOut'){
      this.setState({isSignedIn: false});
    }
     this.setState({route: route});
  }
  render() {
    return (
      <div className="App">
       <Particles className='Particles'
                params={particlesOptions} />
       <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
       {this.state.route==='home'
       ? <div>
        <Logo/>
        <Rank name={this.state.user.name} entries={this.state.user.entries} />
        <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
        </div> 
        :(this.state.route==='register'
        ?<Register onLoadUser={this.onLoadUser} onRouteChange={this.onRouteChange} />
         :
         <SignIn onLoadUser={this.onLoadUser} onRouteChange={this.onRouteChange}/>
         )
        } 
      </div>
    );
  }
}

export default App;
