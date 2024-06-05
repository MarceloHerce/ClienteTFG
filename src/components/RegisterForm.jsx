import "./css/RegisterForm.css";

import { FormProvider, useForm } from 'react-hook-form';
const apiUrl = import.meta.env.VITE_APP_USERAPI;
function RegisterForm(){

    const methods = useForm();

    console.log(methods.formState.errors)
    const onSubmit =methods.handleSubmit((data)=> {
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
            fetch(`${apiUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(convertedData),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
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
            <form  className="formBody" onSubmit={onSubmit}>
                {/*name*/}
                <label htmlFor="username">
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
                

                {/*name*/}
                <label htmlFor="email">
                    Email
                </label>
                <input 
                    type="email" 
                    { ...methods.register("email", {
                        required: {
                            value: true,
                            message: "Email is required"
                        },
                        pattern: {
                            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                            message: "Email is not valid"
                        }
                    })}
                />
                {
                    methods.formState.errors.email && <span>{methods.formState.errors.email.message}</span>
                }

                {/*password*/}
                <label htmlFor="password">
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

                {/*confirmpassword*/}
                <label htmlFor="confirmPassword">
                    Confirm Password
                </label>
                <input 
                    type="password" 
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

                {/*country*/}
                <label htmlFor="country">
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

                <label htmlFor="confirmTermsAndConditions">
                    I acccept terms and conditions
                    <input 
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
                

                <button type="submit">Send</button>
            </form>
        </FormProvider>
        
    )
}

export default RegisterForm;