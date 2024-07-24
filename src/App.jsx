import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './pages/home/Home';
import SignUp from './pages/Authentication/Signup';
import Login from './pages/Authentication/Login';
import ForgotPassword from './pages/Authentication/ForgotPassword';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import VisaTypes from './pages/visa-types/VisaTypes';
import Packages from './pages/packages/Packages';



// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem('authToken');
//   return token ? children : <Navigate to="/login" />;
// };

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={
                <Home />
              // <PrivateRoute>
            
              // </PrivateRoute>
              } 
              />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/visa-types" element={<VisaTypes />} />
              <Route path="/packages" element={<Packages />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
