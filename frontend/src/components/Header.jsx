// src/components/Header.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../features/themeSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import WeatherButton from './WeatherButton';

const Header = () => {
  const theme = useSelector((state) => state.theme.mode);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const handleClickOnLogout = ()=>{
    navigate('/logout',{
      state:{from : location.pathname}
    });
  }

  return (
    <header className="navbar bg-primary text-primary-content shadow-lg static top-0 z-50 px-4 ">
      <div className="flex-1" onClick={()=> navigate('/')}>
        <a className="btn btn-ghost text-xl md:text-2xl font-bold font-serif">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          FarmBazaar
        </a>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-none">
        <nav className="menu menu-horizontal px-1 mr-4">
          <ul className="flex items-center space-x-2">
            <li><a className="font-medium hover:bg-primary-focus rounded-btn" onClick={() => navigate('/')}>Home</a></li>
            <li><a className="font-medium hover:bg-primary-focus rounded-btn" onClick={() => navigate('/blog')}>Blogs</a></li>
            <li><a className="font-medium hover:bg-primary-focus rounded-btn">Pricing</a></li>
            <li><a className="font-medium hover:bg-primary-focus rounded-btn" onClick={() => navigate('/about')}>About</a></li>
            <li><a className="font-medium hover:bg-primary-focus rounded-btn">{<WeatherButton/>}</a></li>
                    
            
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <label className="swap swap-rotate">
            <input 
              type="checkbox" 
              checked={theme === 'light'}
              onChange={() => dispatch(toggleTheme())}
            />
            <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
            <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
            </svg>
          </label>
          
          {/* Notification Bell */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <div className="indicator">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="badge badge-xs badge-secondary indicator-item"></span>
              </div>
            </div>
            <div tabIndex={0} className="card dropdown-content card-compact z-[1] mt-3 w-52 bg-base-100 shadow text-base-content">
              <div className="card-body">
                <span className="font-bold text-lg">3 Notifications</span>
                <span>You have 3 unread messages</span>
              </div>
            </div>
          </div>
          
          {/* User Profile */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-lg font-bold">EF</span>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-base-content">
              <li className="border-b border-base-300">
                <div className="flex flex-col p-2">
                  <span className="font-bold">Ujjwal Dikshit</span>
                  <span className="text-sm">ujjwaldikshit1@.com</span>
                </div>
              </li>
              <li onClick={()=>{navigate('/user/dashboard')}}><a>Dashboard</a></li>
              <li><a>Profile</a></li>
              <li><a>Settings</a></li>
              <li>
                <a
                  className="font-medium hover:bg-primary-focus rounded-btn block p-2"
                  onClick={handleClickOnLogout}
                >
                  Logout
                </a>
              </li>

            </ul>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <div className="md:hidden flex-none">
        <label className="swap swap-rotate mr-4">
          <input 
            type="checkbox" 
            checked={theme === 'dark'}
            onChange={() => dispatch(toggleTheme())}
          />
          <svg className="swap-on fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
          </svg>
          <svg className="swap-off fill-current w-7 h-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"/>
          </svg>
        </label>
        
        <button 
          className="btn btn-square btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-primary shadow-lg">
          <nav className="menu p-4">
            <ul className="space-y-2">
              <li><a className="font-medium hover:bg-primary-focus rounded-btn block p-2" onClick={() => navigate('/')}>Home</a></li>
              <li><a className="font-medium hover:bg-primary-focus rounded-btn block p-2">Features</a></li>
              <li><a className="font-medium hover:bg-primary-focus rounded-btn block p-2">Pricing</a></li>
              <li><a className="font-medium hover:bg-primary-focus rounded-btn block p-2" onClick={() => navigate('/about')}>About</a></li>
              <li className="border-t border-primary-focus pt-2 mt-2">
                <a className="font-medium hover:bg-primary-focus rounded-btn block p-2">Dashboard</a>
              </li>
              <li><a className="font-medium hover:bg-primary-focus rounded-btn block p-2">Profile</a></li>
              <li><a className="font-medium hover:bg-primary-focus rounded-btn block p-2">Settings</a></li>
              <li>
                <a
                  className="font-medium hover:bg-primary-focus rounded-btn block p-2"
                  onClick={handleClickOnLogout}
                >
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>

      )}
    </header>
  );
};

export default Header;