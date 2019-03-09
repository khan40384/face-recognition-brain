import React from 'react';

const Navigation = ({isSignedIn,onRouteChange}) => {
	
		
	       if(isSignedIn)
	       	{
	       		return(
	       		<nav style={{display: 'flex',justifyContent: 'flex-end'}}>
	       		<p onClick={() => onRouteChange('signOut')} className='f3 link dim black underline pa3 pointer'>sign out</p>
		         </nav>
		         );
		    }
		    else{
             return(
	       		<nav style={{display: 'flex',justifyContent: 'flex-end'}}>
	       		<p onClick={() => onRouteChange('signIn')} className='f3 link dim black underline pa3 pointer'>sign in</p>
	       		<p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>register</p>
		         </nav>
		         );
		    }	
}
export default Navigation;