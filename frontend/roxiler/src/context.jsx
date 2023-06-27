import React, { createContext, useState } from 'react';
export const mycontext = createContext()

const Context = ({ children }) => {
    let [month, setMonth] = useState(3)

    return (
        <div>
            <mycontext.Provider value={{ month, setMonth }}>
                {children}
            </mycontext.Provider>

        </div>
    );
}

export default Context;
