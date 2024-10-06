
import React, { useState } from 'react';
import FacebookLogin from 'react-facebook-login';

const FBLogin = () => {
  const [user, setUser] = useState(null);

  const handleFBLogin = (response) => {
    if (response.status !== 'unknown') {
      setUser(response);
      console.log("User details:", response);
    } else {
      console.log("User canceled login or did not fully authorize.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <FacebookLogin
    
        appId="1234567890"
        style={{textTransform:"none"}}
        autoLoad={false}
        fields="name,email,picture"
        callback={handleFBLogin}
        icon="fa-facebook"   
        
      />
      {user && (
        <div>
          <h3>Welcome, {user.name}</h3>
          <img src={user.picture.data.url} alt={user.name} />
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default FBLogin;
