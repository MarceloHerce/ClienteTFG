import React, { useState, useEffect } from 'react';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import LoginGoogle from '../GoogleLogin';

function LoginAndRegisterForm({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true); 

    useEffect(() => {
        setIsLogin(true);
    }, []);

    const handleToggleLogin = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin); 
    };
  return (
    <div className='w-2/4 m-auto'>
        {!isLogin ? <RegisterForm /> : <div className='flex flex-col '> <LoginGoogle onLoginSuccess={onLoginSuccess}/> <LoginForm onLoginSuccess={onLoginSuccess}/> </div>}
        <div>
            {isLogin ? (
            <p>¿No tienes una cuenta? <a href="#" onClick={handleToggleLogin}>Regístrate aquí</a></p>
            ) : (
            <p>¿Ya tienes una cuenta? <a href="#" onClick={handleToggleLogin}>Inicia sesión aquí</a></p>
            )}
        </div>
    </div>
  );
}

export default LoginAndRegisterForm;
