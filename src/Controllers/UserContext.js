// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [username, setUsername] = useState('');

    // Retrieve username from localStorage when the component mounts
    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            console.log('Username retrieved from localStorage:', storedUsername);
        }
    }, []);

    // Update the username and store it in localStorage
    const updateUsername = (name) => {
        setUsername(name);
        localStorage.setItem('username', name);
    };

    //check if user name exists in local storage
    const checkUser = () => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            return true;
        }
        return false;
    };

    return (
        <UserContext.Provider value={{ username, updateUsername, checkUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};
