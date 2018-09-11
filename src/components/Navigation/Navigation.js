import React from 'react'; 

const Navigation = ({ onRouteChange, isSignedin }) => {
  if(isSignedin){
    return (
      <nav style={{display:'flex', justifyContent:'flex-end'}}>
        <p onClick={() => onRouteChange('signin')} className='f3 link dim pointer pa3 underline'>Sign out</p>
      </nav>);  
  }else{
    return (
      <nav style={{display:'flex', justifyContent:'flex-end'}}>
        <p onClick={() => onRouteChange('signin')} className='f3 link dim pointer pa3 underline'>Sign in</p>
        <p onClick={() => onRouteChange('register')} className='f3 link dim pointer pa3 underline'>Register</p>
      </nav>);  
  }
}

export default Navigation;