import React from 'react';

const WorkInProgress = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-white shadow-xl">
        <div className="card-body items-center text-center">
          <div className="rounded-full bg-blue-100 p-6 mb-4">
            <svg 
              className="w-16 h-16 text-blue-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
              />
            </svg>
          </div>
          
          <h2 className="card-title text-3xl font-bold text-blue-700 mb-2">
            Work in Progress
          </h2>
          
          <p className="text-blue-600 mb-6">
            We're working hard to bring you an amazing experience. This page will be available soon!
          </p>
          
          <div className="w-full bg-blue-100 rounded-full h-4 mb-6">
            <div 
              className="bg-blue-500 h-4 rounded-full animate-pulse" 
              style={{ width: '65%' }}
            ></div>
          </div>
          
          <div className="text-sm text-blue-400 mb-4">
            Estimated completion: <span className="font-semibold">Soon</span>
          </div>
          
          <button className="btn btn-primary bg-blue-500 hover:bg-blue-600 border-none text-white">
            Notify Me When Ready
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkInProgress;