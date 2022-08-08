import React, { useContext, useEffect, useState } from "react";
import { getUsers } from "src/services/firestore";

const Context = React.createContext({});

const Provider = ({ children }) => {
    const [users, setUsers] = useState();

    useEffect(() => {
        getUsers().then((res) => {
            const users = [];

            res.forEach((user) => {
                const data = user.data();
                users[data.address.toLowerCase()] = data;
            });

            setUsers(users);
        });
    }, []);

    return (
        <Context.Provider
            value={{
                users,
            }}
        >
            {children}
        </Context.Provider>
    );
};
export default Context;

export const FirebaseProvider = Provider;

export const useFirebase = () => {
    return useContext(Context);
};
