import React from 'react';
import logo from '../assets/icons/logo.svg';

function Header() {
  return (
    <img src={logo} alt="logo" className="logo hover:cursor-pointer w-20 m-0" onClick={() => window.location.href = "/"} />
  )
}

export default Header;