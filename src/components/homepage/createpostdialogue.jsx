"use client";

import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import gettoken from "@/app/function/gettoken";

const CreatePostDialog = () => {
  const url = process.env.NEXT_PUBLIC_URL;

  // ✅ Form validation schema  
  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
    imageUrl: Yup.string()
      .url("Invalid URL format")
      .required("Image URL is required"),
  });

  // ✅ Form submission handler
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const token = await gettoken();
      const response = await fetch(`${url}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Post created successfully!");
        resetForm(); // Reset form after submission
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Network error, please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full bg-custom-blue text-white py-2 rounded-lg">
        Create Post
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 max-w-2xl px-4 md:px-0 gap-0">
        <Formik
          initialValues={{ content: "", imageUrl: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <AlertDialogTitle>
                {/* Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <span className="text-lg font-semibold">Create Post</span>
                  <AlertDialogCancel className="text-gray-400">
                    <Icon
                      className="text-gray-400"
                      icon="system-uicons:cross"
                      width="30"
                      height="30"
                    />
                  </AlertDialogCancel>
                </div>
              </AlertDialogTitle>

              {/* Content Input */}
              <div className="p-4">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Post Content
                </label>
                <Field
                  as="textarea"
                  name="content"
                  placeholder="Write something..."
                  className="w-full custom-input"
                  rows="3"
                />
                <ErrorMessage
                  name="content"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Image URL Input */}
              <div className="p-4">
                <label className="block mb-2 text-sm font-medium text-gray-600">
                  Image URL
                </label>
                <Field
                  type="text"
                  name="imageUrl"
                  placeholder="Enter image URL..."
                  className="w-full custom-input"
                />
                <ErrorMessage
                  name="imageUrl"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <AlertDialogFooter className="p-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer bg-custom-blue text-white py-2 px-10 rounded-lg  "
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </button>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreatePostDialog;

// "use client";
// import React from "react";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Icon } from "@iconify/react";
// import DefaultEditor, {
//   BtnBold,
//   BtnItalic,
//   createButton,
//   Editor,
//   EditorProvider,
//   Toolbar,
// } from "react-simple-wysiwyg";

// const Createpostdialogue = () => {
//   const [image, setImage] = React.useState(null);
//   const [caption, setCaption] = React.useState("");

//   const handleImageUpload = (event) => {
//     if (event.target.files && event.target.files[0]) {
//       const file = event.target.files[0];
//       const reader = new FileReader();
//       reader.onload = (e) => setImage(e.target?.result);
//       reader.readAsDataURL(file);
//     }
//   };
//   const handleSubmit = async (values, { setSubmitting }) => {
//     try {
//       const token = await gettoken();
//       const response = await fetch(`${url}/api/profile/update`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(values),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Profile updated successfully!");
//         getProfile();
//       } else {
//         toast.error(data.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Network error, please try again later.");
//     }
//   };
//   return (
//     <AlertDialog>
//       <AlertDialogTrigger className="w-full  bg-custom-blue text-white py-2 rounded-lg  ">
//         Create Post
//       </AlertDialogTrigger>
//       <AlertDialogContent className="p-0 max-w-2xl px-4 md:px-0 gap-0">
//         <AlertDialogTitle>
//           {" "}
//           {/* Caption & Image Upload */}
//           <div className="p-4 border-b flex items-center justify-between">
//             <div className="flex  items-center ">
//               <button className="text-gray-400 text-xs mr-3">Aa</button>
//               <label className="cursor-pointer">
//                 <input
//                   type="file"
//                   className="hidden"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                 />
//                 <Icon
//                   icon="solar:gallery-broken"
//                   width="20"
//                   height="20"
//                   className="text-gray-400"
//                 />
//               </label>
//             </div>
//             <AlertDialogCancel className=" text-gray-400 ">
//               {" "}
//               <Icon
//                 className=" text-gray-400 "
//                 icon="system-uicons:cross"
//                 width="30"
//                 height="30"
//               />
//             </AlertDialogCancel>
//           </div>
//           {/* Caption Input */}
//           <div className="p-2 text-xs font-medium border-b">
//             {/* <input
//               type="text"
//               placeholder="Say Something..."
//               className="w-full outline-none text-gray-600"
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//             /> */}

//             <DefaultEditor
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//               style={{ height: "50px", overflowY: "auto" }}
//             />
//           </div>
//         </AlertDialogTitle>

//         <div className=" bg-white  overflow-hidden">
//           {/* Image Preview */}
//           <div className="h-56 bg-gray-300 relative flex items-center justify-center">
//             {image && (
//               <Icon
//                 onClick={() => setImage(null)}
//                 className="cursor-pointer text-gray-800 absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm border border-gray-300"
//                 icon="material-symbols:delete-outline-rounded"
//                 width="40"
//                 height="40"
//               />
//             )}

//             {image ? (
//               <img
//                 src={image}
//                 alt="Preview"
//                 className="max-h-full max-w-full object-cover"
//               />
//             ) : null}
//           </div>
//         </div>

//         <AlertDialogFooter className="p-2">
//           <div
//             onClick={handleSubmit}
//             className="cursor-pointer bg-custom-blue text-white py-2 px-10 rounded-lg  "
//           >
//             Upload
//           </div>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default Createpostdialogue;
