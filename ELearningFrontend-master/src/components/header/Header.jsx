import React from "react";
import "./header.css";
import { Link } from "react-router-dom";
import logo from "../../assets/LOGO.png";

const Header = ({ isAuth }) => {
  return (
    <header>
      <div className="logo">
        <Link to={"/"}><img src={logo} alt="e-cognition" /></Link>
      </div>
      <div className="title">
        E-Cognition | Dare To Learn
      </div>

      <div className="link">
        <Link to={"/"}>Home</Link>
        <Link to={"/courses"}>Courses</Link>
        <Link to={"/about"}>About</Link>
        {isAuth ? (
          <Link to={"/account"}>Account</Link>
        ) : (
          <Link to={"/login"}>Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
