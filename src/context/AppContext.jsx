import { createContext, useState } from "react";


export const AppContext = createContext();

export function AppContextProvider({children}) {
    const [jwt, setJwt] = useState(undefined);
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