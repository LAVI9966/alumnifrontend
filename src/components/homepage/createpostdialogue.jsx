"use client";

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
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
import gettoken from "@/app/function/gettoken";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeProvider";
const CreatePostDialogue = ({ getPosts, postData }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const url = process.env.NEXT_PUBLIC_URL;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (postData && postData.imageUrl) {
      const src = `${url}/uploads/${postData?.imageUrl?.split("\\").pop()}`;
      setPreviewImage(src);
    }
  }, [postData]);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className={
          postData
            ? `cursor-pointer text-sm w-full text-start hover:${isDark ? "bg-[#2A3057]" : "bg-gray-100"} px-4 py-2 ${isDark ? "bg-[#2A3057]  text-gray-200" : ""}`
            : `w-full ${isDark ? 'bg-[#2A3057]' : 'bg-custom-blue'} text-white py-2 rounded-lg`
        }
        onClick={() => setIsOpen(true)}
      >
        {postData ? "Edit Post" : "Create Post"}
      </AlertDialogTrigger>
      <AlertDialogContent className={`p-0 max-w-2xl px-4 md:px-0 gap-0 ${isDark ? "bg-[#2A3057] text-gray-100" : "bg-white text-gray-900"}`}>
        <Formik
          initialValues={{
            content: postData?.content || "",
            imageUrl: null,
          }}
          validationSchema={Yup.object({
            content: Yup.string().required("Caption is required"),
            imageUrl: Yup.mixed().required("Image is required"),
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const formData = new FormData();
              formData.append("content", values.content);
              if (values.imageUrl) {
                formData.append("image", values.imageUrl);
              }

              const apiUrl = postData
                ? `${url}/api/posts/${postData?._id}`
                : `${url}/api/posts`;
              const method = postData ? "PUT" : "POST";

              const response = await fetch(apiUrl, {
                method,
                headers: {
                  Authorization: `Bearer ${await gettoken()}`,
                },
                body: formData,
              });

              const data = await response.json();
              if (response.ok) {
                toast.success(
                  postData
                    ? "Post updated successfully!"
                    : "Post created successfully!"
                );
                resetForm();
                setPreviewImage(null);
                getPosts();
                setIsOpen(false);
              } else {
                toast.error(data.message || "Something went wrong");
              }
            } catch (error) {
              console.error(error);
              toast.error("Network error, please try again later.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <AlertDialogTitle>
                <div className={`p-2 border-b flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          setFieldValue("imageUrl", file);
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                    <Icon
                      icon="solar:gallery-broken"
                      width="20"
                      height="20"
                      className={isDark ? "text-gray-300" : "text-gray-400"}
                    />
                  </label>
                  <AlertDialogCancel
                    className={isDark ? "text-gray-300" : "text-black"}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon icon="system-uicons:cross" width="40" height="40" />
                  </AlertDialogCancel>
                </div>
                <div>
                  <Field
                    as="textarea"
                    name="content"
                    placeholder="Say something..."
                    className={`w-full outline-none p-2 text-sm ${isDark ? "bg-gray-900 text-gray-100" : "text-gray-600"}`}
                  />
                </div>
              </AlertDialogTitle>
              <div className={isDark ? "bg-gray-900 overflow-hidden" : "bg-white overflow-hidden"}>
                <div className={`h-56 ${isDark ? "bg-gray-800" : "bg-gray-300"} relative flex items-center justify-center`}>
                  {previewImage && (
                    <>
                      <Icon
                        onClick={() => {
                          setFieldValue("imageUrl", null);
                          setPreviewImage(null);
                        }}
                        className={`cursor-pointer ${isDark ? "text-gray-200 bg-gray-900 border-gray-700" : "text-gray-800 bg-white border-gray-300"} absolute top-2 right-2 rounded-full p-2 shadow-sm border`}
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
              <AlertDialogFooter className="p-2">
                <button
                  type="submit"
                  className={`py-2 px-10 text-white rounded-lg ${isDark ? 'bg-[#131A45]' : 'bg-custom-blue'}`}
                  disabled={isSubmitting}
                >
                  {postData ? "Update" : "Upload"}
                </button>
              </AlertDialogFooter>
            </Form>
          )}
        </Formik>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreatePostDialogue;

// import React, { useState } from "react";
// import { Formik, Form, Field } from "formik";
// import * as Yup from "yup";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Icon } from "@iconify/react";
// import gettoken from "@/app/function/gettoken";
// import toast from "react-hot-toast";
// import { DropdownMenuItem } from "../ui/dropdown-menu";

// const CreatePostDialogue = ({ getPosts, postData }) => {
//   const [previewImage, setPreviewImage] = useState(null);
//   const [isOpen, setIsOpen] = useState(false); // State for modal visibility
//   const url = process.env.NEXT_PUBLIC_URL;

//   return (
//     <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
//       {postData ? (
//         <AlertDialogTrigger
//           className="cursor-pointer w-full text-start  hover:bg-gray-100 px-4 py-2"
//           onClick={() => setIsOpen(true)}
//         >
//         Edit Post
//         </AlertDialogTrigger>
//       ) : (
//         <AlertDialogTrigger
//           className="w-full bg-custom-blue text-white py-2 rounded-lg"
//           onClick={() => setIsOpen(true)}
//         >
//           Create Post
//         </AlertDialogTrigger>
//       )}
//       <AlertDialogContent className="p-0 max-w-2xl px-4 md:px-0 gap-0">
//         <Formik
//           initialValues={{ content: "", imageUrl: null }}
//           validationSchema={Yup.object({
//             content: Yup.string().required("Caption is required"),
//             imageUrl: Yup.mixed().required("Image is required"),
//           })}
//           onSubmit={async (values, { setSubmitting, resetForm }) => {
//             try {
//               const formData = new FormData();
//               formData.append("content", values.content);

//               if (values.imageUrl) {
//                 formData.append("image", values.imageUrl);
//               }

//               const response = await fetch(`${url}/api/posts`, {
//                 method: "POST",
//                 headers: {
//                   Authorization: `Bearer ${await gettoken()}`,
//                 },
//                 body: formData,
//               });

//               const data = await response.json();
//               if (response.ok) {
//                 toast.success("Post created successfully!");
//                 resetForm();
//                 setPreviewImage(null);
//                 getPosts();
//                 setIsOpen(false); // Close modal on success
//               } else {
//                 toast.error(data.message || "Something went wrong");
//               }
//             } catch (error) {
//               console.error(error);
//               toast.error("Network error, please try again later.");
//             } finally {
//               setSubmitting(false);
//             }
//           }}
//         >
//           {({ setFieldValue, values, isSubmitting }) => (
//             <Form>
//               <AlertDialogTitle>
//                 <div className="p-2 border-b flex items-center justify-between">
//                   <label className="cursor-pointer">
//                     <input
//                       type="file"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={(event) => {
//                         const file = event.currentTarget.files[0];
//                         if (file) {
//                           setFieldValue("imageUrl", event.target.files[0]);
//                           setPreviewImage(URL.createObjectURL(file));
//                         }
//                       }}
//                     />
//                     <Icon
//                       icon="solar:gallery-broken"
//                       width="20"
//                       height="20"
//                       className="text-gray-400"
//                     />
//                   </label>
//                   <AlertDialogCancel
//                     className="text-gray-400"
//                     onClick={() => setIsOpen(false)}
//                   >
//                     <Icon icon="system-uicons:cross" width="30" height="30" />
//                   </AlertDialogCancel>
//                 </div>
//                 <div>
//                   <Field
//                     as="textarea"
//                     name="content"
//                     placeholder="Say something..."
//                     className="w-full outline-none p-2 text-sm text-gray-600"
//                   />
//                 </div>
//               </AlertDialogTitle>
//               <div className="bg-white overflow-hidden">
//                 <div className="h-56 bg-gray-300 relative flex items-center justify-center">
//                   {previewImage && (
//                     <>
//                       <Icon
//                         onClick={() => {
//                           setFieldValue("imageUrl", null);
//                           setPreviewImage(null);
//                         }}
//                         className="cursor-pointer text-gray-800 absolute top-2 right-2 bg-white rounded-full p-2 shadow-sm border border-gray-300"
//                         icon="material-symbols:delete-outline-rounded"
//                         width="40"
//                         height="40"
//                       />
//                       <img
//                         src={previewImage}
//                         alt="Preview"
//                         className="max-h-full max-w-full object-cover"
//                       />
//                     </>
//                   )}
//                 </div>
//               </div>
//               <AlertDialogFooter className="p-2">
//                 <button
//                   type="submit"
//                   className="bg-custom-blue text-white py-2 px-10 rounded-lg"
//                   disabled={isSubmitting}
//                 >
//                   Upload
//                 </button>
//               </AlertDialogFooter>
//             </Form>
//           )}
//         </Formik>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// };

// export default CreatePostDialogue;

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
//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const token = await gettoken();
//       const response = await fetch(`${url}/api/posts`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(values),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         toast.success("Post created successfully!");
//         resetForm(); // Reset form after submission
//       } else {
//         toast.error(data.message || "Something went wrong");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Network error, please try again later.");
//     } finally {
//       setSubmitting(false);
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
