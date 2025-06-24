import { React, useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import './Header.css'

import MenuIcon from '@material-ui/icons/Menu';
import ClearIcon from '@material-ui/icons/Clear';

function Header() {
    const [menutoggle, setMenutoggle] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const history = useHistory();

    useEffect(() => {
        // Check login status from cookie/localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setIsLoggedIn(true);
            setUser(JSON.parse(userData));
        } else {
            setIsLoggedIn(false);
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        document.cookie = 'userEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsLoggedIn(false);
        setUser(null);
        history.push('/signin');
    };

    const Toggle = () => {
        setMenutoggle(!menutoggle)
    }

    const closeMenu = () => {
        setMenutoggle(false)
    }

    return (
        <div className="header">
            <div className="logo-nav">
            <Link to='/'>
                <a href="#home">LIBRARY</a>
            </Link>
            </div>
            <div className='nav-right'>
                <input className='search-input' type='text' placeholder='Search a Book'/>
                <ul className={menutoggle ? "nav-options active" : "nav-options"}>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/'>
                            <a href="#home">Home</a>
                        </Link>
                    </li>
                    <li className="option" onClick={() => { closeMenu() }}>
                        <Link to='/books'>
                        <a href="#books">Books</a>
                        </Link>
                    </li>
                    {isLoggedIn ? (
                        <li className="option" onClick={() => { closeMenu() }}>
                            <Link to='/profile'>
                                <a href="#profile">{user ? user.userFullName : 'Profile'}</a>
                            </Link>
                            <button onClick={handleLogout} style={{marginLeft: '10px'}}>Logout</button>
                        </li>
                    ) : (
                        <li className="option" onClick={() => { closeMenu() }}>
                            <Link to='/signin'>
                                <a href='signin'>SignIn</a>
                            </Link>
                        </li>
                    )}
                </ul>
            </div>

            <div className="mobile-menu" onClick={() => { Toggle() }}>
                {menutoggle ? (
                    <ClearIcon className="menu-icon" style={{ fontSize: 40 }} />
                ) : (
                    <MenuIcon className="menu-icon" style={{ fontSize: 40 }} />
                )}
            </div>
        </div>
    )
}

export default Header
