/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { IoClose, IoSearchOutline } from 'react-icons/io5'
import Loading from './Loading';
import SearchUserCard from './SearchUserCard';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';

const SearchUser = ({onClose}) => {
    const [searchUsers, setSearchUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");


    const handleSearchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.post("/search-user", {
                search: search
            })
            setLoading(false);

            setSearchUsers(response?.data?.data);
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        handleSearchUsers();
    }, [search])


    console.log(searchUsers);
    

    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2 z-10'>
            <div className='w-full max-w-lg mx-auto mt-10'>
                {/* Input search */}
                <div className='bg-white rounded h-14 overflow-hidden flex'>
                    <input
                        type="text"
                        placeholder='Search user by name, email...'
                        className='w-full outline-none py-1 h-full px-4'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className='h-14 w-14 flex justify-center items-center'>
                        <IoSearchOutline size={25} />
                    </div>
                </div>

                {/* Display search users */}
                <div className='bg-white mt-2 w-full p-4 rounded'>
                    {/* No user found */}
                    {
                        searchUsers.length === 0 && !loading && (
                            <p className='text-center text-slate-500'>No user found!</p>
                        )
                    }

                    {
                        loading && (
                            <div className='flex justify-center items-center'>
                                <Loading />
                            </div>
                        )
                    }

                    {
                        searchUsers.length !== 0 && (
                            searchUsers?.map((user) => (
                                <SearchUserCard key={user._id} user={user} onClose={onClose}/>
                            ))
                        )
                    }
                </div>
            </div>

            <div onClick={onClose} className="absolute top-0 right-0 text-2xl p-2 lg:text-4xl text-white hover:text-primary">
                <button>
                    <IoClose/>
                </button>
            </div>

        </div>
    )
}

export default SearchUser