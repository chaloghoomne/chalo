import React, { useState } from 'react';
import { User, Phone, Mail, Briefcase, Wrench, FileText, Send, Loader2 } from 'lucide-react';

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    currentDesignation: '',
    position: '',
    skills: '',
    description: '',
    documents: null
  });

  const [focusedField, setFocusedField] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

    try {
      const resp = await axios.post(`${BASE_URL}add-career`, formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (resp) {
        toast.success(`Congratulations! Your application is submitted.`);
        setFormData({
          name: '',
          phoneNumber: '',
          email: '',
          currentDesignation: '',
          position: '',
          skills: '',
          description: '',
          resume: null
        });
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Failed to submit the application.`);
    }
  };

  const formFields = [
    { label: 'Full Name', name: 'name', icon: User, type: 'text' },
    { label: 'Phone Number', name: 'phoneNumber', icon: Phone, type: 'tel' },
    { label: 'Email Address', name: 'email', icon: Mail, type: 'email' },
    { label: 'Current Designation', name: 'currentDesignation', icon: Briefcase, type: 'text' },
    { label: 'Position Applied For', name: 'position', icon: Briefcase, type: 'text' },
    { label: 'Skills', name: 'skills', icon: Wrench, type: 'text' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 bg-orange-500 sm:px-10">
            <h1 className="text-3xl font-bold text-white text-center">Join Our Team</h1>
            <p className="mt-2 text-orange-100 text-center">Take the first step towards your next great opportunity</p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-6 py-8 sm:px-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formFields.map(({ label, name, icon: Icon, type }) => (
                <div key={name} className="relative">
                  <label 
                    className={`block text-sm font-medium transition-all duration-200 ${
                      focusedField === name ? 'text-orange-500' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${focusedField === name ? 'text-orange-500' : 'text-gray-500'}`} />
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
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Description
                </div>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onFocus={() => setFocusedField('description')}
                onBlur={() => setFocusedField('')}
                rows={4}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                placeholder="Tell us about yourself and why you're interested in this position"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Resume
                </div>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-orange-500 transition-colors duration-200">
                <div className="space-y-1 text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="documents" className="relative cursor-pointer bg-white rounded-md font-medium text-orange-500 hover:text-orange-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500">
                      <span>Upload a file</span>
                      <input
                        id="documents"
                        name="documents"
                        type="file"
                        className="sr-only"
                        onChange={handleChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC up to 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  flex items-center justify-center gap-2 px-8 py-3 border border-transparent text-base font-medium rounded-full
                  ${isSubmitting 
                    ? 'bg-orange-400 cursor-not-allowed' 
                    : 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700'
                  }
                  text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200
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
        </div>
      </div>
    </div>
  );
}

export default App;