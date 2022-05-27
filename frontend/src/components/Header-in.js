import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import '../styles/Header.css';
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {
    const [myId, setId] = useState('');
    const [isAdmin, setAdmin] = useState('');
    const [token, setToken] = useState('');
    const [expire, setExpire] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        refreshToken();
    }, []);

    const refreshToken = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/token');
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setId(decoded.userId);
            setAdmin(decoded.isAdmin);
            setExpire(decoded.exp);
        } catch (error) {
            if (error.response) {
                navigate("/", { replace: true });
            }
        }
    }

    const axiosJWT = axios.create();

    axiosJWT.interceptors.request.use(async (config) => {
        const currentDate = new Date();
        if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get('http://localhost:5000/users/token');
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setAdmin(decoded.isAdmin);
            setExpire(decoded.exp);
        }
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    const Logout = async () => {
        try {
            await axios.delete('http://localhost:5000/users/logout');
            navigate("/", { replace: true });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <header>
                <div className="navbar">
                    <div className="logo_nav">
                        <img className="image" src="/assets/icon-left-font-monochrome-white.svg" alt="Logo de groupomania" />
                    </div>
                    <div className="dropdown">
                        <img className="img_profil" src='../images/profilepictures/monlogo.png' alt='Photo de profil' />
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header