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
    <div className='w-full m-auto px-1'>
        {!isLogin ? <RegisterForm /> : <div className='flex flex-col '> <LoginGoogle onLoginSuccess={onLoginSuccess}/> <LoginForm onLoginSuccess={onLoginSuccess}/> </div>}
        <div className='w-full'>
            {isLogin ? (
            <p className='text-teal-50'>¿No tienes una cuenta? <a href="#" onClick={handleToggleLogin} className='text-teal-200'>Regístrate aquí</a></p>
            ) : (
            <p className='text-teal-50'>¿Ya tienes una cuenta? <a href="#" onClick={handleToggleLogin} className='text-teal-200'>Inicia sesión aquí</a></p>
            )}
        </div>
    </div>
  );
}

export default LoginAndRegisterForm;
