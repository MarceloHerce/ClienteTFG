import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { AppContext } from './context/AppContext';
import { useContext } from 'react';


function Login() {
    const {jwt,setJwt} = useContext(AppContext);
    return (
        <GoogleLogin
            onSuccess={credentialResponse => {
                const credentialResponseResponseDecoded = jwtDecode(
                    credentialResponse.credential
                );
                console.log(jwt)
                console.log(credentialResponse)
                console.log(credentialResponseResponseDecoded);
                setJwt(credentialResponse.credential);
                console.log(jwt);
            }}
            onError={() => {
                console.log("Login Failed")
            }}
        />);
}
export default Login;