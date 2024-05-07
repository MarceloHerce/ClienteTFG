import { createContext, useState } from "react";


export const AppContext = createContext();

export function AppContextProvider({children}) {
    const [jwt, setJwt] = useState("Soy el jwt context");
    return (
        <AppContext.Provider value ={
                {
                    jwt,
                    setJwt
                }
            }
        >
            {children}
        </AppContext.Provider>
    )
}