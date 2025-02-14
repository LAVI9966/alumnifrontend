"use client";
import Chatusers from "@/components/chatpage/chatusers";
import React from "react";

const Chat = () => {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "You" }]);
    setInput("");
  };

  return (
    <div className="min-h-screen max-w-[1200px] w-full mx-auto flex gap-3  bg-white pt-8 ">
      <div className="w-full px-4 lg:px-0 lg:w-[25%] ">
        <Chatusers />
      </div>
      <div className="max-w-[900px] w-full lg:w-[75%]  mx-auto bg-white shadow-lg rounded-lg  h-[600px]  hidden lg:flex flex-col  ">
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
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === "You"
                    ? "bg-custom-blue text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Field */}
        <form
          onSubmit={handleSendMessage}
          className="flex items-center border-t border-gray-300 p-3 bg-gray-100 "
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 max-w-[75%] px-3 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 text-center bg-custom-blue w-[25%] text-white px-6 py-2 rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
