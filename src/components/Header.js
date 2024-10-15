import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleImageClick = () =>{
        if(location.pathname !== '/')
        navigate('/dashboard');
    }
    
    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');  
        localStorage.removeItem('userEmail');  
        navigate('/');  
      };

    return (
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="Logo" className="header-logo" onClick={handleImageClick} />
            </div>
            <div className="header-middle">
                <h2>ACID-BASE</h2>
            </div>
            <div className="header-right">
                {location.pathname !== '/' && (
                    <Link to="/" className="header-link" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;