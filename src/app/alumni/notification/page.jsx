import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icon } from "@iconify/react";
const alumniUpdates = [
  {
    text: "Reconnect with your batchmates! Join the upcoming alumni reunion on March 15th. Register now!",
    date: "March 1, 2023",
  },
  {
    text: "Event Reminder: The alumni networking session is happening tomorrow at 6 PM. Don’t miss out!",
    date: "February 26, 2023",
  },
  {
    text: "New message received! Someone has sent you a message. Check your inbox now.",
    date: "April 25, 2022",
  },
  {
    text: "Read about an inspiring journey of one of our alumni making a global impact.",
    date: "March 6, 2022",
  },
  {
    text: "Update your profile! Keep your details up-to-date to stay connected with your alumni network.",
    date: "March 1, 2022",
  },
];
const page = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-8 px-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4">Notifications</h2>
        <div className="flex flex-col gap-3 ">
          {alumniUpdates.map((val, index) => {
            return (
              <div key={index}>
                <div className="flex justify-between py-2">
                  <div>
                    <p className="text-[#131A45] font-semibold max-w-md">
                      {val.text}
                    </p>
                    <p className="text-[#717171] text-xs">{val.date}</p>
                  </div>
                  <Icon icon="basil:cross-solid" width="24" height="24" />
                </div>
                <hr className="bg-gray-300 mt-1 h-[2px]" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
