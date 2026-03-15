import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from "firebase/auth"; 

const TeacherLogin = ({ onLogin, onSwitchToSignup, onSwitchToStudentLogin, onSwitchToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(''); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('Teacher logged in successfully');
      onLogin(); 
    } catch (err) {
      console.error('Login error:', err.message);
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="bg-white w-[380px] max-w-[95%] px-8 py-10 rounded-xl shadow-lg text-center">
      {/* Button removed here */}
      <div className="flex justify-center items-center mb-2.5">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-500 rounded-lg flex justify-center items-center text-xl text-white shadow-md">
          U
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-600 mb-1.25">Teacher Login</h2>
      <p className="text-gray-600 text-sm mb-6.25">Log in to access your dashboard</p>

      <form id="helpseekerLoginForm" onSubmit={handleSubmit}>
        <div className="text-left mb-3.75">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1.5">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            className="w-full px-3.5 py-2.75 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]" 
          />
        </div>
        <div className="text-left mb-3.75">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-1.5">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            className="w-full px-3.5 py-2.75 border-2 border-gray-200 rounded-lg text-sm transition-all focus:border-blue-600 focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]" 
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

        <button 
          type="submit" 
          className="w-full py-3 bg-blue-600 border-none text-white rounded-lg font-semibold text-base cursor-pointer transition-all hover:bg-blue-700 hover:shadow-[0_6px_15px_rgba(37,99,235,0.2)]"
        >
          Login
        </button>
      </form>

      <div className="mt-6.25 text-sm text-gray-800 pt-5 border-t border-gray-200">
        Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToSignup(); }} className="text-emerald-500 font-semibold no-underline hover:underline">Sign Up</a>
      </div>

      <div className="mt-5 text-sm text-gray-800">
        Are you a student? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToStudentLogin(); }} className="text-blue-600 font-semibold no-underline mx-1.25 hover:text-emerald-500">Login as Student</a>
      </div>
    </div>
  );
};

export default TeacherLogin;