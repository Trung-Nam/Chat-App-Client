import { useEffect, useState } from 'react'
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { FiArrowUpLeft } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { NavLink } from 'react-router-dom';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import Divider from './Divider';
import SearchUser from './SearchUser';
import { FaImage, FaVideo } from 'react-icons/fa6';
const Sidebar = () => {
  const user = useSelector(state => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(state => state?.user?.socketConnection);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('sidebar', user._id);

      socketConnection.on('conversation', (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            }
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.receiver
            }
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender
            }
          }

        })
        setAllUsers(conversationUserData);
      })
    }

  }, [socketConnection, user])


  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink className={({ isActive }) => `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${isActive && "bg-slate-200"}`} title='chat'>
            <IoChatbubbleEllipses
              size={25}
            />
          </NavLink>


          <div onClick={() => setOpenSearchUser(true)} className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded" title='add friend'>
            <FaUserPlus size={25} />
          </div>
        </div>


        <div className="flex flex-col items-center">
          <button className='mx-auto' title={user?.name} onClick={() => setEditUserOpen(true)}>
            <Avatar
              width={30}
              height={30}
              name={user?.name}
              imgUrl={user?.profile_pic}
              userId={user?._id}
            />

          </button>
          <button title="logout" className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded">
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>


      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800 h-16 ">Message</h2>
        </div>

        <Divider />

        <div className="h-[calc(100vh-75px)] overflow-x-hidden overflow-y-auto scrollbar">
          {
            allUsers.length === 0 && (
              <div className='mt-12'>
                <div className="flex justify-center items-center my-4 text-slate-500">
                  <FiArrowUpLeft size={50} />
                </div>
                <p className="text-lg text-center text-slate-400">Explore users to start a conversation with.</p>
              </div>
            )
          }

          {
            allUsers?.map((conversation) => (
              <NavLink to={`/${conversation?.userDetails?._id}`} key={conversation?._id} className='flex items-center gap-2 p-2 border border-transparent rounded hover:bg-slate-200 cursor-pointer'>
                <div>
                  <Avatar
                    imgUrl={conversation?.userDetails?.profile_pic}
                    name={conversation?.userDetails?.name}
                    height={40}
                    width={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">{conversation?.userDetails?.name}</h3>
                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {
                        conversation?.lastMsg?.imageUrl && (
                          <div className="flex items-center gap-1">
                            <span><FaImage /></span>
                            {!conversation?.lastMsg?.text && <span>Image</span>}
                          </div>
                        )
                      }
                      {
                        conversation?.lastMsg?.videoUrl && (
                          <div className="flex items-center gap-1">
                            <span><FaVideo /></span>
                            {!conversation?.lastMsg?.text && <span>Video</span>}
                          </div>
                        )
                      }
                    </div>
                    <p>{conversation?.lastMsg?.text}</p>
                  </div>
                </div>
                <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white rounded-full">{conversation?.unseenMsg}</p>
              </NavLink>
            ))
          }
        </div>
      </div>

      {/* Edit user details */}

      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}


      {/* Search user */}

      {
        openSearchUser && (
          <SearchUser onClose={() => setOpenSearchUser(false)} />
        )
      }
    </div>
  )
}

export default Sidebar