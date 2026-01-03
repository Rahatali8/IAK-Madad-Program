'use client';
import React, { useState } from 'react';
import { FaHandsHelping, FaFileAlt, FaLock, FaArrowCircleDown } from 'react-icons/fa';
import UnifiedRequestForm from '@/components/forms/UnifiedRequestForm';

export default function ApplyFormPage() {
  const [activeForm, setActiveForm] = useState('loan');

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold text-darkblue mb-4">Apply <span className="text-lightblue">For</span> Support</h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to request financial or social assistance.
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <FaFileAlt className="text-blue-500" />
              Please Read Before You Apply:
            </h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                Fill all the required fields carefully and honestly.
              </li>
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                Make sure your CNIC images and documents are clear and legible.
              </li>
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                False or incomplete information may delay or reject your request.
              </li>
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                All information will be kept <strong className="text-black">confidential</strong>.
              </li>
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                Only submit one application per assistance type to avoid disqualification.
              </li>
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                Double-check your CNIC number and contact details before submitting.
              </li>
              <li className="flex items-start gap-2">
                <FaArrowCircleDown className="text-green-500 mt-1" />
                You will receive updates once your request is reviewed by our team.
              </li>
            </ul>
          </div>

          {activeForm === 'loan' && <UnifiedRequestForm />}

          <div className="mt-10 border-t pt-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaHandsHelping className="text-purple-500" />
              Why Your Request Matters:
            </h2>
            <p className="text-gray-600 text-lg mb-4">
              Every application we receive is an opportunity to change someone’s life. Whether it's financial assistance,
              educational help, or medical support, your submission helps us identify those truly in need.
            </p>

            <div className="bg-blue-50 p-4 rounded-lg shadow-inner border border-blue-200">
              <p className="text-blue-700 font-medium">
                "Together, we’re building a stronger, more supportive community. Thank you for trusting us."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
