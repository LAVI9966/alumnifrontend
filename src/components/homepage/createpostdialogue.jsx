"use client";
import React from "react";
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
import { Icon } from "@iconify/react";
import {
  BtnBold,
  BtnItalic,
  createButton,
  Editor,
  EditorProvider,
  Toolbar,
} from "react-simple-wysiwyg";
const BtnAlignCenter = createButton("Align Center", "≡", "justifyCenter");
const BtnAlignLeft = createButton("Align Left", "≡", "justifyLeft");
const BtnUnderline = createButton("Underline", "U", "underline");
const BtnStrikeThrough = createButton("Strike", "S", "strikeThrough");
const BtnOrderedList = createButton("Numbered List", "1.", "insertOrderedList");
const BtnUnorderedList = createButton(
  "Bullet List",
  "•",
  "insertUnorderedList"
);

const Createpostdialogue = () => {
  const [image, setImage] = React.useState(null);
  const [caption, setCaption] = React.useState("my <b>HTML</b>");

  const handleImageUpload = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result);
      reader.readAsDataURL(file);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full  bg-custom-blue text-white py-2 rounded-lg  ">
        Create Post
      </AlertDialogTrigger>
      <AlertDialogContent className="p-0 max-w-2xl px-4 md:px-0 gap-0">
        <AlertDialogTitle>
          {" "}
          {/* Caption & Image Upload */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex  items-center ">
              <button className="text-gray-400 text-xs mr-3">Aa</button>
              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Icon
                  icon="solar:gallery-broken"
                  width="20"
                  height="20"
                  className="text-gray-400"
                />
              </label>
            </div>
            <AlertDialogCancel className=" text-gray-400 ">
              {" "}
              <Icon
                className=" text-gray-400 "
                icon="system-uicons:cross"
                width="21"
                height="21"
              />
            </AlertDialogCancel>
          </div>
          {/* Caption Input */}
          <div className="p-2 text-xs font-medium border-b">
            {/* <input
              type="text"
              placeholder="Say Something..."
              className="w-full outline-none text-gray-600"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            /> */}
            <EditorProvider>
              <Toolbar>
                <BtnBold />
                <BtnItalic />
                <BtnUnderline />
                <BtnStrikeThrough />
                <BtnAlignLeft />
                <BtnAlignCenter />
                <BtnOrderedList />
                <BtnUnorderedList />
              </Toolbar>
              <Editor
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                style={{ height: "50px", overflowY: "auto" }}
              />
            </EditorProvider>
          </div>
        </AlertDialogTitle>

        <div className=" bg-white  overflow-hidden">
          {/* Image Preview */}
          <div className="h-56 bg-gray-300 flex items-center justify-center">
            {image ? (
              <img
                src={image}
                alt="Preview"
                className="max-h-full max-w-full object-cover"
              />
            ) : null}
          </div>
        </div>

        <AlertDialogFooter className="p-2">
          <AlertDialogAction className=" bg-custom-blue text-white py-2 px-10 rounded-lg  ">
            Upload
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Createpostdialogue;
