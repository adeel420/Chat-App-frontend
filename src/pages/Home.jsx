import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { headerLists } from "../data/data";
import Chats from "../components/Chats";
import { FaUser } from "react-icons/fa";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdOutlineLogout } from "react-icons/md";
import { Button, Modal } from "antd";
import axios from "axios";
import { handleSuccess } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState("");
  const [requestedUser, setRequestedUser] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [lastMessage, setLastMessage] = useState({});

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    handleSuccess("Logout Successful");
    localStorage.removeItem("token");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleClick = (id) => {
    setSelectedUser(id);
  };

  const handleOpenDetails = () => {
    setOpenDetails(!openDetails);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/user/login-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoginUser(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAllWithoutLogin = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/user/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredItems = users.filter((item) =>
    item.name.toLowerCase().includes(input.toLowerCase())
  );

  const handleFriend = async (id) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_API}/friend/${loginUser.id}/${id}`
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleGetRequestedUser = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/friend/${loginUser.id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setUserFriends(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleLogin();
    handleAllWithoutLogin();
  }, []);

  useEffect(() => {
    if (loginUser && loginUser.id) {
      handleGetRequestedUser();
    }
  }, [loginUser]);

  const handleGet = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER_API}/message/${loginUser.id}`
      );
      setLastMessage(response.data.slice(-1));
      console.log("last msg", response.data.slice(-1).message);
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
    <div
      className="flex bg-[#090909] h-[90vh] mt-8 ml-8 mr-8 p-4 rounded-[10px] 
        overflow-y-auto 
        md:h-[90vh] md:mt-8 md:ml-8 md:mr-8 
        sm:mt-4 sm:ml-4 sm:mr-4 sm:h-screen"
    >
      {/* Users container */}
      <div className="w-full md:w-[40%]">
        {/* Header */}
        <div className="flex items-center justify-between border border-[#202020] p-4 rounded-[10px] ">
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              className="bg-[#1B1B1B] p-[10px] rounded-full h-[55px] w-[55px] "
              alt="Logo"
            />
            <h1 className="text-[#99FFAF] text-[20px] font-medium ">
              CHATBOOTH
            </h1>
          </div>
          <img
            src={loginUser.image}
            className="h-[55px] w-[55px] rounded-full cursor-pointer border border-[#7FFFAB] border-2 "
            alt="Profile"
            onClick={handleOpenDetails}
          />
          <div
            className="absolute left-[25%] top-[22%] bg-[#151515] shadow-2xl p-4 "
            style={{ display: openDetails ? "block" : "none" }}
          >
            {headerLists.map((data) => (
              <li
                onClick={() => {
                  showModal();
                  setSelectedLink(data.id);
                  if (data.id === 2) handleLogout();
                }}
                key={data.id}
                className="bg-[transparent] flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-[gray]"
              >
                <data.logo /> {data.title}
              </li>
            ))}
          </div>
        </div>
        {selectedLink === 0 && (
          <Modal
            title="Profile"
            className="text-center"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <form className="flex flex-col gap-2 mt-3 ">
              <p className="font-semibold text-start">Name:</p>
              <input
                type="text"
                disabled
                className="border border-[gray] text-[gray] rounded outline-0 w-full p-1"
                value={loginUser.name}
              />
              <p className="font-semibold text-start">Email:</p>
              <input
                type="email"
                value={loginUser.email}
                disabled
                className="border border-[gray] text-[gray] rounded outline-0 w-full p-1"
              />
              <p className="font-semibold text-start">Password:</p>
              <input
                type="password"
                className="border border-[gray] rounded outline-0 w-full p-1"
                placeholder="Change Password"
              />
            </form>
          </Modal>
        )}

        {selectedLink === 1 && (
          <Modal
            title="Add Request"
            className="text-center"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <div className="flex items-center gap-3">
              <img
                src={loginUser.image}
                className="h-[45px] w-[45px] rounded-full cursor-pointer border border-[#7FFFAB] border-2 "
                alt="Profile"
              />
              <h1 className="text-[black] text-[20px] font-medium ">
                {loginUser.name}
              </h1>
            </div>
            <form className="flex flex-col gap-2 mt-5 ">
              <input
                type="text"
                className="border border-[gray] rounded outline-0 w-full p-1"
                placeholder="Search User for Request"
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </form>

            {/* All Users */}
            <div className="scroll mt-6 flex flex-col gap-2 pr-2 h-[200px] ">
              {filteredItems && filteredItems.length ? (
                filteredItems.map((user) => (
                  <div
                    className="flex justify-between items-center"
                    key={user._id}
                    onClick={() => setRequestedUser(user._id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profile}
                        className="h-[45px] w-[45px] rounded-full cursor-pointer border border-[#7FFFAB] border-2 "
                        alt="Profile"
                      />
                      <h1 className="text-[black] text-[18px] font-medium ">
                        {user.name}
                      </h1>
                    </div>
                    <button
                      className="bg-[#090909] text-white cursor-pointer h-[25px] w-[25px] rounded-full text-[18px] flex items-center justify-center font-bold "
                      onClick={() => handleFriend(user._id)}
                    >
                      <IoIosAdd />
                    </button>
                  </div>
                ))
              ) : (
                <h3>No user here...</h3>
              )}
            </div>
          </Modal>
        )}

        {/* Users List */}
        <div className="">
          <div className="scroll mt-3 flex flex-col gap-3 pr-4 max-h-[70vh] overflow-y-auto">
            {userFriends && userFriends.length ? (
              userFriends.map((user) => (
                <div
                  className="bg-[#141414] flex items-center gap-4 p-3 rounded-[10px] cursor-pointer hover:bg-[#373737] "
                  key={user._id}
                  onClick={() => handleClick(user.friend)}
                >
                  <img
                    src={user.friend.profile}
                    className="h-[55px] w-[55px] rounded-full"
                    alt="User"
                  />

                  {/* Text */}
                  <div className="w-[75%] ">
                    <h1 className="text-[20px] text-[#7FFFAB] ">
                      {user.friend.name}
                    </h1>
                    <p className="text-[#FFFFFF] text-[12px] ">
                      {lastMessage.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <h3 className="text-center text-[gray] ">No user here...</h3>
            )}
          </div>
        </div>
      </div>

      {/* Chats */}
      <div className="w-full md:w-[60%]">
        <Chats selectedUser={selectedUser} loginUser={loginUser} />
      </div>
    </div>
  );
};

export default Home;
