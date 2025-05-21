"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import gettoken from "../function/gettoken";

export default function ProfilePictureUpload() {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [uploadimage, setUploadimage] = useState(null);
  const url = process.env.NEXT_PUBLIC_URL;
  useEffect(() => {
    const storedData = localStorage.getItem("alumni");
    if (!storedData) {
      router.push("/login");
      return;
    }
    const { token } = JSON.parse(storedData);
    if (!token) {
      router.push("/login");
      return;
    }
  }, [router]);

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setUploadimage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = async () => {
    if (!uploadimage) {
      toast.error("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("profilePicture", uploadimage);
    try {
      const token = await gettoken();
      const response = await fetch(
        `${url}/api/profile/upload-profile-picture`,
        {
          method: "POST",
          headers: {

            Authorization: `Bearer ${token}`, // Add token in headers
          },
          body: formData,
        }
      );
      if (response.ok) {
        router.push("/alumni/homepage");
        return;
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <h1 className="text-3xl font-bold text-center mb-2 ">
        Upload your profile picture
      </h1>
      <p className="text-gray-600 text-center max-w-sm mb-8">
        Add a photo to personalize your profile and make it easier for others to
        recognize you.
      </p>
      {/* Profile Image Upload */}
      <div className="relative w-40 h-40">
        <label className="w-full h-full rounded-full border-2 border-[#C7A006] flex items-center justify-center cursor-pointer overflow-hidden">
          {image ? (
            <img
              src={image}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <Icon icon="mynaui:user-solid" width="80%" height="80%" />
          )}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
        <div className="absolute bottom-2 right-2 bg-[#C7A006] p-2 rounded-full cursor-pointer">
          {image ? (
            <Icon
              onClick={() => {
                setImage(null);
                setUploadimage(null);
              }}
              icon="material-symbols:delete-outline"
              width="24"
              height="24"
            />
          ) : (
            <Icon icon="typcn:camera" width="24" height="24" />
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/alumni/homepage"
          className="bg-[#131A45] text-center hover:bg-[#1a2154] text-white text-sm font-bold py-3 w-[150px] px-10 rounded-lg"
        >
          Skip
        </Link>
        <button
          onClick={handleContinue}
          className="bg-[#FFFFFF] text-center border border-[#C7A006] hover:bg-gray-200 text-[#131A45] text-sm font-bold py-3 px-10 w-[150px] rounded-lg"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
