import React from 'react';
import logo from '../assets/icons/logo.svg';

function Header() {
  return (
    <img src={logo} alt="logo" className="logo hover:cursor-pointer" onClick={() => window.location.href = "/"} />
  )
}

export default Header;