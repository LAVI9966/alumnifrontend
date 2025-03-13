"use client";

import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validationSchema = Yup.object({
    collegeNo: Yup.string().required("College No. is required"),
    // .matches(/^\d{4}[A-Za-z]{2}\d{4}$/, "Invalid College No. format")
    // .required("College No. is required"),
    name: Yup.string().required("Full Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile Number number must be 10 digits")
      .required("Mobile Number number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

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
              Join the Rimcollian Alumni Network
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
                const response = await fetch(`${url}/api/auth/register`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
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
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-4 mx-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <Field
                      type="text"
                      name="collegeNo"
                      placeholder="College No. eg. 1407PS0262"
                      className="custom-input w-full"
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
                      className="custom-input w-full"
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
                      className="custom-input w-full"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <Field
                      type="tel"
                      name="mobileNumber"
                      placeholder="9876541235"
                      className="custom-input w-full"
                    />
                    <ErrorMessage
                      name="mobileNumber"
                      component="p"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="relative ">
                  <Field
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    placeholder="*************"
                    className="custom-input w-full"
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
