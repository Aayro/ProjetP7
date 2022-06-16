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
    const [isActive, setActive,] = useState(false);

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

    const toggleClass = () => {
        setActive(!isActive);
    };

    function parseJwt(token) {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }
    const user = parseJwt(token);

    return (
        <>
            <header>
                <div className="navbar">
                    <div className="logo_nav">
                        <a href="/home"><img className="image" src="/assets/icon-left-font-monochrome-white.svg" alt="Logo de groupomania" /></a>
                    </div>
                    <div className={isActive ? 'dropdown is-active' : "dropdown"}>
                        <div className="dropdown-trigger">
                            <button className="button btnprofile" aria-haspopup="true" aria-controls="dropdown-menu" onClick={toggleClass}>
                                {user != undefined ? (<img className="img_profil" src={'../images/profilepictures/' + user.userImg} alt='Photo de profil' />) : ('')}
                            </button>
                        </div>
                        <div className="dropdown-menu" id="dropdown-menu" role="menu">
                            <div className="dropdown-content">
                                <NavLink to={'profile/' + myId}
                                    onClick={() => navigate(`/profile/${myId}`, { replace: true })}
                                    className='dropdown-item'>
                                    <span>Profil</span>
                                </NavLink>
                                <NavLink to="settings" className={({ isActive }) => (isActive ?
                                    (isAdmin == 1 ? ('nav-active-admin') : ('nav-active')) : (isAdmin == 1 ? ('inactive-admin') : ('inactive')))}>
                                    <span>Éditer mon profil</span>
                                </NavLink>
                                <NavLink to="logout" className='dropdown-item'>
                                    <span className="deconnexion">Se déconnecter</span>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header