import React from "react";

const DrawerContext = React.createContext();

export const DrawerProvider = ({ children }) => {
    const [open, setOpen] = React.useState(false);

    return (
        <DrawerContext.Provider value={{ open, setOpen }}>
            {children}
        </DrawerContext.Provider>   
    );
};

export const useDrawer = () => React.useContext(DrawerContext);