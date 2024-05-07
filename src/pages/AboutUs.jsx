import React, { useState, useEffect } from 'react';
import LoginForm from "../components/LoginForm"

function AboutUs() {
    const [isLogin, setIsLogin] = useState(true); // Define el estado isLogin

    useEffect(() => {
        // Actualiza el estado isLogin al montar el componente
        setIsLogin(true);
    }, []);

    const handleToggleLogin = (e) => {
        e.preventDefault();
        setIsLogin(!isLogin); // Cambia el estado isLogin
    };
    return (
        <>
            <LoginForm isLogin={isLogin}></LoginForm>
            <div>
                {isLogin ? (
                <p>¿No tienes una cuenta? <a href="#" onClick={handleToggleLogin}>Regístrate aquí</a></p>
                ) : (
                <p>¿Ya tienes una cuenta? <a href="#" onClick={handleToggleLogin}>Inicia sesión aquí</a></p>
                )}
            </div>
        </>
    )
}

export default AboutUs;