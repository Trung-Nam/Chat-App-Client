/* eslint-disable react/prop-types */
import { PiUserCircle } from 'react-icons/pi'
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, email, imgUrl, width, height }) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser);


    let avatarName = "";

    if (name) {
        const splitName = name?.split(" ");

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0];
        }
    }


    const bgColors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-teal-500",
        "bg-orange-500",
    ];

    const randomNumber = Math.floor(Math.random() * bgColors.length);

    const isOnline = onlineUser.includes(userId);
    return (
        <div
            className={`text-slate-500 rounded-full font-bold relative`}
            style={{ width: width + "px", height: height + "px" }}
        >
            {
                imgUrl ? (
                    <img
                        src={imgUrl}
                        alt={name}
                        width={width}
                        height={height}
                        className='overflow-hidden rounded-full'
                    />
                ) : (
                    name ? (
                        <div
                            style={{ width: width + "px", height: height + "px" }}
                            className={`overflow-hidden rounded-full flex justify-center items-center text-white text-xl ${bgColors[randomNumber]}`}>
                            {avatarName}
                        </div>
                    ) : (

                        <PiUserCircle
                            size={width}
                        />

                    )
                )
            }
            {
                isOnline && (
                    <span className="bg-green-600 p-1 absolute bottom-1 right-1 z-10 rounded-full"></span>
                )
            }
        </div>
    )
}

export default Avatar