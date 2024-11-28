import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi"
import { IoClose } from "react-icons/io5"
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa6";
import uploadFile from "../utils/uploadFile";
import Loading from "./Loading";
import { IoSend } from "react-icons/io5";
import moment from "moment";
const Message = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const currentMessage = useRef(null);

  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: ""
  })

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: ""
  })


  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [allMessages])



  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params?.userId);

      socketConnection.emit('seen', params?.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      })

      socketConnection.on('message', (data) => {
        // console.log(data);
        setAllMessages(data);

      })


    }
  }, [params?.userId, socketConnection, user])

  const handleUploadImage = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(prev => {
      return {
        ...prev,
        imageUrl: uploadPhoto.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage(prev => {
      return {
        ...prev,
        imageUrl: ""
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]

    setLoading(true)
    const uploadPhoto = await uploadFile(file)
    setLoading(false)
    setOpenImageVideoUpload(false)

    setMessage(prev => {
      return {
        ...prev,
        videoUrl: uploadPhoto.url
      }
    })
  }
  const handleClearUploadVideo = () => {
    setMessage(prev => {
      return {
        ...prev,
        videoUrl: ""
      }
    })
  }


  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((prev) => {
      return {
        ...prev,
        text: value
      }
    })

  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: ""
        })
      }
    }
  }

  return (
    <div style={{ backgroundImage: "url(/assets/wallapaper.jpeg)" }} className="bg-no-repeat bg-cover">
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center justify-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>

          <div>
            <Avatar
              width={45}
              height={45}
              imgUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg text-ellipsis line-clamp-1">{dataUser?.name}</h3>
            <p className="text-sm">{dataUser?.online ? <span className="text-green-500">Online</span> : <span className="text-slate-400">Offline</span>}</p>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-primary">
            <HiDotsVertical
              size={20}
            />
          </button>
        </div>
      </header>

      {/* Show all message */}
      <div className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">

        {/* All message show here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {
            allMessages?.map((msg, index) => (
              <div key={index} className={`p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${user?._id === msg?.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                <div className="w-full">
                  {
                    msg?.imageUrl && (
                      <img
                        src={msg?.imageUrl}
                        className='w-full h-full object-scale-down'
                      />
                    )
                  }
                  {
                    msg?.videoUrl && (
                      <video
                        src={msg?.videoUrl}
                        className='w-full h-full object-scale-down'
                        controls
                      />
                    )
                  }
                </div>
                <p className="px-2">{msg.text}</p>
                <p className="text-sm ml-auto w-fit">{moment(msg.createdAt).format('hh:mm')}</p>
              </div>
            )
            )
          }
        </div>


        {/* Upload image display */}
        {
          message?.imageUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div onClick={handleClearUploadImage} className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary text-white">
                <IoClose size={25} />
              </div>
              <div className="bg-white p-3">
                <img
                  src={message?.imageUrl}
                  alt="uploadImage"
                  className="aspect-square  w-full h-full max-w-sm m-2 object-scale-down"
                />
              </div>
            </div>
          )
        }
        {/* Upload video display */}
        {
          message?.videoUrl && (
            <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div onClick={handleClearUploadVideo} className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary text-white">
                <IoClose size={25} />
              </div>
              <div className="bg-white p-3">
                <video
                  src={message?.videoUrl}
                  className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                  controls
                  muted
                  autoPlay
                />
              </div>
            </div>
          )
        }

        {
          loading && (
            <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
              <Loading />
            </div>
          )
        }
      </div>

      {/* Send message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button onClick={() => setOpenImageVideoUpload(!openImageVideoUpload)} className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-primary hover:text-white">
            <FaPlus size={20} />
          </button>

          {/* Video and image */}
          {
            openImageVideoUpload && (
              <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
                <form>
                  <label htmlFor="uploadImage" className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer">
                    <div className="text-primary">
                      <FaImage />
                    </div>
                    <p>Image</p>
                  </label>

                  <label htmlFor="uploadVideo" className="flex items-center p-2 px-3 gap-3 hover:bg-slate-200 cursor-pointer">
                    <div className="text-purple-500">
                      <FaVideo />
                    </div>
                    <p>Video</p>
                  </label>

                  <input
                    type="file"
                    id="uploadImage"
                    onChange={handleUploadImage}
                    className="hidden"
                  />
                  <input
                    type="file"
                    id="uploadVideo"
                    onChange={handleUploadVideo}
                    className="hidden"
                  />

                </form>
              </div>
            )
          }
        </div>

        {/* Input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type here message..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message?.text}
            onChange={handleOnChange}
          />
          <button className="text-primary hover:text-secondary">
            <IoSend size={25} />
          </button>
        </form>

      </section>
    </div>
  )
}

export default Message