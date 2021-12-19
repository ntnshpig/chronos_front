import React, {useState} from 'react';
import api from '../Services/api';
import { message } from "antd";

const AuthContext = React.createContext({
    token:'',
    userId: null,
    userLogin: '',
    email: '',
    fullName:'',
    region:'',
    isLoggedIn: false,
    login: (userData) => {},
    logout: () => {},
    update_info: ()=>{}
});

export const AuthContextProvider = (props) => {

    const initialToken = localStorage.getItem('token');
    const initialLogin = localStorage.getItem('userLogin');
    const initialUserId = localStorage.getItem('userId');
    const initialEmail = localStorage.getItem('email');
    const initialFullName = localStorage.getItem('fullName');
    const initialRegion = localStorage.getItem('region');

    const [token, setToken] = useState(initialToken);
    const [login, setLogin] = useState(initialLogin);
    const [email, setEmail] = useState(initialEmail);
    const [userId, setUserId] = useState(initialUserId);
    const [fullName, setFullName] = useState(initialFullName);
    const [region, setRegion] = useState(initialRegion);

    const isLoggedIn = !!token;

    const loginHandler = (userData) => {
        setToken(userData.token);
        setLogin(userData.user.login);
        setEmail(userData.user.email);
        setUserId(userData.user.id);
        setFullName(userData.user.full_name);
        setRegion(userData.user.region);

        localStorage.setItem('token', userData.token);
        localStorage.setItem('userLogin', userData.user.login);
        localStorage.setItem('userId', userData.user.id);
        localStorage.setItem('email', userData.user.email);
        localStorage.setItem('fullName', userData.user.full_name);
        localStorage.setItem('region', userData.user.region);
    }

    const updateUserInfo = async () => {
        try {
          const response = await api().get("api/users/"+userId);
    
          if (response.status === 200) {
            setEmail(response.data.email);
            setUserId(response.data.id);
            setFullName(response.data.full_name);
    
            localStorage.setItem("userId", response.data.id);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("fullName", response.data.full_name);
          } else {
            throw new Error(response.data.message);
          }
        } catch (error) {
          message.error(error.toString());
        }
      };

    const logoutHandler = async () => {
        try {
            const response = await api().post("api/auth/logout", {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: "Bearer " + token,
                }
            });

            if (response.status === 200) {
                message.success("Logout succeed!");
                setToken(null);
                setLogin('');
                setEmail('');
                setUserId(null);
                setFullName('');
                setRegion('');

                localStorage.removeItem('token');
                localStorage.removeItem('userLogin');
                localStorage.removeItem('userId');
                localStorage.removeItem('email');
                localStorage.removeItem('fullName');
                localStorage.removeItem('role');
                localStorage.removeItem('region');
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            message.error(error.toString());
        }
    }

    let contextValue = {
        token: token,
        userLogin: login,
        userId: userId,
        email: email,
        fullName:fullName,
        region: region,
        isLoggedIn: isLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
        update_info: updateUserInfo,
    };

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}


export default AuthContext;