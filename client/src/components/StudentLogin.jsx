import React, { useState } from 'react';
import { auth } from '../firebase'; 
import { signInWithEmailAndPassword } from "firebase/auth"; 

const StudentLogin = ({ onLogin, onSwitchToSignup, onSwitchToTeacherLogin, onSwitchToLanding }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });
  const [error, setError] = useState(''); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      console.log('Student logged in successfully');
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
      <h2 className="text-xl font-bold text-gray-600 mb-1.25">Student Login</h2>
      <p className="text-gray-600 text-sm mb-6.25">Log in to manage your tasks and optimize your time</p>

      <form id="studentLoginForm" onSubmit={handleSubmit}>
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

        <div className="flex items-center justify-between mt-2.5 mb-3 text-sm text-gray-600">
          <label className="flex items-center gap-1.5 whitespace-nowrap font-normal">
            <input 
              type="checkbox" 
              name="remember" 
              checked={formData.remember} 
              onChange={handleChange} 
              className="m-0 w-auto" 
            /> Remember me
          </label>
          <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
        </div>

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
        Are you a Teacher? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToTeacherLogin(); }} className="text-blue-600 font-semibold no-underline mx-1.25 hover:text-emerald-500">Login as Teacher</a>
      </div>
    </div>
  );
};

export default StudentLogin;