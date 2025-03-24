"use client";
import Logo from "@/components/logo";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import captcha from "../../../public/captcha.png";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useVerifyToken from "@/hook/useVerifyToken";
import ForgotPassword from "./forgotpassmodal.jsx"
export default function SignupPage() {
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_URL;

  useVerifyToken();
  const forgotPassword = async (email) => {
 
    try {
      const response = await fetch(`${url}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success(data?.message || "Password reset email sent. Check your inbox.");
    } catch (error) {
      console.error("Forgot Password Error:", error.message);
      alert(error.message);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#ffffff] flex">
      <div className="w-full mb-10">
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

        <div className="w-full mx-auto mt-10 max-w-[584px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#131A45]">
              Welcome Back, Rimcollian!
            </h2>
            <p className="text-gray-500 mt-2 max-w-[374px] mx-auto">
              Log in to reconnect and access alumni resources.
            </p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
              password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
            })}
            onSubmit={async (values, { setSubmitting }) => {
              console.log(values);
              console.log(typeof values.password);
             
              try {
                const response = await fetch(`${url}/api/auth/login`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                });
                const data = await response.json();
                if (response.ok) {
                  toast.success(data.message || "Login success");
                  localStorage.setItem(
                    "alumni",
                    JSON.stringify({ token: data.token, user: data.user })
                  );

                  router.push("/alumni/homepage");
                } else {
                  toast.error(data.message || "Login failed");
                }
              } catch (error) {
                console.log(error);
                toast.error("An error occurred. Please try again.");
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-4 max-w-[400px] px-2 mx-auto">
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

                <div className="relative">
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
                {/* 
              <div className="flex justify-center">
                <Image src={captcha} alt="captcha" />
              </div> */}
                
               
                <ForgotPassword />
                <div className="w-full flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-[143px] bg-[#131A45] text-white py-3 rounded-xl font-semibold hover:bg-[#1a2154]"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center text-[#000000]">
            <p className="text-sm">
              New User?{" "}
              <Link href="/signup" className="font-semibold underline">
                Register Now
              </Link>
            </p>
            {/* <button className="border mt-3 border-[#C7A006] rounded-lg w-36 p-1">
              Need Help?
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
