"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import Logo from "@/components/logo";
import Image from "next/image";
import Link from "next/link";
import ForgotPassword from "../login/forgotpassmodal";

const ResetPassword = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [token, setToken] = useState(null);
  const router = useRouter();

  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);

      setToken(params.get("token"));
    }
  }, []);
  const validationSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("New password is required"),
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${url}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: values.newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      toast.success("Password reset successful. You can now log in.");
      router.push("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
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
              Reset Password to reconnect and access alumni resources.
            </p>
          </div>

          <Formik
            initialValues={{ newPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="mt-8 space-y-4 max-w-[400px] px-2 mx-auto">
                <div className="relative">
                  <Field
                    type="password"
                    name="newPassword"
                    placeholder="New Password"
                    className="custom-input w-full"
                  />

                  <ErrorMessage
                    name="newPassword"
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
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center text-[#000000]">
            <ForgotPassword text="Resend password reset link" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
