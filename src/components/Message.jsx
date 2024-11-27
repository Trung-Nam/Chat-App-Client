import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom"
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi"
import { IoClose } from "react-icons/io5"
import { FaAngleLeft, FaImage, FaPlus, FaVideo } from "react-icons/fa6";
import uploadFile from "../utils/uploadFile";
import Loading from "./Loading";
const Message = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imgUrl: "",
    videoUrl: ""
  });
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit('message-page', params?.userId);

      socketConnection.on('message-user', (data) => {
        setDataUser(data);
      })
    }
  }, [params?.userId, socketConnection, user])

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        imgUrl: uploadPhoto?.url
      }
    })
  }

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: uploadPhoto?.url
      }
    })
  }

  const handleClearUploadImage = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imgUrl: ""
      }
    })
  }
  const handleClearUploadVideo = () => {
    setMessage((prev) => {
      return {
        ...prev,
        videoUrl: ""
      }
    })
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

        {/* Upload image display */}
        {
          message?.imgUrl && (
            <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
              <div onClick={handleClearUploadImage} className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-primary text-white">
                <IoClose size={25} />
              </div>
              <div className="bg-white p-3">
                <img
                  src={message?.imgUrl}
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
            <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
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
            <div className="w-full h-full flex justify-center items-center">
              <Loading />
            </div>
          )
        }

        Show all messages
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
      </section>
    </div>
  )
}

export default Message