import React from "react";

export default function ContactForm() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center relative">
      {/* Background Image Section */}

      <div
        className="absolute top-0 left-0 w-full h-[160px] md:h-[288px] bg-cover bg-center "
        style={{ backgroundImage: 'url("/about/pic1.png")' }}
      ></div>

      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl z-10 mt-20  m-4 ">
        {/* Heading Section */}
        <div className=" mb-8">
          <h2 className="font-bold text-3xl  tracking-[-0.02em] text-custom-blue">
            Feel free to get in touch with us!
          </h2>
          <p className="text-[#797979] mt-4">
            If you have any questions, feedback, or need assistance, feel free
            to reach out using the form below or through our contact details.
          </p>
        </div>

        {/* Form Section */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name Input */}

          <div className="col-span-2 md:col-span-1">
            <input
              type="text"
              id="fullName"
              className="w-full custom-input"
              placeholder="Enter your full name"
            />
          </div>

          {/* Subject Input */}
          <div className="col-span-2 md:col-span-1">
            <input
              type="text"
              id="subject"
              className="w-full custom-input"
              placeholder="Enter the subject"
            />
          </div>

          {/* Email Input */}
          <div className="col-span-2">
            <input
              type="email"
              id="email"
              className="w-full custom-input"
              placeholder="Enter your email address"
            />
          </div>

          {/* Message Input */}
          <div className="col-span-2">
            <textarea
              id="message"
              rows="4"
              className="w-full custom-input"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-[#131A45] text-center hover:bg-[#1a2154] text-white text-sm font-bold py-3 w-[150px] px-10 rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
