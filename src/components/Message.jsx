import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi"
const Message = () => {
  const params = useParams();
  const socketConnection = useSelector(state => state?.user?.socketConnection);
  const user = useSelector(state => state?.user);
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



  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center justify-center gap-4">
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
    </div>
  )
}

export default Message