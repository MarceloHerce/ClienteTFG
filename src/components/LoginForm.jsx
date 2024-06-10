import { FormProvider, useForm } from 'react-hook-form';
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_APP_USERAPI;
function LoginForm({ onLoginSuccess }){
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const { jwt, setJwt  } = useContext(AppContext);
    const methods = useForm();

    const onSubmit =methods.handleSubmit((data)=> {
        setLoginError("")
        console.log("JWT DEFAULT: " + jwt);
        console.log("Errors:")
        console.log(methods.formState.errors)

        console.log("Data:")
        console.log(data)

        if (Object.keys(methods.formState.errors).length === 0) {
            console.log("Sending request")
            const convertedData = {
                username: data.username,
                password: data.password,
            };
            console.log(data)
            console.log(convertedData)
            console.log(`${apiUrl}/auth/login`)
            try {
                fetch(`${apiUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(convertedData),
                })
                .then(response => {
                    if(!response.ok){
                        if (response.status === 403) {
                            setLoginError({message: "Username or passwor incorrect", status: '403'})
                            throw new Error('403');
                        } 
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    setJwt(data.token)
                    setTimeout(function() {
                      }, 4000);
                    console.log("JWT loged: " + jwt);
                    onLoginSuccess();
                })
                .catch((error) => {
                    if (error.message === '403') {
                        console.log('ola');
                    }
                    console.error('Error:', error);
                });
            } catch (error) {
                setLoginError({message: "Server error", status: '500'})
            }
            
        } else {
            console.log("Form has errors. Cannot submit.")
        }
        })

    return (
        <FormProvider {...methods}>
            <form  className="flex-1 flex-col justify-center items-center" onSubmit={onSubmit}>

                <div className="flex flex-col w-full mb-4">
                    {/*name*/}
                    <label htmlFor="username" className="self-start mb-1 text-teal-100">
                        Nombre
                    </label>
                    <input  className='rounded-sm bg-white text-black'
                        type="text" 
                        { ...methods.register("username", 
                        {
                            required: {
                                value: true,
                                message: "Name is required"
                            },
                            minLength: {
                                value: 4,
                                message: "Min length 4"
                            },
                            maxLength: {
                                value: 20,
                                message: "Max lenght 20"
                            }
                        })
                        }
                    />
                    {
                        methods.formState.errors.username && <span>{methods.formState.errors.username.message}</span>
                    }
                </div>
                
                <div className="flex flex-col w-full mb-4 text-black">
                    {/*password*/}
                    <div className='flex justify-between'>
                        <label htmlFor="password" className="self-start mb-1 text-teal-100">
                            Password
                        </label>
                        <div
                        className="relative inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-teal-500"
                        onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash className='text-teal-300'/> : <FaEye className='text-teal-300'/>}
                        </div>
                    </div>
                    
                    <input className='rounded-sm bg-white'
                        type={showPassword ? 'text' : 'password'}
                        { ...methods.register("password", {
                            required: {
                                value: true,
                                message: "Password is required"
                            }
                        })}
                    />
                    
                    {
                        methods.formState.errors.password && <span>{methods.formState.errors.password.message}</span>
                    }
                </div>
                
                
                {loginError && <p className="text-red-500">{loginError.message}</p>}
                <button type="submit" className='w-2/3 text-teal-200'>Send</button>
            </form>
        </FormProvider>
        
    )
}

export default LoginForm;