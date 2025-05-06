'use client'
import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";
const AddEvent = ({ getEvent, id, title, description, date, imageUrl }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';
  const [previewImage, setPreviewImage] = useState(null);
  // Form validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date()
      .required("Date is required")
      .min(new Date(), "Date must be in the future"),
    imageUrl: Yup.mixed().required("Image is required"),
  });
  useEffect(() => {
    if (imageUrl) {
      const imgsrc = `${url}/uploads/${imageUrl?.split("\\").pop()}`;
      setPreviewImage(imgsrc);
    }
  }, [id]);
  // Function to handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description); // ✅ Correct

      formData.append("date", values.date);
      if (values.imageUrl) {
        formData.append("image", values.imageUrl);
      }

      console.log(formData, "helooo");
      const token = await gettoken();
      const apiurl = id ? `${url}/api/events/${id}` : `${url}/api/events`;
      console.log("helooosdds");
      const response = await fetch(apiurl, {
        method: id ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          data.message || `Event ${id ? "update" : "added"} successfully!`
        );
        getEvent();
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
            Add New Event
          </Button>
        )}
        {/* <Button variant="outline">Add New Event</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-[900px] h-[90vh] overflow-scroll ">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {" "}
            {id ? "Update Event" : "Add New Event"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details below:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Formik
          enableReinitialize
          initialValues={{
            title: title || "",
            description: description || "",
            date: date || "",
            imageUrl: imageUrl || null,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, isValid }) => (
            <Form className="space-y-4">
              <div className="p-2 border-b flex items-center justify-between">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.currentTarget.files[0];
                      if (file) {
                        setFieldValue("imageUrl", event.target.files[0]);
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />
                  <Icon
                    icon="solar:gallery-broken"
                    width="20"
                    height="20"
                    className="text-gray-400"
                  />
                </label>
              </div>
              <div>
                <Field
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  className={`custom-input ${isDark ? 'bg-[#2A3057]' : 'bg-white'} w-full`}
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Event Description"
                  className={`custom-input ${isDark ? 'bg-[#2A3057]' : 'bg-white'} w-full`}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <Field
                  type="date"
                  name="date"
                  className={`custom-input ${isDark ? 'bg-[#2A3057]' : 'bg-white'} w-full`}
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="bg-white overflow-hidden">
                <div className="h-56 bg-gray-300 relative flex items-center justify-center">
                  {previewImage && (
                    <>
                      <Icon
                        onClick={() => {
                          setFieldValue("imageUrl", null);
                          setPreviewImage(null);
                        }}
                        className="cursor-pointer text-gray-800 absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm border border-gray-300"
                        icon="material-symbols:delete-outline-rounded"
                        width="40"
                        height="40"
                      />
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-full max-w-full object-cover"
                      />
                    </>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <button
                  type="submit"
                  className="bg-[#131A45] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#1a2154]"
                  disabled={isSubmitting || !isValid}
                >
                  {isSubmitting
                    ? "Saving..."
                    : id
                      ? "Update Event"
                      : "Add Event"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddEvent;
