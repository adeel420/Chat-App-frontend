import React, { useEffect, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoMdAttach, IoMdSend } from "react-icons/io";
import { assets } from "../assets/assets";
import axios from "axios";
import moment from "moment";

const Chats = ({ selectedUser, loginUser }) => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [input, setInput] = useState("");
  const [file, setFile] = useState("");
  const [showBtn, setShowBtn] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setShowBtn(input.trim().length > 0 || file);
  }, [input, file]);

  const handleOpen = () => setOpenEmoji(!openEmoji);

  const handleEmojiClick = (emojiData) => {
    setInput((prev) => prev + emojiData.emoji);
  };

  const handleCreateMsg = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("message", input);
    formData.append("image", file);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/message/${loginUser.id}/${
          selectedUser._id
        }`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setInput("");
      setFile("");
      handleGet(); // Refresh messages after sending
    } catch (err) {
      console.log(err);
    }
  };

  const handleGet = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/message/${loginUser.id}`
      );
      setMessages(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (loginUser?.id) {
      handleGet();
    }
  }, [loginUser]);

  return (
    <>
      {selectedUser ? (
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border border-[#202020] p-4 rounded-[10px] mb-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedUser.profile}
                className="h-[55px] w-[55px] rounded-full cursor-pointer border border-[#7FFFAB]"
                alt="Profile"
              />
              <div className="flex flex-col">
                <h1 className="text-[#FFFFFF] text-[25px] font-medium">
                  {selectedUser.name}
                </h1>
                <p className="text-[#FFFFFF] text-[15px]">Online</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ backgroundImage: `url(${assets.backImg})` }}>
            <div className="flex flex-col gap-3 p-4 rounded-[10px] mb-2 scroll h-[320px] ml-3 overflow-y-auto">
              {messages
                .filter(
                  (msg) =>
                    (msg.sender === loginUser.id &&
                      msg.receiver === selectedUser._id) ||
                    (msg.sender === selectedUser._id &&
                      msg.receiver === loginUser.id)
                )
                .map((message) => (
                  <div
                    key={message._id}
                    className={`${
                      message.sender === loginUser.id
                        ? "self-end bg-[#036825]"
                        : "self-start bg-[#272727]"
                    } p-3 rounded-[10px] w-full max-w-[70%]`}
                  >
                    {/* Message text */}
                    {message.message && <p>{message.message}</p>}

                    {/* Media */}
                    {message.media && (
                      <>
                        {message.media.endsWith(".mp4") ? (
                          <video
                            src={message.media}
                            controls
                            className="h-[300px] w-[300px] mt-2 rounded"
                          />
                        ) : (
                          <img
                            src={message.media}
                            alt="media"
                            className="h-[300px] w-[300px] mt-2 rounded object-cover"
                          />
                        )}
                      </>
                    )}

                    {/* Time */}
                    <p className="text-end text-[12px] text-[#ccc] mt-1">
                      {moment(message.createdAt).fromNow()}
                    </p>
                  </div>
                ))}
            </div>

            {/* Message Form */}
            <div className="relative bg-[#282927] p-3 rounded-[10px] ml-3">
              {/* Emoji Picker */}
              {openEmoji && (
                <div className="absolute bottom-16 left-4 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              {/* Selected File Preview */}
              {file && (
                <div className="absolute bottom-16 bg-[#00000085] w-full left-0 flex justify-center z-10">
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      className="h-[330px] w-[400px] object-cover"
                      alt="preview"
                    />
                  ) : file.type.startsWith("video/") ? (
                    <video
                      src={URL.createObjectURL(file)}
                      controls
                      className="h-[330px] w-[400px] object-cover"
                    />
                  ) : null}
                </div>
              )}

              {/* Form */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleOpen}
                  className="text-[#7FFFAB] text-[26px] cursor-pointer"
                >
                  <BsEmojiSmile />
                </button>
                <label className="text-[#7FFFAB] text-[26px] cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    hidden
                  />
                  <IoMdAttach />
                </label>
                <form
                  className="w-full flex items-center bg-[#3C3C3C] py-2 rounded-[5px]"
                  onSubmit={handleCreateMsg}
                >
                  <input
                    type="text"
                    placeholder="Type your message here"
                    className="text-white px-4 outline-none w-[93%]"
                    onChange={(e) => setInput(e.target.value)}
                    value={input}
                  />
                  {showBtn && (
                    <button
                      type="submit"
                      className="text-[#7FFFAB] text-[26px] cursor-pointer"
                    >
                      <IoMdSend />
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // No selected user UI
        <div className="flex flex-col gap-3 justify-center items-center h-full">
          <img
            src={assets.logo}
            className="bg-[#1B1B1B] p-[10px] rounded-full h-[55px] w-[55px]"
            alt="Logo"
          />
          <h1 className="text-[#99FFAF] text-5xl font-medium text-center">
            CHATBOOTH
          </h1>
          <p className="text-[gray] font-[italic]">
            Smart. Secure. Seamless. Welcome to Better Chatting.
          </p>
        </div>
      )}
    </>
  );
};

export default Chats;
