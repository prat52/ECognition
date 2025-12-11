import React from "react";
import "./footer.css";
import {
  AiFillFacebook,
  AiFillTwitterSquare,
  AiFillInstagram,
  AiFillLinkedin,
  AiFillGithub,
  AiFillMail,
  AiFillProfile,
} from "react-icons/ai";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>
          &copy; 2024 Your E-COGNITION. All rights reserved.
        </p>
        <div className="social-links">
          <a href="https://www.linkedin.com/in/prathamesh-bhawar-011798225/" target="_blank">
            <AiFillLinkedin />
          </a>
          <a href="https://github.com/prat52/" target="_blank">
            <AiFillGithub />
          </a>
         
        </div>
      </div>
    </footer>
  );
};

export default Footer;
