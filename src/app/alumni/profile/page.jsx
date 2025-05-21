"use client";

import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import { useTheme } from "@/context/ThemeProvider";

const ProfilePage = () => {
  const [initialValues, setinitialValues] = useState({
    collegeNo: "",
    email: "",
    mobileNumber: "",
    name: "",
    profilePicture: "",
  });
  // Add state variables for country code dropdown
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [image, setImage] = useState(null);
  const [uploadimage, setUploadimage] = useState(null);
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  useEffect(() => {
    getProfile();
    fetchCountries(); // Fetch countries when component mounts
  }, []);

  // Function to fetch countries
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

  const getProfile = async () => {
    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(`${url}/api/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const userData = data.user;

        // Set the country code from the user data
        if (userData.countryCode) {
          setSelectedCountryCode(userData.countryCode);
        }

        setinitialValues(userData);

        // Handle profile picture URL for both local and hosted environments
        if (userData.profilePicture) {
          // First, try to extract the filename regardless of path format
          let filename;
          if (userData.profilePicture.includes('\\')) {
            // Windows-style path
            filename = userData.profilePicture.split('\\').pop();
          } else if (userData.profilePicture.includes('/')) {
            // Unix-style path
            filename = userData.profilePicture.split('/').pop();
          } else {
            // Already just a filename
            filename = userData.profilePicture;
          }

          console.log("Profile picture filename:", filename);
          const profilePicUrl = `${url}/uploads/${filename}`;
          console.log("Full profile picture URL:", profilePicUrl);
          setImage(profilePicUrl);
        } else {
          setImage("/default-profile.png");
        }
      } else {
        toast.error(data?.message || "Failed to fetch profile data.");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Logout function: remove token and redirect to login
  const handleLogout = () => {
    localStorage.removeItem("alumni");
    router.push("/login");
  };

  // Form validation schema
  const validationSchema = Yup.object().shape({
    collegeNo: Yup.string().required("College No. is required"),
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: Yup.string()
      .matches(/^\d+$/, "Mobile Number should contain only digits")
      .min(5, "Mobile Number is too short")
      .max(15, "Mobile Number is too long")
      .required("Mobile Number is required"),
  });

  // Form submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Remove profilePicture from values as we're not updating it here
      const { profilePicture, ...updateValues } = values;

      // Create a new object with the form values plus country code
      const updatedValues = {
        ...updateValues,
        countryCode: selectedCountryCode,
      };

      const token = await gettoken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      const response = await fetch(`${url}/api/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedValues),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Profile updated successfully!");
        getProfile(); // Refresh profile data
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Network error, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed");
        return;
      }

      setUploadimage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Automatically upload the image after selecting it
      await handleSaveProfilePicWithFile(file);
    }
  };

  // Function to handle camera icon click
  const handleCameraIconClick = () => {
    // If image exists, handle delete
    if (image && image !== "/default-profile.png") {
      setImage(null);
      setUploadimage(null);
    } else {
      // Otherwise trigger file input click
      fileInputRef.current.click();
    }
  };

  // Modified version of handleSaveProfilepic that takes a file parameter
  const handleSaveProfilePicWithFile = async (file) => {
    if (!file) {
      toast.error("Please select an image first.");
      return;
    }

    try {
      const token = await gettoken();
      if (!token) {
        toast.error("Authentication token not found. Please login again.");
        router.push("/login");
        return;
      }

      const formData = new FormData();
      formData.append("profilePicture", file);

      const loadingToast = toast.loading("Uploading profile picture...");

      const response = await fetch(
        `${url}/api/profile/upload-profile-picture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      toast.dismiss(loadingToast);

      if (response.ok) {
        const responseData = await response.json();
        console.log("Upload response:", responseData);
        toast.success("Profile picture uploaded successfully");

        // Instead of immediately calling getProfile, directly update the image URL
        // This ensures we use the exact URL path returned from the server
        if (responseData.filename) {
          const profilePicUrl = `${url}/uploads/${responseData.filename}`;
          console.log("Setting new profile pic URL:", profilePicUrl);
          setImage(profilePicUrl);

          // Update initialValues to include the new profile picture
          setinitialValues(prev => ({
            ...prev,
            profilePicture: responseData.filename
          }));
        } else {
          // Fallback to getting the full profile
          getProfile();
        }
      } else {
        const data = await response.json();
        toast.error(data?.message || "Failed to upload profile picture");
      }
    } catch (error) {
      toast.dismiss();
      console.error("Error uploading profile picture:", error);
      toast.error("Failed to upload profile picture. Please try again.");
    }
  };

  // Original function kept for the Save button
  const handleSaveProfilepic = async () => {
    if (!uploadimage) {
      toast.error("Please select an image first.");
      return;
    }

    await handleSaveProfilePicWithFile(uploadimage);
  };

  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

  // Handle clicking outside of dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.country-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-[#131A45] text-white' : 'bg-[#F2F2F2] text-[#131A45]'}`}>
      <div className={`min-h-screen pt-2 px-4 sm:p-4`}>
        <div className={`w-full ${isDark ? 'bg-[#2A3057]' : 'bg-white'} py-6 lg:p-8 rounded-lg mx-auto my-2 lg:my-8 max-w-[800px] shadow-lg`}>
          <div>
            {/* Profile Image Upload */}
            <div className="relative m-auto w-40 h-40">
              <label className={`w-full h-full rounded-full border-2 ${isDark ? 'border-[#C7A006]' : 'border-[#C7A006]'} flex items-center justify-center cursor-pointer overflow-hidden`}>
                {image ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      console.error("Image failed to load:", e.target.src);
                      // Fallback to default image on error
                      e.target.src = "/default-profile.png";
                    }}
                  />
                ) : (
                  <Icon icon="mynaui:user-solid" width="80%" height="80%" />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
              <div
                className="absolute bottom-2 right-2 bg-[#C7A006] p-2 rounded-full cursor-pointer hover:bg-yellow-600 transition-colors"
                onClick={handleCameraIconClick}
              >
                {image && image !== "/default-profile.png" ? (
                  <Icon
                    icon="material-symbols:delete-outline"
                    width="24"
                    height="24"
                    className="text-[#131A45]"
                  />
                ) : (
                  <Icon
                    icon="typcn:camera"
                    width="24"
                    height="24"
                    className="text-[#131A45]"
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={handleSaveProfilepic}
                disabled={!uploadimage}
                className={`w-[70px] m-auto ${isDark ? 'bg-[#C7A006] text-[#131A45]' : 'bg-[#131A45] text-white'} py-2 rounded-xl font-semibold transition-all ${uploadimage ? 'hover:bg-[#1a2154]' : 'opacity-50 cursor-not-allowed'}`}
              >
                Save
              </button>
            </div>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="mt-8 space-y-4 mx-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Field
                      type="text"
                      name="collegeNo"
                      placeholder="College No. eg. 1407PS0262"
                      className={`custom-input w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none`}
                      disabled
                    />
                    <ErrorMessage
                      name="collegeNo"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Field
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className={`custom-input text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C7A006] focus:outline-none`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Field
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      className={`custom-input w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none`}
                      disabled
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="relative country-dropdown">
                      <div className="flex items-stretch">
                        <div
                          className={`inline-flex items-center px-3 ${isDark ? 'text-white bg-[#1E2545]' : 'text-gray-700 bg-gray-50'} border border-gray-300 rounded-l-md h-[50px]`}
                        >
                          <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                            <span>{selectedCountryCode}</span>
                            <Icon icon="mdi:chevron-down" className="ml-1" width="16" height="16" />
                          </div>

                          {dropdownOpen && (
                            <div className={`absolute z-10 mt-1 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white text-black'} shadow-lg rounded-md max-h-60 overflow-y-auto w-64 border border-gray-300 left-0 top-full`}>
                              <div className={`sticky top-0 ${isDark ? 'bg-[#2A3057]' : 'bg-white'} border-b border-gray-300 p-2`}>
                                <input
                                  type="text"
                                  placeholder="Search countries..."
                                  className={`w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none ${isDark ? 'bg-[#1E2545] text-white' : 'bg-white text-black'}`}
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
                                    className={`flex items-center w-full px-4 py-2 text-sm text-left ${isDark ? 'hover:bg-[#1E2545]' : 'hover:bg-gray-100'} cursor-pointer`}
                                    onClick={() => selectCountryCode(country.dialCode)}
                                  >
                                    <span className="mr-2">{country.name}</span>
                                    <span className={`${isDark ? 'text-gray-300' : 'text-gray-500'} ml-auto`}>{country.dialCode}</span>
                                  </div>
                                ))
                              ) : (
                                <div className={`px-4 py-2 text-sm text-center ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                  No countries found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <input
                          type="tel"
                          name="mobileNumber"
                          placeholder="Mobile Number"
                          className={`text-black w-full h-[50px] border border-gray-300 focus:ring-2 focus:ring-[#C7A006] focus:outline-none rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none`}
                          value={values.mobileNumber}
                          onChange={(e) => setFieldValue('mobileNumber', e.target.value)}
                        />
                      </div>
                      <ErrorMessage
                        name="mobileNumber"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-center mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-[143px] ${isDark ? 'bg-[#C7A006] text-[#131A45]' : 'bg-[#131A45] text-white'} py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="w-full flex justify-center mt-4">
            <button
              onClick={handleLogout}
              className={`w-[143px] mt-3 ${isDark ? 'text-white' : 'text-[#131A45]'} border border-[#C7A006] py-2 rounded-xl font-semibold hover:bg-[#C7A006] hover:bg-opacity-10 transition-all`}
            >
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;