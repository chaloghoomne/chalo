import React, { useState } from 'react';
import { User, Mail, Phone, FileText, Send, Loader2, MapPin, Plane } from 'lucide-react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

import { BASE_URL } from '../../api-integration/urlsVariable';  // Ensure correct import


function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    description: ''
  });

  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const resp = await axios.post(`${BASE_URL}add-travel-agent`, formData);
      if (resp) {
        toast.success('Congratulations! Your application is submitted.');
        setFormData({
          name: '',
          email: '',
          phoneNumber: '',
          description: ''
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to submit the application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: 'Full Name', name: 'name', icon: User, type: 'text' },
    { label: 'Email Address', name: 'email', icon: Mail, type: 'email' },
    { label: 'Phone Number', name: 'phoneNumber', icon: Phone, type: 'tel' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <meta charSet="utf-8" />
        <title>Travel Agent Application | Join Our Network</title>
        <link rel="canonical" href="https://chaloghoomne.com/" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-8 bg-gradient-to-r from-purple-600 to-blue-600 sm:px-10">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-full">
                <Plane className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white text-center">Become a Travel Agent</h1>
            <p className="mt-2 text-blue-100 text-center">Join our network and start your journey in the travel industry</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {formFields.map(({ label, name, icon: Icon, type }) => (
                <div key={name} className="relative">
                  <label
                    className={`block text-sm font-medium transition-all duration-200 ${
                      focusedField === name ? 'text-purple-600' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${focusedField === name ? 'text-purple-600' : 'text-gray-500'}`} />
                      {label}
                    </div>
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField('')}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}

              <div className="relative">
                <label
                  className={`block text-sm font-medium transition-all duration-200 ${
                    focusedField === 'description' ? 'text-purple-600' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileText className={`w-4 h-4 ${focusedField === 'description' ? 'text-purple-600' : 'text-gray-500'}`} />
                    Tell us about yourself
                  </div>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('description')}
                  onBlur={() => setFocusedField('')}
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Share your experience and why you want to join our network"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex items-center justify-center gap-2 px-8 py-3 border border-transparent text-base font-medium rounded-full
                  ${isSubmitting 
                    ? 'bg-purple-400 cursor-not-allowed' 
                    : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                  }
                  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200
                `}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer Section */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Join our global network of travel professionals</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;