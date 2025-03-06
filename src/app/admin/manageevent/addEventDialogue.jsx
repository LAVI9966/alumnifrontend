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

const AddEvent = ({ getEvent, id, title, description, date }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;

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

    try {
      const token = await gettoken();
      const apiurl = id ? `${url}/api/events/${id}` : `${url}/api/events`;
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
          <Button className="bg-custom-blue rounded-xl hover:bg-[#04061c]">
            <Icon icon="basil:plus-outline" width="24" height="24" />
            Add New Event
          </Button>
        )}
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
          enableReinitialize
          initialValues={{
            title: title || "",
            description: description || "",
            date: date || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
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
