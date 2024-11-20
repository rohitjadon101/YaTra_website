import React, { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlArrowDown } from "react-icons/sl";
const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const adminEmail = import.meta.env.VITE_AdminEmail;

function ProfilePage(){
    const user = cookies.get('user');
    const [likedPlaces, setLikedPlaces] = useState([]);
    const [savedPlaces, setSavedPlaces] = useState([]);

    useEffect(() => {
        const token = cookies.get('token');
        if (!token) {
            window.location.href = '/login';
        }

        const getPlaces = async () => {
            const res = await fetch(`${backendUrl}/api/places/likedSavedPlaces/${user._id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (res.ok) {
                const data = await res.json();
                setLikedPlaces(data.likedPlaces);
                setSavedPlaces(data.savedPlaces);
            } else {
                console.error("Unable to fetch Liked and Saved Places");
            }
        };
        getPlaces();
    }, []);

    const handleLogout = () => {
        Swal.fire({
            icon: 'warning',
            title: 'Logout',
            text: 'Are you sure?',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            background: '#1f1f1f'
        }).then((result) => {
            if (result.isConfirmed) {
                toast.success("Logged Out Successfully", {
                    onClose: () => {
                        cookies.remove('token');
                        cookies.remove('user');
                        window.location.href = '/';
                    },
                    autoClose: 1500,
                    position: 'bottom-right',
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: 'colored'
                });
            }
        });
    };

    const [likeOpen, setLikeOpen] = useState(false);
    const [saveOpen, setSaveOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-300 text-white font-sans">
            {user.email === adminEmail ? (
                // Admin Div
                <div className="p-2 sm:p-5">
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full lg:w-1/2 md:w-3/5">
                            <img src={user.profileImage} className="w-20 h-20 object-cover rounded-full mx-auto" />
                            <h1 className="sm:text-3xl text-xl text-zinc-800 font-bold text-center mb-2">{user.username}</h1>
                            <p className="text-center text-zinc-500 mb-4">Welcome back to your Admin Dashboard!</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <a href="/" className="text-blue-600 hover:text-blue-800 hover:scale-105">Home</a>
                                <a href="/editProfile" className="text-gray-600 hover:text-gray-800 hover:scale-105">Edit</a>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:scale-105">Logout</button>
                            </div>
                            <div className="flex justify-center gap-4 mt-6">
                                <a href="/addPlace" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Add New Place</a>
                                <a href="/addCategory" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">Add New Category</a>
                            </div>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            ) : (
                // User Div
                <div className="p-2 sm:p-5">
                    <div className="flex flex-col items-center">
                        <div className="bg-gray-200 p-8 rounded-lg shadow-lg w-full lg:w-1/2 md:w-3/5">
                            <img src={user.profileImage} className="w-20 h-20 object-cover rounded-full mx-auto" />
                            <h1 className="sm:text-3xl text-xl text-zinc-800 font-bold text-center mb-2">{user.username}</h1>
                            <p className="text-center text-zinc-500 mb-4">Welcome back to your Dashboard!</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <a href="/" className="text-blue-600 hover:text-blue-800 hover:scale-105">Home</a>
                                <button onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:scale-105">Logout</button>
                            </div>
                        </div>

                        {/* Liked Places */}
                        <div className="mt-8 w-full md:w-3/4">
                            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-md cursor-pointer" onClick={() => setLikeOpen(!likeOpen)}>
                                <SlArrowDown className={`transition-transform ${likeOpen ? 'rotate-180' : ''}`} />
                                <p className="text-xl font-semibold">Liked Places</p>
                            </div>
                            {likeOpen && (
                                <div className="border-t border-gray-300 pt-4 space-y-4 transition-all duration-300">
                                    {likedPlaces.length > 0 ? (
                                        likedPlaces.map(place => (
                                            <div key={place._id} className="flex gap-4 bg-gray-100 rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200">
                                                <img src={place.img1} alt={place.title1} className="w-32 h-20 object-cover rounded-md" />
                                                <div>
                                                    <h1 className="text-lg font-bold text-gray-800">{place.title1}</h1>
                                                    <p className="text-sm text-gray-600">{place.title2}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No liked places found.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Saved Places */}
                        <div className="mt-8 w-full md:w-3/4">
                            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-md cursor-pointer" onClick={() => setSaveOpen(!saveOpen)}>
                                <SlArrowDown className={`transition-transform ${saveOpen ? 'rotate-180' : ''}`} />
                                <p className="text-xl font-semibold">Saved Places</p>
                            </div>
                            {saveOpen && (
                                <div className="border-t border-gray-300 pt-4 space-y-4 transition-all duration-300">
                                    {savedPlaces.length > 0 ? (
                                        savedPlaces.map(place => (
                                            <div key={place._id} className="flex gap-4 bg-gray-100 rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-200">
                                                <img src={place.img1} alt={place.title1} className="w-32 h-20 object-cover rounded-md" />
                                                <div>
                                                    <h1 className="text-lg font-bold text-gray-800">{place.title1}</h1>
                                                    <p className="text-sm text-gray-600">{place.title2}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No saved places found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            )}
        </div>
    );
}

export default ProfilePage;