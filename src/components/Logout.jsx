import React, {useContext} from 'react';
import { AppContext } from '../context/AppContext';
const Logout = () => {
    const { jwt, setJwt} = useContext(AppContext);
    const token = jwt;

    const logout = () => {
        try {
        localStorage.removeItem(jwt);
        setJwt('')
        } catch (error) {
        console.error('Error get recording:', error);
        }
    };

    return (
        <div>
        <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Logout;