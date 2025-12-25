import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoadingPage.css';

const LoadingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-container">
      <h1 className="loading-text">Loading...</h1>
      <div className="progress-bar-container">
        <div className="progress-bar"></div>
      </div>
    </div>
  );
};

export default LoadingPage;