import { Icon } from "@iconify/react";
import React from "react";

const events = [
  {
    id: 1,
    title: "Annual Alumni Meet 2025",
    date: "March 15, 2025",
    location: "Rimcollian Hall, Kolkata",
    description:
      "Reconnect with your batchmates and relive cherished memories at our annual meet. Join us for an evening filled with nostalgia, laughter, and networking opportunities.",
    buttonText: "RSVP Now",
    imageUrl: "/events/events.jfif",
  },
  {
    id: 2,
    title: "Virtual Career Development Workshop",
    date: "April 10, 2025",
    location: "Online (Zoom)",
    description:
      "Enhance your professional skills with guidance from expert alumni. Participate in interactive sessions, mentorship discussions, and Q&A segments to boost your career trajectory.",
    buttonText: "Register",
    imageUrl: "/events/events.jfif",
  },
];

const EventCards = () => {
  return (
    <div className="min-h-screen max-w-[1200px] w-full mx-auto  pt-8 px-4 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
      <div className="flex w-full flex-wrap justify-start gap-6 mb-10">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white p-4 max-w-[380px] shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-48 object-cover"
            />
            <div className="pt-2">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {event.title}
              </h3>
              <div className="flex justify-between items-start mb-2">
                <div className="flex  flex-col items-start text-[#797979] gap-1 text-sm ">
                  <div className="mr-4 flex items-center gap-1">
                    <Icon icon="oui:token-date" width="20" height="20" />{" "}
                    {event.date}
                  </div>
                  <div className="mr-4 flex items-center gap-1">
                    <Icon
                      icon="mingcute:location-line"
                      width="20"
                      height="20"
                    />
                    {event.location}
                  </div>
                </div>
                <button className="border border-[#C7A006] text-sm rounded-lg w-24 p-1">
                  {event.buttonText}
                </button>
              </div>
              <p className="text-[#797979] text-sm">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCards;
