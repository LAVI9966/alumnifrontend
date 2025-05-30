"use client";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import gettoken from "@/app/function/gettoken";
import Chatusers from "@/components/chatpage/chatusers";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import toast from "react-hot-toast";
import { useTheme } from "@/context/ThemeProvider";
import { Icon } from "@iconify/react";
import { useChatNotifications } from '@/context/ChatNotificationContext';

// Use environment variable for WebSocket URL
const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_URL || "ws://localhost:8000");

const GlobalChat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [memberdata, setMemberData] = useState([]);
    const url = process.env.NEXT_PUBLIC_URL;
    const messagesEndRef = useRef(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const { socket, isConnected } = useChatNotifications();

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
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMemberData(data);
            } else {
                toast.error(data?.message || "Failed to fetch members.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        }
    };

    // Get current user ID from local storage and join global room
    useEffect(() => {
        if (!socket || !isConnected) return;

        const storedData = localStorage.getItem("alumni");
        if (storedData) {
            // Join global room
            socket.emit("joinGlobalRoom");

            // Listen for incoming messages
            socket.on("receiveGlobalMessage", (message) => {
                setMessages((prevMessages) => [...prevMessages, message]);
            });

            return () => {
                socket.off("receiveGlobalMessage");
            };
        }
    }, [socket, isConnected]);

    // Scroll to the latest message when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch previous global messages
    useEffect(() => {
        const getGlobalChat = async () => {
            try {
                const token = await gettoken();
                const response = await fetch(`${url}/api/chat/global-messages`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setMessages(data.data.sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt)));
                } else {
                    toast.error(data.message || "Something went wrong");
                }
            } catch (error) {
                console.error(error);
                toast.error("Network error, please try again later.");
            }
        };

        getGlobalChat();
    }, []);

    const getName = (id) => {
        const member = memberdata.find((val) => val._id === id);
        return member ? member.name : "User";
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || !socket || !isConnected) return;

        const storedData = localStorage.getItem("alumni");
        if (!storedData) return;
        const { user } = JSON.parse(storedData);

        const newMessage = {
            senderId: user.id,
            message: input,
            isGlobal: true,
        };

        socket.emit("sendGlobalMessage", newMessage);
        setInput("");
    };

    function extractTime12Hour(isoString) {
        const date = new Date(isoString);
        date.setMinutes(date.getMinutes() + 330); // Convert UTC to IST (+5:30)

        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    }

    return (
        <div className={`w-full ${isDark ? 'bg-[#131A45]' : 'bg-[#F2F2F2]'}`}>
            <div className={`min-h-screen max-w-[1200px] w-full mx-auto flex gap-3 ${isDark ? 'bg-[#2A3057]' : 'bg-white'} pt-8`}>
                <div className="w-full px-4 lg:px-0 lg:w-[25%] hidden md:block">
                    <Chatusers />
                </div>
                <div className={`max-w-[900px] w-full lg:w-[75%] mx-auto ${isDark ? 'bg-[#2A3057]' : 'bg-white'} shadow-lg rounded-lg h-[600px] flex flex-col md:ml-4`}>
                    {/* Header */}
                    <div className={`flex items-center justify-between py-3 px-4 ${isDark ? 'bg-[#2A3057] text-white' : 'bg-white'} border-b border-[#D9D9D9]`}>
                        <div className="flex items-center space-x-2">
                            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                                <Icon icon="mdi:account-group" className="text-white" width="24" height="24" />
                            </div>
                            <div className={`${isDark ? 'text-white' : 'text-black'} flex flex-col gap-2`}>
                                <p className="font-semibold">Global Chat</p>
                                <p className="text-xs text-gray-500">Chat with all alumni members</p>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className={`flex-1 overflow-y-auto p-4 space-y-2 ${isDark ? 'bg-[#2A3057]' : 'bg-white'}`}>
                        {messages?.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.senderId === localStorage.getItem("alumni")?.user?.id ? "justify-end" : "justify-start"}`}
                            >
                                <div className="flex gap-2">
                                    {msg.senderId !== localStorage.getItem("alumni")?.user?.id && (
                                        <Avatar className="cursor-pointer">
                                            <AvatarImage
                                                className="w-10 h-10 rounded-full"
                                                src={
                                                    memberdata.find(m => m._id === msg.senderId)?.profilePicture
                                                        ? `${url}/uploads/${memberdata.find(m => m._id === msg.senderId)?.profilePicture?.split("\\").pop()}`
                                                        : "/memberpage/member.png"
                                                }
                                                alt="avatar"
                                            />
                                        </Avatar>
                                    )}
                                    <div>
                                        <div
                                            className={`p-2 rounded-lg max-w-xs break-words whitespace-normal ${msg.senderId === localStorage.getItem("alumni")?.user?.id
                                                ? "bg-[#3271FF] text-white"
                                                : isDark
                                                    ? "bg-[#3A4070] text-white"
                                                    : "bg-[#D9D9D9] text-[#797979]"
                                                }`}
                                        >
                                            {msg.message}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {msg.senderId !== localStorage.getItem("alumni")?.user?.id && (
                                                <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                                    {getName(msg.senderId)}
                                                </span>
                                            )}
                                            <span className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                                                {extractTime12Hour(msg?.timestamp)}
                                            </span>
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

export default GlobalChat; 