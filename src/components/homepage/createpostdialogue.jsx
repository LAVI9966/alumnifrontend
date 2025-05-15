// CreatePostDialogue.js - Fixed with image deletion support

import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  AlertDialog,
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
  const [previewImages, setPreviewImages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // New state variables to track existing vs new images
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]);

  const url = process.env.NEXT_PUBLIC_URL;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Maximum number of images allowed
  const MAX_IMAGES = 30;

  // Helper function to extract filenames from paths consistently
  const getFileNameFromPath = (path) => {
    if (!path) return "";
    // Handle both slash types and direct filenames with a regex split
    return path.split(/[\\/]/).pop();
  };

  // Set preview images and track existing images when post data changes
  useEffect(() => {
    if (postData) {
      let images = [];

      if (postData.imageUrl) {
        // Single image case (legacy)
        images = [postData.imageUrl];
      } else if (postData.images && postData.images.length > 0) {
        // Multiple images case
        images = [...postData.images];
      }

      // Track the original images
      setExistingImages(images);
      // Initially keep all images
      setImagesToKeep(images);

      // Create preview URLs for existing images
      const previews = images.map(imagePath => {
        const fileName = getFileNameFromPath(imagePath);
        return `${url}/uploads/${fileName}`;
      });

      setPreviewImages(previews);
    }
  }, [postData, url]);

  // Enhanced removeImage function that handles both existing and new images
  const removeImage = (index, setFieldValue, values) => {
    // Remove from preview in all cases
    setPreviewImages(prev => prev.filter((_, i) => i !== index));

    if (index < existingImages.length) {
      // It's an existing image - remove from imagesToKeep
      setImagesToKeep(prev => prev.filter((_, i) => i !== index));
    } else {
      // It's a new image - remove from form values
      const newImageIndex = index - existingImages.length;
      const newImages = [...values.images];
      newImages.splice(newImageIndex, 1);
      setFieldValue("images", newImages);
    }
  };

  // Better progress indication
  const simulateProgress = useCallback(() => {
    setUploadProgress(0);
    setIsUploading(true);

    return setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          return 95;
        }
        return prev + 5;
      });
    }, 300);
  }, []);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className={
          postData
            ? `cursor-pointer text-sm w-full text-start hover:${isDark ? "bg-[#2A3057]" : "bg-gray-100"} px-4 py-2 ${isDark ? "bg-[#2A3057] text-gray-200" : ""}`
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
            images: []
          }}
          validationSchema={Yup.object({
            content: Yup.string().required("Caption is required"),
            images: postData
              ? Yup.array()
              : Yup.array().min(1, "At least one image is required")
                .max(MAX_IMAGES, `Maximum ${MAX_IMAGES} images allowed`)
          })}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              // Start progress indicator
              setIsUploading(true);
              setUploadProgress(10);

              // Create FormData properly
              const formData = new FormData();

              // Always include content
              formData.append("content", values.content);

              // Add which existing images to keep
              if (postData) {
                formData.append("imagesToKeep", JSON.stringify(imagesToKeep));
              }

              // Add new images if any were selected
              if (values.images && values.images.length > 0) {
                // Add each image to form data
                for (let i = 0; i < values.images.length; i++) {
                  formData.append("images", values.images[i]);
                }
              }

              // Determine API URL
              const apiUrl = postData
                ? `${url}/api/posts/${postData._id}`
                : `${url}/api/posts`;

              // Gradual progress updates
              const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 5, 95));
              }, 300);

              // Get token
              const token = await gettoken();
              if (!token) {
                throw new Error("Authentication token not available");
              }

              // Make the request
              const response = await fetch(apiUrl, {
                method: postData ? "PUT" : "POST",
                headers: {
                  // Don't include Content-Type header when using FormData
                  Authorization: `Bearer ${token}`,
                },
                body: formData,
              });

              clearInterval(progressInterval);
              setUploadProgress(100);

              // Parse response JSON
              const data = await response.json();

              // Handle response
              if (response.ok) {
                toast.success(
                  postData
                    ? "Post updated successfully!"
                    : "Post created successfully!"
                );
                resetForm();
                setPreviewImages([]);
                setExistingImages([]);
                setImagesToKeep([]);
                getPosts();
                setIsOpen(false);
              } else {
                console.error("Error response:", data);
                toast.error(data.message || "Error updating post");
              }
            } catch (error) {
              console.error("Client error:", error);
              toast.error("Network error: " + error.message);
            } finally {
              setIsUploading(false);
              setUploadProgress(0);
              setSubmitting(false);
            }
          }}
        >
          {({ setFieldValue, values, isSubmitting, errors, touched }) => (
            <Form>
              <AlertDialogTitle>
                <div className={`p-2 border-b flex items-center justify-between ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={(event) => {
                        const files = event.currentTarget.files;
                        if (files && files.length > 0) {
                          // Calculate total images (existing + new)
                          const totalImages = imagesToKeep.length + values.images.length + files.length;

                          // Check if adding more images would exceed the limit
                          if (totalImages > MAX_IMAGES) {
                            toast.error(`You can only upload a maximum of ${MAX_IMAGES} images. Please select fewer images.`);
                            return;
                          }

                          // Add to form values for new uploads
                          setFieldValue("images", [...values.images, ...files]);

                          // Create preview URLs for each new file
                          const newPreviewUrls = Array.from(files).map(file =>
                            URL.createObjectURL(file)
                          );

                          // Add to preview images
                          setPreviewImages(prev => [...prev, ...newPreviewUrls]);
                        }
                      }}
                    />
                    <div className="flex items-center">
                      <Icon
                        icon="solar:gallery-broken"
                        width="20"
                        height="20"
                        className={isDark ? "text-gray-300" : "text-gray-400"}
                      />
                      <span className="ml-2 text-xs">
                        {/* Show total of kept existing images + new images */}
                        {`${imagesToKeep.length + values.images.length}/${MAX_IMAGES}`}
                      </span>
                    </div>
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
                  {errors.content && touched.content ? (
                    <div className="text-red-500 text-xs px-2">{errors.content}</div>
                  ) : null}
                </div>
              </AlertDialogTitle>
              <div className={isDark ? "bg-gray-900 overflow-hidden" : "bg-white overflow-hidden"}>
                {previewImages.length > 0 ? (
                  <div className={`max-h-80 overflow-y-auto p-2 grid grid-cols-2 sm:grid-cols-3 gap-2 ${isDark ? "bg-gray-800" : "bg-gray-200"}`}>
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative h-40">
                        <button
                          type="button"
                          onClick={() => removeImage(index, setFieldValue, values)}
                          className={`absolute top-2 right-2 z-10 p-1 rounded-full ${isDark ? "bg-gray-900" : "bg-white"}`}
                        >
                          <Icon
                            icon="material-symbols:delete-outline-rounded"
                            width="20"
                            height="20"
                            className="text-red-500"
                          />
                        </button>
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="h-full w-full object-cover rounded"
                          onError={(e) => {
                            console.error(`Error loading image: ${src}`);
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='none' stroke='%23ccc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                          {index + 1}/{previewImages.length}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`h-56 ${isDark ? "bg-gray-800" : "bg-gray-300"} flex items-center justify-center`}>
                    <div className="text-center">
                      <Icon
                        icon="solar:gallery-broken"
                        width="48"
                        height="48"
                        className={isDark ? "mx-auto text-gray-600" : "mx-auto text-gray-500"}
                      />
                      <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Click the gallery icon to add images (up to {MAX_IMAGES})
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="px-4 py-2">
                  <div className="w-full h-2 bg-gray-300 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1">
                    {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                  </p>
                </div>
              )}

              <AlertDialogFooter className="p-2">
                <button
                  type="submit"
                  className={`py-2 px-10 text-white rounded-lg ${isDark ? 'bg-[#131A45]' : 'bg-custom-blue'} ${(isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting || isUploading ?
                    (postData ? "Updating..." : "Uploading...") :
                    (postData ? "Update" : "Upload")
                  }
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