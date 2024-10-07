import React, { useEffect, useState } from 'react';
import { FacebookLoginButton } from 'react-social-login-buttons';

import {LoginSocialFacebook} from 'reactjs-social-login';


const FBLogin = () => {
  const [user, setUser] = useState(null);

 
 
 

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
<LoginSocialFacebook 
  appId="1191189065269920"
  onResolve={(user) => {
    console.log("user", user);
  }}
  onReject={(err) => {
    console.log(err);
  }}
>
        <FacebookLoginButton  />
        </LoginSocialFacebook>
      
    </div>
  );
};



export default FBLogin;
