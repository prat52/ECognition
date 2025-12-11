import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import Testimonials from "../../components/testimonials/Testimonials";
import heroImg from "../../assets/AI-3.png";
import roboImg from "../../assets/robo.png";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="home">
        <div className="home-content">
          <h1>Welcome to our E-learning Platform</h1>
          <p>Learn, Grow, Excel</p>

          <button
            onClick={() => navigate("/courses")}
            className="common-btn getst-button"
          >
            Get Started
          </button>

          {/* ✅ Image added */}
          <div className="home-images">
  <img
    src={heroImg}
    alt="E-learning"
    className="home-image"
  />

  <img
    src={roboImg}
    alt="AI Learning"
    className="robo-image"
  />
</div>

        </div>
      </div>

      <Testimonials />
    </div>
  );
};

export default Home;