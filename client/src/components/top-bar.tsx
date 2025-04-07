import React, { useState } from "react";

export function TopBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState(2); // Example count for UI display

  return (
    <div className="relative z-10 flex flex-shrink-0 h-16 bg-white shadow">
      <button 
        type="button" 
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 md:hidden"
        aria-label="Open sidebar"
      >
        <span className="material-icons">menu</span>
      </button>
      
      {/* Search bar */}
      <div className="flex-1 px-4 flex">
        <div className="flex w-full md:ml-0">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons text-gray-500">search</span>
            </div>
            <input 
              className="block w-full h-full pl-10 pr-3 py-2 rounded-md text-sm placeholder-gray-500 bg-gray-100 border-transparent focus:border-primary focus:outline-none" 
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Filter dropdown */}
        <div className="ml-4 flex items-center">
          <button 
            type="button" 
            className="inline-flex items-center px-3 py-1 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            <span className="material-icons text-sm mr-1">filter_list</span>
            Filter
            {activeFilters > 0 && (
              <span className="ml-2 text-xs bg-primary text-white rounded-full px-2 py-0.5">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>
      
      {/* Right side icons */}
      <div className="flex items-center pr-4">
        <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
          <span className="material-icons">notifications</span>
        </button>
        <button className="ml-3 p-1 text-gray-500 rounded-full hover:bg-gray-100">
          <span className="material-icons">help_outline</span>
        </button>
      </div>
    </div>
  );
}
