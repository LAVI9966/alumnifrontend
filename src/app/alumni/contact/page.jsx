"use client";

import React, { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";
import { useTheme } from "@/context/ThemeProvider";

const ContactForm = () => {
  const initialValues = {
    name: "",
    subject: "",
    email: "",
    message: "",
    department: "", // New field for department selection
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full Name is required"),
    subject: Yup.string().required("Subject is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    message: Yup.string().required("Message is required"),
    department: Yup.string().required("Department is required"), // Validation for department
  });

  // Departments list - you can change these as needed
  const departments = [
    { id: "ROBA_Office", name: "ROBA Office" },
  ];

  const url = process.env.NEXT_PUBLIC_URL;

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const token = await gettoken();
      const response = await fetch(`${url}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Message sent successfully!");
        resetForm();
      } else {
        toast.error(data.message || "Something went wrong");
        setSubmitting(false);
      }
    } catch (error) {
      toast.error("Network error, please try again later.");
      setSubmitting(false);
    } finally {
      setSubmitting(false);
    }
  };

  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`} >
      <div className="min-h-screen flex justify-center items-center relative">
        <div
          className="absolute top-0 left-0 w-full h-[160px] md:h-[288px] bg-cover bg-center"
          style={{ backgroundImage: 'url("/about/pic1.png")' }}
        ></div>

        <div className={`w-full max-w-4xl p-8 ${isDark ? 'bg-[#2A3057]' : 'bg-white text-custom-blue'} shadow-lg rounded-2xl z-10 mt-20 m-4`}>
          <div className="mb-8">
            <h2 className="font-bold text-3xl tracking-[-0.02em] ">
              Feel free to get in touch with us!
            </h2>
            <p className="text-[#797979] mt-4">
              If you have any questions, feedback, or need assistance, feel free
              to reach out using the form below.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* New Department dropdown */}
                <div className="col-span-2">
                  <Field
                    as="select"
                    name="department"
                    className={`w-full ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} custom-input`}
                  >
                    <option value="" disabled>Select a department to contact</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="department"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <Field
                    type="text"
                    name="name"
                    className={`w-full ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} custom-input`}
                    placeholder="Enter your full name"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="col-span-2 md:col-span-1">
                  <Field
                    type="text"
                    name="subject"
                    className={`w-full ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} custom-input`}
                    placeholder="Enter the subject"
                  />
                  <ErrorMessage
                    name="subject"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Field
                    type="email"
                    name="email"
                    className={`w-full ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} custom-input`}
                    placeholder="Enter your email address"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="col-span-2">
                  <Field
                    as="textarea"
                    name="message"
                    rows="4"
                    className={`w-full ${isDark ? 'border-[#3D437E] bg-[#2A3057] text-white placeholder-gray-400' : 'border-gray-300 bg-white text-[#131A45]'} custom-input`}
                    placeholder="Write your message here..."
                  />
                  <ErrorMessage
                    name="message"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div className="col-span-2 flex justify-center">
                  <button
                    type="submit"
                    className="bg-[#131A45] hover:bg-[#1a2154] text-white text-sm font-bold py-3 w-[150px] px-10 rounded-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;