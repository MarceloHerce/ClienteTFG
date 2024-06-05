import { createContext, useState, useEffect} from "react";


export const AppContext = createContext();

export function AppContextProvider({children}) {
    const [jwt, setJwt] = useState(() => localStorage.getItem('jwt') || '');
    useEffect(() => {
        if (jwt) {
          localStorage.setItem('jwt', jwt);
        } else {
          localStorage.removeItem('jwt');
        }
      }, [jwt]);
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