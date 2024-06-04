//import "./css/RegisterForm.css";

import { FormProvider, useForm } from 'react-hook-form';
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';


function LoginForm({ onLoginSuccess }){
    const { jwt, setJwt  } = useContext(AppContext);
    const methods = useForm();

    const onSubmit =methods.handleSubmit((data)=> {
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
            fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convertedData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setJwt(data.token)
                setTimeout(function() {
                  }, 4000);
                console.log("JWT loged: " + jwt);
                onLoginSuccess();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        } else {
            console.log("Form has errors. Cannot submit.")
        }
        })

    return (
        <FormProvider {...methods}>
            <form  className="flex-1 flex-col justify-center items-center" onSubmit={onSubmit}>

                <div className="flex flex-col w-full mb-4">
                    {/*name*/}
                    <label htmlFor="username" className="self-start mb-1">
                        Nombre
                    </label>
                    <input 
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
                
                <div className="flex flex-col w-full mb-4">
                    {/*password*/}
                    <label htmlFor="password" className="self-start mb-1">
                        Password
                    </label>
                    <input 
                        type="password"
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
                
                

                <button type="submit" className='w-2/3'>Send</button>
            </form>
        </FormProvider>
        
    )
}

export default LoginForm;