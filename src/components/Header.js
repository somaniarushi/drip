import React from 'react';
import logo from '../assets/icons/logo.svg';

function Header() {
  return (
    <div className="ml-5 mr-5 mt-5 h-20 flex flex-row justify-center items-center hover:cursor-pointer" onClick={() => window.location.href = "/"}>
      <div className="flex-1 flex flex-row justify-start items-center">
        <img src={logo} alt="logo" className="w-20" />
      </div>
    </div>
  )
}

export default Header;