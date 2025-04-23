import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'system'>('profile');

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <TopBar />
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your account settings and preferences
              </p>
              
              <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                <div className="sm:flex">
                  {/* Sidebar for settings navigation */}
                  <div className="sm:w-64 border-r border-gray-200">
                    <nav className="flex sm:flex-col">
                      <button
                        onClick={() => setActiveTab('profile')}
                        className={`px-3 py-3 text-sm font-medium w-full text-left flex items-center ${
                          activeTab === 'profile'
                            ? 'bg-primary-light text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="material-icons text-sm mr-3">person</span>
                        Profile
                      </button>
                      <button
                        onClick={() => setActiveTab('notifications')}
                        className={`px-3 py-3 text-sm font-medium w-full text-left flex items-center ${
                          activeTab === 'notifications'
                            ? 'bg-primary-light text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="material-icons text-sm mr-3">notifications</span>
                        Notifications
                      </button>
                      <button
                        onClick={() => setActiveTab('security')}
                        className={`px-3 py-3 text-sm font-medium w-full text-left flex items-center ${
                          activeTab === 'security'
                            ? 'bg-primary-light text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="material-icons text-sm mr-3">security</span>
                        Security
                      </button>
                      <button
                        onClick={() => setActiveTab('system')}
                        className={`px-3 py-3 text-sm font-medium w-full text-left flex items-center ${
                          activeTab === 'system'
                            ? 'bg-primary-light text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <span className="material-icons text-sm mr-3">settings</span>
                        System Settings
                      </button>
                    </nav>
                  </div>
                  
                  {/* Main content area */}
                  <div className="p-6 flex-1 overflow-y-auto">
                    {activeTab === 'profile' && (
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
                        
                        <div className="space-y-6">
                          {/* Profile info section */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                              <div className="mr-4 h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-white text-xl">
                                <span className="material-icons text-lg">person</span>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium">Dr. Sarah Chen</h3>
                                <p className="text-sm text-gray-500">Primary Care Physician</p>
                                <p className="text-sm text-gray-500">Memorial Hospital</p>
                              </div>
                              <div className="ml-auto">
                                <button className="text-primary hover:text-primary-dark text-sm font-medium">
                                  Change Photo
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Personal Info Form */}
                          <div>
                            <h3 className="text-md font-medium mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label htmlFor="first-name" className="block text-sm font-medium text-gray-700">
                                  First name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    name="first-name"
                                    id="first-name"
                                    defaultValue="Sarah"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label htmlFor="last-name" className="block text-sm font-medium text-gray-700">
                                  Last name
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    name="last-name"
                                    id="last-name"
                                    defaultValue="Chen"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                  Email address
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    defaultValue="sarah.chen@memorial.org"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                  Role
                                </label>
                                <div className="mt-1">
                                  <select
                                    id="role"
                                    name="role"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    defaultValue="physician"
                                  >
                                    <option value="physician">Primary Care Physician</option>
                                    <option value="specialist">Specialist</option>
                                    <option value="nurse">Nurse</option>
                                    <option value="admin">Administrator</option>
                                  </select>
                                </div>
                              </div>

                              <div className="sm:col-span-3">
                                <label htmlFor="hospital" className="block text-sm font-medium text-gray-700">
                                  Hospital/Organization
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    name="hospital"
                                    id="hospital"
                                    defaultValue="Memorial Hospital"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Contact Form */}
                          <div>
                            <h3 className="text-md font-medium mb-3">Contact Information</h3>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                              <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                  Phone number
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    name="phone"
                                    id="phone"
                                    defaultValue="(555) 123-4567"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                              
                              <div className="sm:col-span-3">
                                <label htmlFor="office" className="block text-sm font-medium text-gray-700">
                                  Office number
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="text"
                                    name="office"
                                    id="office"
                                    defaultValue="E-302"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-5">
                            <button
                              type="button"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'notifications' && (
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                        
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-500">
                              Configure how you want to be notified about patient updates, AI call results, and system alerts.
                            </p>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-md font-medium">Alert Notifications</h3>
                            
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">High Risk Alerts (Red)</h4>
                                <p className="text-sm text-gray-500">
                                  Receive notifications when a patient has a high-risk finding
                                </p>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="high-risk-email"
                                  name="high-risk-email"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="high-risk-email" className="text-xs text-gray-500 mr-4">Email</label>
                                
                                <input
                                  id="high-risk-sms"
                                  name="high-risk-sms"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="high-risk-sms" className="text-xs text-gray-500 mr-4">SMS</label>
                                
                                <input
                                  id="high-risk-app"
                                  name="high-risk-app"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="high-risk-app" className="text-xs text-gray-500">In-app</label>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">Moderate Risk Alerts (Yellow)</h4>
                                <p className="text-sm text-gray-500">
                                  Receive notifications when a patient has a moderate-risk finding
                                </p>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="moderate-risk-email"
                                  name="moderate-risk-email"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="moderate-risk-email" className="text-xs text-gray-500 mr-4">Email</label>
                                
                                <input
                                  id="moderate-risk-sms"
                                  name="moderate-risk-sms"
                                  type="checkbox"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="moderate-risk-sms" className="text-xs text-gray-500 mr-4">SMS</label>
                                
                                <input
                                  id="moderate-risk-app"
                                  name="moderate-risk-app"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="moderate-risk-app" className="text-xs text-gray-500">In-app</label>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between py-3 border-b border-gray-200">
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">New Call Report</h4>
                                <p className="text-sm text-gray-500">
                                  Receive notifications when a new AI call with a patient is completed
                                </p>
                              </div>
                              <div className="flex items-center">
                                <input
                                  id="call-report-email"
                                  name="call-report-email"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="call-report-email" className="text-xs text-gray-500 mr-4">Email</label>
                                
                                <input
                                  id="call-report-sms"
                                  name="call-report-sms"
                                  type="checkbox"
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="call-report-sms" className="text-xs text-gray-500 mr-4">SMS</label>
                                
                                <input
                                  id="call-report-app"
                                  name="call-report-app"
                                  type="checkbox"
                                  defaultChecked
                                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"
                                />
                                <label htmlFor="call-report-app" className="text-xs text-gray-500">In-app</label>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-5">
                            <button
                              type="button"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'security' && (
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                        
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-500">
                              Manage your password and account security settings.
                            </p>
                          </div>
                          
                          {/* Change Password Section */}
                          <div>
                            <h3 className="text-md font-medium mb-3">Change Password</h3>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                  Current Password
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="current-password"
                                    name="current-password"
                                    type="password"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                  New Password
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="new-password"
                                    name="new-password"
                                    type="password"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                  Confirm New Password
                                </label>
                                <div className="mt-1">
                                  <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type="password"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none"
                                >
                                  Update Password
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Two-factor Authentication */}
                          <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-md font-medium mb-3">Two-Factor Authentication</h3>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-500">
                                  Add an extra layer of security to your account by enabling two-factor authentication.
                                </p>
                              </div>
                              <div className="flex items-center ml-4">
                                <button
                                  type="button"
                                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none"
                                >
                                  Enable 2FA
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Session Management */}
                          <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-md font-medium mb-3">Session Management</h3>
                            <p className="text-sm text-gray-500 mb-4">
                              You're currently signed in to the following devices.
                            </p>
                            
                            <div className="space-y-3">
                              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="material-icons text-gray-400 mr-3">computer</span>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Chrome - Windows</p>
                                    <p className="text-xs text-gray-500">Last active 2 minutes ago</p>
                                  </div>
                                </div>
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  Current Session
                                </div>
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                                <div className="flex items-center">
                                  <span className="material-icons text-gray-400 mr-3">phone_iphone</span>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">Safari - iPhone</p>
                                    <p className="text-xs text-gray-500">Last active 3 hours ago</p>
                                  </div>
                                </div>
                                <button className="text-red-600 hover:text-red-800 text-xs font-medium">
                                  Sign Out
                                </button>
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <button className="text-primary hover:text-primary-dark text-sm font-medium">
                                Sign out from all other devices
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'system' && (
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 mb-4">System Settings</h2>
                        
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm text-gray-500">
                              Configure system-wide settings for how the CareCall application behaves.
                            </p>
                          </div>
                          
                          {/* Theme Preferences */}
                          <div>
                            <h3 className="text-md font-medium mb-3">Appearance</h3>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
                                  Theme
                                </label>
                                <div className="mt-1">
                                  <select
                                    id="theme"
                                    name="theme"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    defaultValue="light"
                                  >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System Default</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor="color-scheme" className="block text-sm font-medium text-gray-700">
                                  Color Scheme
                                </label>
                                <div className="mt-1">
                                  <select
                                    id="color-scheme"
                                    name="color-scheme"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    defaultValue="blue"
                                  >
                                    <option value="blue">Blue (Default)</option>
                                    <option value="green">Green</option>
                                    <option value="purple">Purple</option>
                                    <option value="red">Red</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Language and Format Settings */}
                          <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-md font-medium mb-3">Language and Format</h3>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                                  Language
                                </label>
                                <div className="mt-1">
                                  <select
                                    id="language"
                                    name="language"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    defaultValue="en"
                                  >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="zh">Chinese</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div>
                                <label htmlFor="date-format" className="block text-sm font-medium text-gray-700">
                                  Date Format
                                </label>
                                <div className="mt-1">
                                  <select
                                    id="date-format"
                                    name="date-format"
                                    className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
                                    defaultValue="mdy"
                                  >
                                    <option value="mdy">MM/DD/YYYY</option>
                                    <option value="dmy">DD/MM/YYYY</option>
                                    <option value="ymd">YYYY/MM/DD</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Data Privacy */}
                          <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-md font-medium mb-3">Data Privacy and Sharing</h3>
                            <div className="space-y-4">
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="analytics"
                                    name="analytics"
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="analytics" className="font-medium text-gray-700">
                                    Share usage analytics
                                  </label>
                                  <p className="text-gray-500">
                                    Help improve Brigid by sharing anonymous usage data
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-start">
                                <div className="flex items-center h-5">
                                  <input
                                    id="research"
                                    name="research"
                                    type="checkbox"
                                    defaultChecked
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                  />
                                </div>
                                <div className="ml-3 text-sm">
                                  <label htmlFor="research" className="font-medium text-gray-700">
                                    Contribute to research
                                  </label>
                                  <p className="text-gray-500">
                                    Allow anonymized data to be used for AI model improvement and healthcare research
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end pt-5">
                            <button
                              type="button"
                              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}