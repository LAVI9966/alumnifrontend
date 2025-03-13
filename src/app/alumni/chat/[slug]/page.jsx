"use client";
import gettoken from "@/app/function/gettoken";
import Chatusers from "@/components/chatpage/chatusers";
import { Icon } from "@iconify/react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import React, { useEffect } from "react";
import toast from "react-hot-toast";

const Chatmain = () => {
  const [messages, setMessages] = React.useState([
    { text: "Hello there! How can we assist you today?", sender: "other" },
    { text: "Hello there! How can we assist you today?", sender: "You" },
  ]);
  const [input, setInput] = React.useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "You" }]);
    setInput("");
  };
  useEffect(() => {
    const getChat = async () => {
      try {
      
        const token = await gettoken();
       
        const apiurl =
          "http://localhost:8000/chat/messages/67c847c73fcad4430caff0a1/67c9682cd02ab83f78b8a591";
        const response = await fetch(apiurl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        
        });
      
        const data = await response.json();
      
        if (response.ok) {
          console.log(data);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.log(error)
        toast.error("Network error, please try again later.");
      }
    };
    // getChat();
  },[]);

  return (
    <div className="min-h-screen max-w-[1200px] w-full mx-auto flex gap-3  bg-white pt-8 ">
      <div className="w-full lg:w-[25%] hidden md:block">
        <Chatusers />
      </div>
      <div className="max-w-[900px] w-full lg:w-[75%]  mx-auto bg-white shadow-lg rounded-lg  h-[600px] flex flex-col ml-4">
        {/* Header */}
        <div className="flex items-center justify-between py-3 px-4 bg-white border-b border-[#D9D9D9]">
          <div className="flex items-center space-x-2">
            <div className="text-black flex flex-col gap-2">
              <p className="text-sm font-semibold">Pratyush Solanki</p>
              <p className="text-xs text-gray-500">Last Active 5 hours ago</p>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "You" ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex gap-2">
                {msg.sender !== "You" && (
                  <Avatar className=" cursor-pointer">
                    <AvatarImage
                      className="w-10 h-10 rounded-full  "
                      src="https://github.com/shadcn.png"
                      alt="avtar"
                    />
                  </Avatar>
                )}
                <div>
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.sender === "You"
                        ? "bg-[#3271FF] text-white"
                        : "bg-[#D9D9D9] text-[#797979]"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="text-[#797979] text-xs mt-2">10:00 pm</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSendMessage}
          className="flex items-center border-t border-gray-300 p-3 bg-gray-100 "
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 text-center bg-custom-blue  text-white px-3  lg:px-8 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatmain;
