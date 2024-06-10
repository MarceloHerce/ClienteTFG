//import "./css/RegisterForm.css";

import { FormProvider, useForm } from 'react-hook-form';
import React, { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const apiUrl = import.meta.env.VITE_APP_USERAPI;
function RegisterForm(){
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
    const [registered, setRegistered] = useState('');
    const [userExist, setUserExist] = useState('');

    

    const togglePasswordVisibility = (field) => {
        setShowPassword((prevState) => ({
          ...prevState,
          [field]: !prevState[field],
        }));
      };

    const methods = useForm();

    console.log(methods.formState.errors)
    const onSubmit =methods.handleSubmit((data)=> {
        setRegistered('');
        setUserExist('');
        console.log(data)
        if (Object.keys(methods.formState.errors).length === 0) {
            console.log("Sending request")
            const convertedData = {
                username: data.username,
                password: data.password,
                email: data.email,
                country: data.country === 'es'
            };
            console.log(data)
            console.log(convertedData)
            try {
                fetch(`${apiUrl}/auth/register`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(convertedData),
                  })
                    .then(response => {
                      if (!response.ok) {
                        if (response.status === 409) {
                          throw new Error('409');
                        } else {
                          throw new Error(`HTTP error! status: ${response.status}`);
                        }
                      }
                      setRegistered(true);
                      return response.json();
                    })
                    .then(data => {
                      //console.log('Success:', data);
                    })
                    .catch(error => {
                      if (error.message === '409') {
                        setUserExist("exist")
                        console.log('ola');
                      } else {
                        console.error('Error:', error.message);
                      }
                    });
            } catch (error) {
                setRegistered(false)
            }
        } else {
            console.log("Form has errors. Cannot submit.")
        }
        })

    return (
        <FormProvider {...methods}>
            <form  className="flex-1 flex-col justify-center items-center" onSubmit={onSubmit}>
                {}
                <div className='flex flex-col w-full mb-4'>
                    {/*name*/}
                    <label htmlFor=" text" className='self-start mb-1 text-teal-100'>
                        Nombre
                    </label>
                    <input className='rounded-sm bg-white text-black'
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
                            },
                            //validate: (value) => {
                            //    return methods.watch('password') === value || "Password doesn`t macth";
                            //}
                        })
                        }
                    />
                    {
                        methods.formState.errors.username && <span>{methods.formState.errors.username.message}</span>
                    }
                </div>
                
                
                <div className='flex flex-col w-full mb-4'>
                    {/*name*/}
                    <label htmlFor="email" className='self-start mb-1 text-teal-100'>
                        Email
                    </label>
                    <input className='rounded-sm bg-white text-black'
                        type="email" 
                        { ...methods.register("email", {
                            required: {
                                value: true,
                                message: "Email is required"
                            },
                            pattern: {
                                value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                                message: "Email is not valid"
                            },
                            //validate: (value) => {
                            //    return methods.watch('password') === value || "Password doesn`t macth";
                            //}
                        })}
                    />
                    {
                        methods.formState.errors.email && <span>{methods.formState.errors.email.message}</span>
                    }
                </div>
                

                <div className='flex flex-col w-full mb-4'>
                    <div className='flex justify-between'>
                        {/*password*/}
                        <label htmlFor="password" className='self-start mb-1 text-teal-100'>
                            Password
                        </label>
                        <div
                        className="relative inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-teal-500"
                        onClick={() => togglePasswordVisibility('password')}
                        >
                            {showPassword.password ? <FaEyeSlash className='text-teal-300'/> : <FaEye className='text-teal-300'/>}
                        </div>
                    </div>
                    
                    <input className='rounded-sm bg-white text-black'
                        type={showPassword.password ? 'text' : 'password'}
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
                

                <div className='flex flex-col w-full mb-4'>
                    <div className='flex justify-between'>
                        {/*confirmpassword*/}
                        <label htmlFor="confirmPassword" className='self-start mb-1 text-teal-100'>
                            Confirm Password
                        </label>
                        <div
                        className="relative inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-teal-500"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                        >
                            {showPassword.confirmPassword ? <FaEyeSlash className='text-teal-300'/> : <FaEye className='text-teal-300'/>}
                        </div>
                        
                    </div>
                    <input className='rounded-sm bg-white text-black'
                            type={showPassword.confirmPassword ? 'text' : 'password'} 
                            { ...methods.register("confirmPassword", {
                                required: {
                                    value: true,
                                    message: "Password confirm is required"
                                },
                                validate: (value) => {
                                    return methods.watch('password') === value || "Password doesn`t macth";
                                }
                            })}
                    />
                    {
                        methods.formState.errors.confirmPassword && <span>{methods.formState.errors.confirmPassword.message}</span>
                    }
                </div>
                

                <div className='flex flex-col w-full mb-4 '>
                    {/*country*/}
                    <label htmlFor="country" className='self-start mb-1 text-teal-100'>
                        Country
                    </label>
                    <select 
                        { ...methods.register("country", {
                            required: {
                                value: true,
                                message: "Country is required"
                            }
                        })}
                    >
                        <option
                        value="es"> Spain
                        </option>
                        <option
                        value="fr"> France
                        </option>
                    </select>
                    {
                        methods.formState.errors.country && <span>{methods.formState.errors.country.message}</span>
                    }
                </div>
                

                <div className='flex flex-col w-full mb-4'>
                    <label htmlFor="confirmTermsAndConditions" className='self-start mb-1 text-teal-100 flex justify-center gap-3'>
                        I acccept terms and conditions
                        <input className='rounded-sm bg-white w-4 text-black'
                            type="checkbox"
                            { ...methods.register("confirmTermsAndConditions", {
                                required: {
                                    value: true,
                                    message: "ConfirmTermsAndConditions is required"
                                }
                            })}
                        >
                        </input>
                    </label>
                    {
                        methods.formState.errors.confirmTermsAndConditions && <span>{methods.formState.errors.confirmTermsAndConditions.message}</span>
                    }
                </div>
                
                {(userExist && Object.keys(methods.formState.errors).length === 0) && <p className="text-red-500">Username or email exist</p>}

                {registered === true && <p className="text-green-500">Login successful</p>}
                {registered === false && <p className="text-red-500">Login error</p>}

                <button type="submit" className='w-2/3 text-teal-200'>Send</button>
            </form>
        </FormProvider>
        
    )
}

export default RegisterForm;