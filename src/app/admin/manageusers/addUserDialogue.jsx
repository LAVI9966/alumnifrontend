'use client'
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useTheme } from "@/context/ThemeProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import gettoken from "@/app/function/gettoken";
import toast from "react-hot-toast";

const AddUser = ({
  getUser,
  collegeNo,
  name,
  email,
  mobileNumber,
  role,
  countryCode,
  id,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(countryCode || "+91");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

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

  const validationSchema = Yup.object().shape({
    collegeNo: Yup.string().required("College Number is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobileNumber: Yup.string()
      .matches(/^\d+$/, "Mobile Number should contain only digits")
      .min(5, "Mobile number is too short")
      .max(15, "Mobile number is too long")
      .required("Mobile Number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().oneOf(["user", "admin"], "Invalid role").default("user"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);

    try {
      // Include the country code in the values
      const submissionValues = {
        ...values,
        countryCode: selectedCountryCode
      };

      const token = await gettoken();
      const apiurl = id ? `${url}/api/members/${id}` : `${url}/api/members`;
      const response = await fetch(apiurl, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionValues),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          data?.message || `User ${id ? "update" : "added"} successfully!`
        );
        getUser();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Network error, please try again later.");
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        {id ? (
          <button className={`underline ${isDark ? 'text-white' : 'text-blue-600'}`}>Edit</button>
        ) : (
          <Button className={`${isDark ? 'bg-[#3A4070]' : 'bg-custom-blue'} text-white rounded-xl hover:bg-[#04061c]`}>
            <Icon icon="basil:plus-outline" width="24" height="24" />
            Add New User
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className={`max-w-2xl ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'}`}>
        <AlertDialogHeader>
          <AlertDialogTitle className={isDark ? 'text-white' : 'text-black'}>Add New User</AlertDialogTitle>
          <AlertDialogDescription className={isDark ? 'text-gray-300' : 'text-gray-500'}>
            Fill in the details below:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Formik
          initialValues={{
            collegeNo: collegeNo || "",
            name: name || "",
            email: email || "",
            mobileNumber: mobileNumber || "",
            password: "",
            role: role || "user",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="grid lg:grid-cols-2 gap-2">
              <div>
                <Field
                  type="text"
                  name="collegeNo"
                  placeholder="College Number"
                  className={`custom-input w-full admin-input ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-white text-black'}`}
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
                  className={`custom-input w-full admin-input ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-white text-black'}`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`custom-input w-full admin-input ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-white text-black'}`}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <div className="relative">
                  <div className="flex items-stretch">
                    <div
                      className={`inline-flex items-center px-3 border border-gray-300 rounded-l-md h-[50px] ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-gray-50 text-gray-700'
                        }`}
                    >
                      <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                        <span>{selectedCountryCode}</span>
                        <Icon icon="mdi:chevron-down" className="ml-1" width="16" height="16" />
                      </div>

                      {dropdownOpen && (
                        <div className={`absolute z-10 mt-1 shadow-lg rounded-md max-h-60 overflow-y-auto w-64 border border-gray-300 left-0 top-full ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-white'
                          }`}>
                          <div className={`sticky top-0 border-b border-gray-300 p-2 ${isDark ? 'bg-[#3A4070]' : 'bg-white'
                            }`}>
                            <input
                              type="text"
                              placeholder="Search countries..."
                              className={`w-full px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none ${isDark ? 'bg-[#2A3057] text-white border-gray-700' : 'bg-white text-black'
                                }`}
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
                                className={`flex items-center w-full px-4 py-2 text-sm text-left cursor-pointer ${isDark ? 'hover:bg-[#2A3057]' : 'hover:bg-gray-100'
                                  }`}
                                onClick={() => selectCountryCode(country.dialCode)}
                              >
                                <span className="mr-2">{country.name}</span>
                                <span className={`ml-auto ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{country.dialCode}</span>
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
                    <Field
                      type="tel"
                      name="mobileNumber"
                      placeholder="9876541235"
                      className={`w-full h-[50px] border border-gray-300 focus:ring-2 focus:outline-none rounded-tr-md rounded-br-md rounded-tl-none rounded-bl-none ${isDark ? 'bg-[#3A4070] text-white border-gray-700 focus:ring-gray-600' : 'bg-white text-black focus:ring-gray-300'
                        }`}
                    />
                  </div>
                  <ErrorMessage
                    name="mobileNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`custom-input w-full admin-input ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-white text-black'}`}
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  as="select"
                  name="role"
                  className={`custom-input w-full admin-input ${isDark ? 'bg-[#3A4070] text-white border-gray-700' : 'bg-white text-black'}`}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Field>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div></div>

              <div className="flex justify-end gap-4 mt-4">
                <AlertDialogCancel className={isDark ? 'bg-gray-700 text-white hover:bg-gray-600' : ''}>Cancel</AlertDialogCancel>
                <button
                  type="submit"
                  className={`${isDark ? 'bg-[#3A4070]' : 'bg-[#131A45]'} text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#1a2154]`}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : id
                      ? "Update User"
                      : "Add User"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddUser;