
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import StockPage from './StockPage';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage user={null} />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/stock/:symbol" element={<StockPage />} />
    </Routes>
  );
};

export default App;
