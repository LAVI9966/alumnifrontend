import { useState } from "react";
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

const AddEvent = ({ getEvent }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const router = useRouter();
  // Form validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    date: Yup.date()
      .required("Date is required")
      .min(new Date(), "Date must be in the future"),
  });

  // Function to handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setIsSubmitting(true);
    const token = await gettoken();

    try {
      // const { token } = await JSON.parse(storedData);
      const response = await fetch(`${url}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Event added successfully!");
        getEvent();
        resetForm();
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-custom-blue rounded-xl hover:bg-[#04061c]">
          <Icon icon="basil:plus-outline" width="24" height="24" />
          Add New Event
        </Button>
        {/* <Button variant="outline">Add New Event</Button> */}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Event</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in the details below:
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Formik
          initialValues={{ title: "", description: "", date: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="text"
                  name="title"
                  placeholder="Event Title"
                  className="custom-input w-full"
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
                  className="custom-input w-full"
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
                  className="custom-input w-full"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button
                    type="submit"
                    className="bg-[#131A45] text-white py-2 px-4 rounded-xl font-semibold hover:bg-[#1a2154]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Add Event"}
                  </button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddEvent;
