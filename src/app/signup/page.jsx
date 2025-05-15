"use client";

import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useVerifyToken from "@/hook/useVerifyToken";

export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();

  useEffect(() => {
    // Fetch countries from the REST Countries API
    const fetchCountries = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,idd");
        const data = await response.json();

        // Format the data to get country names and dial codes
        const formattedCountries = data
          .filter(country => country.idd && country.idd.root) // Filter out countries without dial codes
          .map(country => ({
            // Ensure unique key by combining country name and dial code
            id: `${country.name.common}-${country.idd.root}${country.idd.suffixes && country.idd.suffixes[0] ? country.idd.suffixes[0] : ""}`,
            code: country.name.common.slice(0, 2).toUpperCase(),
            name: country.name.common,
            dialCode: country.idd.root + (country.idd.suffixes && country.idd.suffixes[0] ? country.idd.suffixes[0] : "")
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        setCountries(formattedCountries);
        setFilteredCountries(formattedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
        // Fallback to some common country codes if API fails
        const fallbackCountries = [
          { id: "IN-91", code: "IN", name: "India", dialCode: "+91" },
          { id: "US-1", code: "US", name: "United States", dialCode: "+1" },
          { id: "GB-44", code: "GB", name: "United Kingdom", dialCode: "+44" },
          { id: "CA-1", code: "CA", name: "Canada", dialCode: "+1" },
          { id: "AU-61", code: "AU", name: "Australia", dialCode: "+61" },
          { id: "DE-49", code: "DE", name: "Germany", dialCode: "+49" },
          { id: "FR-33", code: "FR", name: "France", dialCode: "+33" },
        ];
        setCountries(fallbackCountries);
        setFilteredCountries(fallbackCountries);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Function to handle searching in the dropdown
  const filterCountries = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCountries(countries);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(term) ||
      country.dialCode.includes(term)
    );
    setFilteredCountries(filtered);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      // Reset search when opening dropdown
      setSearchQuery("");
      setFilteredCountries(countries);
    }
  };

  const selectCountryCode = (dialCode) => {
    setSelectedCountryCode(dialCode);
    setDropdownOpen(false);
  };

  // Update the validation schema with better mobile number validation
  const validationSchema = Yup.object({
    collegeNo: Yup.string().required("College No. is required"),
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: Yup.string()
      .matches(/^\d+$/, "Mobile Number should contain only digits")
      .min(5, "Mobile Number is too short")
      .max(15, "Mobile Number is too long")
      .required("Mobile Number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /(?=.*[a-z])(?=.*[A-Z])/,
        "Password must contain at least one uppercase and one lowercase letter"
      )
      .matches(/(?=.*[0-9])/, "Password must contain at least one number")
      .matches(
        /(?=.*[!@#$%^&*])/,
        "Password must contain at least one special character (!@#$%^&*)"
      )
      .required("Password is required"),
  });

  useVerifyToken();

  return (
    <div className="min-h-screen bg-[#ffffff] flex">
      <div className="w-full">
        <div className="relative">
          <div className="w-full h-64">
            <Image
              src="/topimg.png"
              alt="Hero Image"
              layout="fill"
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex justify-center -mb-8">
            <Logo textwhite={false} />
          </div>
        </div>

        <div className="w-full mx-auto my-10 max-w-[584px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#131A45]">
              Alumni Network Registration
            </h2>
            <p className="text-gray-500 mt-2 max-w-[374px] mx-auto">
              Reconnect, explore opportunities, and join our alumni community.
              Register now!
            </p>
          </div>

          <Formik
            initialValues={{
              collegeNo: "",
              name: "",
              email: "",
              mobileNumber: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                // Include countryCode separately in the form data
                const formData = {
                  ...values,
                  countryCode: selectedCountryCode,
                };

                const response = await fetch(`${url}/api/auth/register`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(formData),
                });
                const data = await response.json();

                if (response.ok) {
                  toast.success(data.message || "Registration successful!");

                  localStorage.setItem(
                    "alumni",
                    JSON.stringify({ token: data.token, user: data.user })
                  );
                  router.push("/otp");
                } else {
                  toast.error(data.message || "Registration failed");
                }
              } catch (error) {
                toast.error("An error occurred. Please try again.");
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values, errors, touched, isValid, dirty }) => (
              <Form className="mt-8 space-y-4 mx-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Field
                      type="text"
                      name="collegeNo"
                      placeholder="College No. eg. 1407PS0262"
                      className="custom-input text-black w-full"
                    />
                    <ErrorMessage
                      name="collegeNo"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <Field
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="custom-input text-black w-full"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Field
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className="custom-input text-black w-full"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="relative">
                      <div className="flex items-stretch">
                        <div
                          className="inline-flex items-center px-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-l-md h-[50px]"
                        >
                          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                            <span>{selectedCountryCode}</span>
                            <Icon icon="mdi:chevron-down" className="ml-1" width="16" height="16" />
                          </div>

                          {dropdownOpen && (
                            <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto w-64 border border-gray-300 left-0 top-full">
                              <div className="sticky top-0 bg-white border-b border-gray-300 p-2">
                                <input
                                  type="text"
                                  placeholder="Search countries..."
                                  className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none"
                                  autoFocus
                                  value={searchQuery}
                                  onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    filterCountries(e.target.value);
                                  }}
                                />
                              </div>
                              {isLoading ? (
                                <div className="flex justify-center items-center p-4">
                                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                              ) : filteredCountries.length > 0 ? (
                                filteredCountries.map((country) => (
                                  <div
                                    key={country.id}
                                    className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 cursor-pointer"
                                    onClick={() => selectCountryCode(country.dialCode)}
                                  >
                                    <span className="mr-2">{country.name}</span>
                                    <span className="text-gray-500 ml-auto">{country.dialCode}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="px-4 py-2 text-sm text-center text-gray-500">
                                  No countries found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          name="mobileNumber"
                          placeholder="9876541235"
                          className="text-black w-full h-[50px] border border-gray-300 focus:ring-2 focus:ring-gray-300 focus:outline-none rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none"
                          value={values.mobileNumber}
                          onChange={(e) => setFieldValue('mobileNumber', e.target.value)}
                        />
                      </div>
                      <ErrorMessage
                        name="mobileNumber"
                        component="p"
                        className="text-red-500 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative">
                    <Field name="password">
                      {({ field, form }) => (
                        <div className="relative">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            {...field}
                            placeholder="*************"
                            className="custom-input text-black w-full"
                            onFocus={() => setPasswordFocused(true)}
                          />
                          <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-0 bottom-0 flex items-center justify-center text-gray-500"
                            style={{ height: '40px' }}
                          >
                            {passwordVisible ? (
                              <Icon icon="uiw:eye-o" width="16" height="16" />
                            ) : (
                              <Icon icon="rivet-icons:eye-off" width="16" height="16" />
                            )}
                          </button>

                          <div className={`mt-2 text-xs bg-gray-50 p-3 rounded border border-gray-200 transition-all duration-300 ${passwordFocused ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                            <ul className="space-y-2">
                              <li className={`flex items-center transition-colors duration-200 ${field.value && field.value.length >= 8 ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                <div className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${field.value && field.value.length >= 8 ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  {field.value && field.value.length >= 8 ? (
                                    <Icon icon="mdi:check" className="text-green-600" width="14" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                  )}
                                </div>
                                At least 8 characters
                              </li>
                              <li className={`flex items-center transition-colors duration-200 ${field.value && /[A-Z]/.test(field.value) && /[a-z]/.test(field.value) ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                <div className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${field.value && /[A-Z]/.test(field.value) && /[a-z]/.test(field.value) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  {field.value && /[A-Z]/.test(field.value) && /[a-z]/.test(field.value) ? (
                                    <Icon icon="mdi:check" className="text-green-600" width="14" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                  )}
                                </div>
                                Uppercase and lowercase letters
                              </li>
                              <li className={`flex items-center transition-colors duration-200 ${field.value && /[0-9]/.test(field.value) ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                <div className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${field.value && /[0-9]/.test(field.value) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  {field.value && /[0-9]/.test(field.value) ? (
                                    <Icon icon="mdi:check" className="text-green-600" width="14" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                  )}
                                </div>
                                At least one number
                              </li>
                              <li className={`flex items-center transition-colors duration-200 ${field.value && /[!@#$%^&*]/.test(field.value) ? 'text-green-600 font-medium' : 'text-gray-600'}`}>
                                <div className={`mr-2 flex items-center justify-center w-5 h-5 rounded-full ${field.value && /[!@#$%^&*]/.test(field.value) ? 'bg-green-100' : 'bg-gray-100'}`}>
                                  {field.value && /[!@#$%^&*]/.test(field.value) ? (
                                    <Icon icon="mdi:check" className="text-green-600" width="14" />
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                  )}
                                </div>
                                At least one special character (!@#$%^&*)
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </Field>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-[143px] bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
                    onClick={(e) => {
                      // If the form is invalid (has empty fields), show toast and prevent submission
                      if (!isValid || !dirty) {
                        e.preventDefault();

                        // Check which fields are empty and create a message
                        const emptyFields = [];
                        if (!values.collegeNo) emptyFields.push("College No");
                        if (!values.name) emptyFields.push("Full Name");
                        if (!values.email) emptyFields.push("Email");
                        if (!values.mobileNumber) emptyFields.push("Mobile Number");
                        if (!values.password) emptyFields.push("Password");

                        // Create a message based on empty fields
                        let message = "Please fill all required fields";
                        if (emptyFields.length > 0) {
                          message = `Please fill the following fields: ${emptyFields.join(", ")}`;
                        }

                        toast.error(message);
                      }
                    }}
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center text-[#000000]">
            <p className="text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}