'use client'
import { useState } from "react";
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
  id,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  const validationSchema = Yup.object().shape({
    collegeNo: Yup.string().required("College Number is required"),
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
      .required("Mobile Number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string().oneOf(["user", "admin"], "Invalid role").default("user"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);

    try {
      const token = await gettoken();
      const apiurl = id ? `${url}/api/members/${id}` : `${url}/api/members`;
      const response = await fetch(apiurl, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
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
          <button className="underline">Edit</button>
        ) : (
          <Button className="bg-custom-blue text-white rounded-xl hover:bg-[#04061c]">
            <Icon icon="basil:plus-outline" width="24" height="24" />
            Add New User
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New User</AlertDialogTitle>
          <AlertDialogDescription>
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
          {({ isSubmitting }) => (
            <Form className="grid lg:grid-cols-2  gap-2">
              <div>
                <Field
                  type="text"
                  name="collegeNo"
                  placeholder="College Number"
                  className="custom-input w-full admin-input"
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
                  className="custom-input w-full admin-input"
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
                  className="custom-input w-full admin-input"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  type="text"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  className="custom-input w-full admin-input"
                />
                <ErrorMessage
                  name="mobileNumber"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="custom-input w-full admin-input"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <Field as="select" name="role" className="custom-input w-full admin-input">
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
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <button
                  type="submit"
                  className="bg-[#131A45] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#1a2154]"
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
