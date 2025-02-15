import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

export default function ProfilePictureUpload() {
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
        <div className="w-full h-full rounded-full border-2 border-[#C7A006] flex items-center justify-center">
          <Icon icon="mynaui:user-solid" width="80%" height="80%" />
        </div>
        <div className="absolute bottom-2 right-2 bg-[#C7A006] p-2 rounded-full cursor-pointer">
          <Icon icon="typcn:camera" width="24" height="24" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8  flex gap-4">
        <Link href="/alumni/homepage" className="bg-[#131A45] text-center hover:bg-[#1a2154] text-white text-sm font-bold py-3 w-[150px] px-10 rounded-lg">
          Skip
        </Link>
        <Link href="/alumni/homepage" className="bg-[#FFFFFF] text-center border border-[#C7A006] hover:bg-gray-200 text-[#131A45] text-sm font-bold py-3 px-10 w-[150px] rounded-lg">
          Continue
        </Link>
      </div>
    </div>
  );
}
