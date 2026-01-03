'use client';

import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function UnifiedRequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    father_name: '',
    cnic_number: '',
    phone_number: '',
    family_members: '',
    monthly_income: '',
    home_type: '',
    marital_status: '',
    assistance_type: '',
    situation_description: '',
  });

  const [cnicFront, setCnicFront] = useState<File | null>(null);
  const [cnicBack, setCnicBack] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const cnicFrontRef = useRef<HTMLInputElement>(null);
  const cnicBackRef = useRef<HTMLInputElement>(null);
  const documentRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange =
    (setter: React.Dispatch<React.SetStateAction<File | null>>) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
          setter(e.target.files[0]);
        }
      };

  const resetForm = () => {
    setFormData({
      full_name: '',
      father_name: '',
      cnic_number: '',
      phone_number: '',
      family_members: '',
      monthly_income: '',
      home_type: '',
      marital_status: '',
      assistance_type: '',
      situation_description: '',
    });

    setCnicFront(null);
    setCnicBack(null);
    setDocument(null);

    if (cnicFrontRef.current) cnicFrontRef.current.value = '';
    if (cnicBackRef.current) cnicBackRef.current.value = '';
    if (documentRef.current) documentRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    if (cnicFront) form.append('cnic_front', cnicFront);
    if (cnicBack) form.append('cnic_back', cnicBack);
    if (document) form.append('document', document);

    try {
      await axios.post('/api/requests/submit', form);
      resetForm();
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Submission error:', error);
      alert('Something went wrong.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-8 bg-gradient-to-r from-green-100 to-green-50 border-l-4 border-green-500 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 p-4 rounded-full shadow-md">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-green-800 mb-2">Request Successfully Submitted</h2>
        <p className="text-green-700 text-lg">
          Thank you for your request. It has been received and is currently under review.
        </p>

        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 sm:p-10 bg-white rounded-3xl shadow-xl border border-gray-200 bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      <h2 className="text-3xl font-extrabold text-darkblue mb-6 text-center">Submit Your Request</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            placeholder="Full Name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          />

          <input
            type="text"
            name="father_name"
            value={formData.father_name}
            onChange={handleChange}
            required
            placeholder="Father/Husband Name"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          />

          <input
            type="text"
            name="cnic_number"
            value={formData.cnic_number}
            onChange={handleChange}
            required
            placeholder="CNIC Number"
            title="CNIC must be 13 digits"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          />

          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            placeholder="Phone Number"
            title="Phone number must be 11 digits and start with 03"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          />

          <input
            type="number"
            name="family_members"
            value={formData.family_members}
            onChange={handleChange}
            required
            placeholder="Family Members"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          />

          <input
            type="text"
            name="monthly_income"
            value={formData.monthly_income}
            onChange={handleChange}
            required
            placeholder="Monthly Income"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          />

          <select
            name="home_type"
            value={formData.home_type}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          >
            <option value="" disabled>
              Home Type
            </option>
            <option value="Own">Own</option>
            <option value="Rent">Rent</option>
            <option value="Relatives">Relatives</option>
          </select>

          <select
            name="marital_status"
            value={formData.marital_status}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          >
            <option value="" disabled>
              Marital Status
            </option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Widowed">Widowed</option>
            <option value="Divorced">Divorced</option>
          </select>

          <select
            name="assistance_type"
            value={formData.assistance_type}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition"
          >
            <option value="" disabled>
              Assistance Type
            </option>
            <option value="Loan">Loan</option>
            <option value="Aid">Aid</option>
            <option value="Microfinance">Microfinance</option>
            <option value="Education Support">Education Support</option>
            <option value="Medical Help">Medical Help</option>
            <option value="Marriage Support">Marriage Support</option>
            <option value="Business Startup Support">Business Startup Support</option>
            <option value="Home Renovation Support">Home Renovation Support</option>
            <option value="Widow Support">Widow Support</option>
            <option value="Orphan Support">Orphan Support</option>
            <option value="Food Assistance">Food Assistance</option>
            <option value="Emergency Relief">Emergency Relief</option>
            <option value="Skill Development Loan">Skill Development Loan</option>
            <option value="Agriculture Support">Agriculture Support</option>
            <option value="Utility Bill Support">Utility Bill Support</option>
            <option value="Transport Support">Transport Support</option>
          </select>
        </div>

        <textarea
          name="situation_description"
          value={formData.situation_description}
          onChange={handleChange}
          required
          placeholder="Your Situation (Short Description)"
          className="w-full rounded-xl border border-gray-300 px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00A5E0] focus:border-transparent transition resize-none"
        />

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">CNIC Front</label>
            <input
              ref={cnicFrontRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange(setCnicFront)}
              className="w-full text-sm text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">CNIC Back</label>
            <input
              ref={cnicBackRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange(setCnicBack)}
              className="w-full text-sm text-gray-600"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700 font-medium">Upload Applicant Image</label>
            <input
              ref={documentRef}
              type="file"
              onChange={handleFileChange(setDocument)}
              className="w-full text-sm text-gray-600"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-[#1B0073] to-[#00A5E0] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  );
}
