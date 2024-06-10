import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { AppContext } from './context/AppContext';
import { useContext } from 'react';


function LoginGoogle({ onLoginSuccess }) {
    const {jwt,setJwt} = useContext(AppContext);
    const insertUserIfNotExist = async (jwt) => {
        console.log("metodo");
        console.log(jwt);
        let a = await jwtDecode(jwt).email;
        let password = await jwtDecode(jwt).sub
        console.log(a);
        const requestBody = {
            username: a,  
            password: password,
            email: a,
            country: 'defaultCountry'  
        };
    
        fetch('http://localhost:8080/auth/register/google', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            setJwt(data.token);
            setTimeout(function() {
            }, 4000);
            console.log("JWT loged: " + jwt);
            onLoginSuccess();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    };
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
                    console.log(credentialResponse.credential);
                    insertUserIfNotExist(credentialResponse.credential);
                    onLoginSuccess();
                }}
                onError={() => {
                    console.log("Login Failed")
                }}
            />
        </div>);
}
export default LoginGoogle;