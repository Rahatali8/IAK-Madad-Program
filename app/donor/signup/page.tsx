"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Eye, EyeOff, Heart, FileText } from "lucide-react";
import Link from "next/link";

export default function DonorSignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    organization_name: "",
    contact_number: "",
    email: "",
    cnic: "",
    password: "",
    confirmPassword: "",
    securityQuestion: "",
    securityAnswer: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "contact_number") {
      if (value.length > 11) return;
    }
    if (name === "cnic") {
      if (value.length > 13) return;
    }
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/donor/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#1e3a8a] mb-4">Signup Successful!</h2>
              <p className="text-gray-600 mb-6">
                Welcome to Khair Welfare! Your donor account has been created successfully.
              </p>
              <Button className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]" asChild>
                <Link href="/donor/login">Login Now</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1e3a8a] rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#1e3a8a]">Donor Signup</h2>
          <p className="mt-2 text-gray-600">Become a part of our mission by signing up as a donor</p>
        </div>

        {/* Info Card */}
        <Card className="mb-8 border-0 shadow-md bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-darkblue text-lg">
              <FileText className="w-5 h-5 text-lightblue" />
              Please Read Before Signing Up
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-darkblue text-sm">
            <p className="flex items-center gap-2">
              <CheckCircle className="text-green-600 w-4 h-4 flex-shrink-0" />
              Please ensure your CNIC and Email are correct. Duplicate entries will be rejected.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="text-green-600 w-4 h-4 flex-shrink-0" />
              All data is treated confidentially and stored securely.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="text-green-600 w-4 h-4 flex-shrink-0" />
              Avoid using fake information — we verify submissions.
            </p>
            <p className="flex items-center gap-2">
              <CheckCircle className="text-green-600 w-4 h-4 flex-shrink-0" />
              Submitting the form doesn't guarantee acceptance.
            </p>
          </CardContent>
        </Card>

        {/* Form Card */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-[#1e3a8a]">Create Donor Account</CardTitle>
            <CardDescription className="text-center">Fill in your information to get started</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input name="name" type="text" placeholder="Full Name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization_name">Organization Name *</Label>
                  <Input name="organization_name" type="text" placeholder="Organization Name" value={form.organization_name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_number">Contact Number</Label>
                  <Input name="contact_number" type="text" placeholder="Contact Number" value={form.contact_number} onChange={handleChange} maxLength={11} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnic">CNIC *</Label>
                  <Input name="cnic" type="text" placeholder="CNIC Number" value={form.cnic} onChange={handleChange} required maxLength={13} />
                </div>

                {/* Security Question Section (moved below CNIC) */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="securityQuestion">Security Question *</Label>
                  <select
                    name="securityQuestion"
                    id="securityQuestion"
                    value={form.securityQuestion}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select a question</option>
                    <option value="donation-city">In which city did you make your first donation?</option>
                    <option value="primary-school">What is your primary school name?</option>
                    <option value="fav-organization">What is your favorite Organization?</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="securityAnswer">Your Answer *</Label>
                  <Input
                    name="securityAnswer"
                    type="text"
                    placeholder="One word answer only"
                    value={form.securityAnswer}
                    onChange={handleChange}
                    required
                    pattern="^\w+$"
                    title="Please enter only one word (letters or numbers, no spaces)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      className="pr-10"
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      className="pr-10"
                    />
                    <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (

                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Commitment Checkbox (UI only, not sent to backend) */}
              <div className="flex items-center gap-2 mt-2 mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                <input
                  type="checkbox"
                  id="donor-commitment"
                  className="accent-blue-600 w-4 h-4"
                  required
                />
                <label htmlFor="donor-commitment" className="text-sm text-gray-700 select-none">
                  I understand and agree that by signing up, I am committing to serve as a donor for Khair Welfare for as long as I am able. <span className="text-gray-500">(This is a deterrent only, not legally binding.)</span>
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#1e3a8a] hover:bg-[#1e40af]" disabled={loading}>
                {loading ? "Signing up..." : "Signup"}
              </Button>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#1e3a8a] hover:text-[#1e40af] font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
