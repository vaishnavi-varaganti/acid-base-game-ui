import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
    const location = useLocation();
    
    return (
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="Logo" className="header-logo" />
            </div>
            <div className="header-middle">
                <h2>ACID-BASE</h2>
            </div>
            <div className="header-right">
                {location.pathname !== '/' && (
                    <Link to="/" className="header-link">
                        <i className="bi bi-box-arrow-right"></i>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;