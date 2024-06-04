import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { AppContext } from './context/AppContext';
import { useContext } from 'react';


function LoginGoogle({ onLoginSuccess }) {
    const {jwt,setJwt} = useContext(AppContext);
    return (
        <div className='my-4 self-center'>
            <GoogleLogin className="m-auto"
                onSuccess={credentialResponse => {
                    const credentialResponseResponseDecoded = jwtDecode(
                        credentialResponse.credential
                    );
                    console.log(jwt)
                    console.log(credentialResponse)
                    console.log(credentialResponseResponseDecoded);
                    setJwt(credentialResponse.credential);
                    console.log(jwt);
                    onLoginSuccess();
                }}
                onError={() => {
                    console.log("Login Failed")
                }}
            />
        </div>);
}
export default LoginGoogle;