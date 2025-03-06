"use client";

import { Icon } from "@iconify/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";

const ProfilePage = () => {
  const [initialValues, setinitialValues] = useState({
    collegeNo: "",
    email: "",
    mobileNumber: "",
    name: "",
  });
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    const getProfile = async () => {
      try {
        const token = await gettoken();
        const response = await fetch(`${url}/api/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token in headers
          },
        });

        const data = await response.json();

        if (response.ok) {
          setinitialValues(data.user);
        } else {
          toast.error(data?.message || "failed.");
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred. Please try again.");
      }
    };
    getProfile();
  }, []);
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
      .matches(/^[0-9]{10}$/, "Mobile Number number must be 10 digits")
      .required("Mobile Number number is required"),
  });

  // Form submit handler
  const handleSubmit = async (values, { setSubmitting }) => {
    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
      router.push("/signup");
      return;
    }

    try {
      const { token } = JSON.parse(storedData);
      const response = await fetch(`${url}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      alert("Network error, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-2 px-4 sm:p-4">
      <div className="w-full bg-white py-6 lg:p-8 rounded-lg mx-auto my-2 lg:my-8 max-w-[800px]">
        <div>
          <div className="m-auto relative w-40 h-40">
            <div className="w-full h-full rounded-full border-2 border-[#C7A006] flex items-center justify-center">
              <Icon icon="mynaui:user-solid" width="80%" height="80%" />
            </div>
            <div className="absolute bottom-2 right-2 bg-[#C7A006] p-2 rounded-full cursor-pointer">
              <Icon icon="typcn:camera" width="24" height="24" />
            </div>
          </div>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-4 mx-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Field
                    type="text"
                    name="collegeNo"
                    placeholder="College No. eg. 1407PS0262"
                    className="custom-input w-full"
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
                    className="custom-input w-full"
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
                    className="custom-input w-full"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
                <div>
                  <Field
                    type="tel"
                    name="mobileNumber"
                    placeholder="9876541235"
                    className="custom-input w-full"
                  />
                  <ErrorMessage
                    name="mobileNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div className="w-full flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-[143px] bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="w-full flex justify-center">
          <button
            onClick={handleLogout}
            className="w-[143px] mt-3 border border-[#C7A006] text-[#131A45] py-2 rounded-xl font-semibold"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

{
  /* <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="*************"
              className="custom-input  w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-0 bottom-0 text-gray-500"
            >
              {passwordVisible ? (
                <Icon icon="uiw:eye-o" width="16" height="16" />
              ) : (
                <Icon icon="rivet-icons:eye-off" width="16" height="16" />
              )}
            </button>
          </div> */
}
