"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import gettoken from "@/app/function/gettoken";
import Chatusers from "@/components/chatpage/chatusers";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useTheme } from "@/context/ThemeProvider";

// const socket = io("ws://localhost:8000");
const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL);

const Chatmain = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [memberdata, setMemberData] = useState([]);
  const url = process.env.NEXT_PUBLIC_URL;
  const { slug } = useParams();
  const messagesEndRef = useRef(null);
  const [imgurl, setImgurl] = useState("");
  const { theme, toggleTheme } = useTheme(); // Use the theme context
  const isDark = theme === 'dark';

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const token = await gettoken();

      const response = await fetch(`${url}/api/members/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add token in headers
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMemberData(data);
        console.log(data);
        const person = data.find((val) => val._id === slug);
        console.log(person);
        if (person && person?.profilePicture) {
          const imgsrc = person?.profilePicture
            ? `${url}/uploads/${person?.profilePicture?.split("\\").pop()}`
            : "";

          setImgurl(imgsrc);
        }
      } else {
        toast.error(data?.message || "failed.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };
  // Get current user ID from local storage
  useEffect(() => {
    const storedData = localStorage.getItem("alumni");
    if (storedData) {
      const { user } = JSON.parse(storedData);
      setReceiverId(slug);

      // Generate a **unique room ID** based on user and receiver
      const generatedRoomId =
        user.id < slug ? `${user.id}_${slug}` : `${slug}_${user.id}`;
      setRoomId(generatedRoomId);

      // Join room
      socket.emit("joinRoom", { roomId: generatedRoomId });

      // Listen for incoming messages
      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [slug]);

  // Scroll to the latest message when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch previous messages
  useEffect(() => {
    const getChat = async () => {
      try {
        const storedData = localStorage.getItem("alumni");
        if (!storedData) return;
        const { user } = JSON.parse(storedData);

        const token = await gettoken();
        const apiurl = `${url}/api/chat/messages/${user.id}/${slug}`;
        const response = await fetch(apiurl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setMessages(data.data);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error, please try again later.");
      }
    };

    getChat();
  }, [slug]);
  const getName = (id) => {
    const member = memberdata.find((val) => val._id === id);

    return member ? member.name : "User"; // Return name if found, else "Not Found"
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const storedData = localStorage.getItem("alumni");
    if (!storedData) return;
    const { user } = JSON.parse(storedData);

    const newMessage = {
      roomId,
      senderId: user.id,
      receiverId: slug,
      message: input,
    };

    socket.emit("sendMessage", newMessage);
    setInput("");
  };

  function extractTime12Hour(isoString) {
    const date = new Date(isoString);
    date.setMinutes(date.getMinutes() + 330); // Convert UTC to IST (+5:30)

    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;
  }
  return (
    <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-cyan-400'}`}>
      <div className={`min-h-screen max-w-[1200px] w-full mx-auto flex gap-3 ${isDark ? 'bg-[#2A3057]' : 'bg-cyan-300'} pt-8`}>
        <div className="w-full px-4 lg:px-0 lg:w-[25%] hidden md:block">
          <Chatusers />
        </div>
        <div className={`max-w-[900px] w-full lg:w-[75%] mx-auto ${isDark ? 'bg-[#2A3057]' : 'bg-cyan-300'} shadow-lg rounded-lg h-[600px] flex flex-col md:ml-4`}>
          {/* Header */}
          <div className={`flex items-center justify-between py-3 px-4 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-cyan-300'} border-b border-[#D9D9D9]`}>
            <div className="flex items-center space-x-2">
              <div className={`${isDark ? 'text-white' : 'text-black'} flex flex-col gap-2`}>
                <p className="font-semibold">
                  {receiverId && getName(receiverId)}
                </p>
                <p className="text-xs text-gray-500">
                  Room ID: {roomId?.slice(0, 4)}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${isDark ? 'bg-[#2A3057]' : 'bg-cyan-300'}`}>
            {messages?.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.senderId !== slug ? "justify-end" : "justify-start"
                  }`}
              >
                <div className="flex gap-2">
                  {msg.senderId === slug && (
                    <Avatar className="cursor-pointer">
                      <AvatarImage
                        className="w-10 h-10 rounded-full"
                        src={imgurl ? imgurl : "/memberpage/member.png"}
                        alt="avatar"
                      />
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`p-2 rounded-lg max-w-xs break-words whitespace-normal ${msg.senderId !== slug
                          ? "bg-[#3271FF] text-white"
                          : isDark
                            ? "bg-[#3A4070] text-white"
                            : "bg-[#D9D9D9] text-[#797979]"
                        }`}
                    >
                      {msg.message}
                    </div>
                    <div className={`${isDark ? 'text-gray-300' : 'text-[#797979]'} text-xs mt-2`}>
                      {extractTime12Hour(msg?.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className={`flex items-center border-t border-gray-300 p-3 ${isDark ? 'bg-[#2A3057]' : 'bg-gray-100'}`}
          >
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg ${isDark ? 'bg-[#3A4070] text-white' : 'bg-white text-black'} border border-gray-300 focus:outline-none`}
            />
            <button
              type="submit"
              className="ml-2 text-center bg-custom-blue text-white px-3 lg:px-8 py-2 rounded-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatmain;