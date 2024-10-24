import React, { useEffect } from 'react';
import '../styles/styles.css';
import NavBar from './NavBar';
import Categories from './Categories';
import Carousel from './Carousal';
import { useUser } from '../Controllers/UserContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { checkUser } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    const isLoggedIn = checkUser();
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [checkUser, navigate]);

  return (
    <div className="home-container">
      <NavBar />
      <div className="home_content_bg">
      </div>
      <div className="home_content">
        <Carousel />
        <Categories />
      </div>
    </div>
  );
};

export default Home;