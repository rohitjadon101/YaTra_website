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
                    autoClose: 1000,
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

    // For Removing Saved Place
    const handleRemoveFromSave = async (placeID) => {
        Swal.fire({
            icon: 'warning',
            title: 'Remove Saved Place',
            text: 'Are you sure you want to remove this place?',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await fetch(`${backendUrl}/api/places/RemoveSavedPlace/${placeID}`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${cookies.get('token')}`
                        },
                        body: JSON.stringify({userID: user._id})
                    });
                    if(res.ok){
                        toast.success("place removed successfully", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
                        setSavedPlaces(prev => prev.filter(place => place._id !== placeID));
                    }
                    else{
                        const data = await res.json();
                        toast.error(data.message, {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
                    }
                } catch (error) {
                    toast.error("Network Error:", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
                }
            }
        });
    };

    // For Rendering liked or saved Place when clicked 
    const handleClickOnPlace = (placeName) => {
        cookies.set('searchedPlace', placeName);
        window.location.href = '/searchedPlace';
    }

    // For Fetching the places added by user
    const [contribution, setContribution] = useState(false);

    const [addedPlace, setAddedPlace] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/placeAddedByUser/${user._id}`)
        .then((res) => res.json())
        .then((data) => setAddedPlace(data))
        .catch((err) => console.error("Network Error:", err))
    });

    // For Fetching all the contributed places for admin page
    const [addedByUser, setAddedByUser] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/addedPlace/adminPage`)
        .then((res) => res.json())
        .then((data) => setAddedByUser(data))
        .catch((err) => console.error("Network Error:", err))
    });

    // When Admin Accepted the place contributed by user
    const handleAccept = (placeID) => {
        fetch(`${backendUrl}/api/places/addedPlace/${placeID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        })
        .then((res) => {
            if(res.ok){
                toast.success("place added successfully", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
            }
            else{
                toast.error("something went wrong", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
            }
        })
        .catch((err) => {
            console.log("Server Issue : ", err);
            toast.error("Network Error:", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
        })
    };

    // When Admin Accepted the place contributed by user
    const handleReject = (placeID) => {
        fetch(`${backendUrl}/api/places/addedPlace/rejected/${placeID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify()
        })
        .then((res) => {
            if(res.ok){
                toast.success("place removed successfully", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
            }
            else{
                toast.error("something went wrong", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
            }
        })
        .catch((err) => {
            console.log("Server Issue : ", err);
            toast.error("Network Error:", {autoClose: 1500, position: 'bottom-right', closeOnClick: true, pauseOnHover: false, theme: 'colored'});
        })
    };

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

                    <div className="flex flex-col items-center">
                        {/* Contribution Box */}
                        <div className="mt-8 w-full md:w-3/4">
                            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-t-md cursor-pointer" onClick={() => setContribution(!contribution)}>
                                <SlArrowDown className={`transition-transform ${contribution ? 'rotate-180' : ''}`} />
                                <p className="text-xl font-semibold">Contribution</p>
                            </div>

                            {contribution && (
                                <div className="bg-gray-800 pl-10">
                                    <h1 className="border-b-2 border-gray-400 font-semibold text-gray-400">Places added by users</h1>

                                    {addedByUser.length > 0 ? (
                                        addedByUser.map((place) => (
                                            <section key={place._id} className="py-10">
                                                <div className="flex justify-evenly">
                                                    <div>
                                                        <label className="text-gray-400 leading-3 text-sm">Name</label>
                                                        <h1 className="text-xl font-semibold leading-3 mb-4">{place.title1}</h1>

                                                        <label className="text-gray-400 leading-3 text-sm">Address</label>
                                                        <h1 className="font-semibold leading-3 mb-4">{place.title2}</h1>

                                                        <label className="text-gray-400 leading-3 text-sm">Category</label>
                                                        <h1 className="font-semibold leading-3 mb-4">{place.category}</h1>
                                                    </div>
                                                    <div className="w-60 h-36 overflow-hidden rounded-md">
                                                        <img src={place.img1} className="w-full h-full object-cover"/>
                                                    </div>
                                                </div>
                                                <div className="px-20 mt-4">{place.content}</div>
                                                <div className="px-20 pt-4 py-2 flex items-center gap-4">
                                                    <button onClick={() => handleAccept(place._id)} className="px-4 py-1 font-bold bg-green-600 hover:bg-green-700 rounded-lg">Accept</button>
                                                    <button onClick={() => handleReject(place._id)} className="px-4 py-1 font-bold bg-red-600 hover:bg-red-700 rounded-lg">Reject</button>
                                                </div>
                                                <div className="mt-4 w-full h-[2px] rounded-md bg-gray-600"></div>
                                            </section>
                                        ))
                                    ) : (
                                        <div className="p-5 text-gray-200 font-semibold">No contribution from user</div>
                                    )}
                                </div>
                            )}
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
                                                <div className="sm:w-40 sm:h-20 w-20 h-12 overflow-hidden">
                                                    <img src={place.img1} alt={place.title1} className="w-full h-full object-cover rounded-md" />
                                                </div>
                                                <div onClick={() => handleClickOnPlace(place.title1)} className="hover:cursor-pointer">
                                                    <h1 className="sm:text-lg font-bold text-gray-800">{place.title1}</h1>
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
                                                <div className="sm:w-40 sm:h-20 w-28 h-12 overflow-hidden">
                                                    <img src={place.img1} alt={place.title1} className="w-full h-full object-cover rounded-md" />
                                                </div>
                                                <div className="w-full flex justify-between">
                                                    <div onClick={() => handleClickOnPlace(place.title1)} className="hover:cursor-pointer">
                                                        <h1 className="sm:text-lg font-bold text-gray-800">{place.title1}</h1>
                                                        <p className="text-sm text-gray-600">{place.title2}</p>
                                                    </div>
                                                    <div onClick={() => handleRemoveFromSave(place._id)} className="text-xs sm:text-sm text-red-600 font-bold cursor-pointer hover:scale-105">Remove</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No saved places found.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Contribution */}
                        <div className="mt-8 w-full md:w-3/4">
                            <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-t-md cursor-pointer" onClick={() => setContribution(!contribution)}>
                                <SlArrowDown className={`transition-transform ${contribution ? 'rotate-180' : ''}`} />
                                <p className="text-xl font-semibold">Contribution</p>
                            </div>

                            {contribution && (
                                <div className="bg-gray-800 pl-10">
                                    <a href="/addPlace" className="px-4 py-2 bg-gray-600 hover:bg-gray-700 font-bold cursor-pointer rounded-lg ">add Place</a>
                                    <div className="mt-4">
                                        <h1 className="font-semibold text-gray-400">Places added by you</h1>
                                        <p className="text-xs text-gray-400 border-b-2 border-gray-400">(places REJECTED by admin will no longer be displayed here)</p>

                                        {addedPlace.length > 0 ? (
                                            addedPlace.map((place) => (
                                                <section key={place._id} className="py-10">
                                                    <div className="flex justify-evenly">
                                                        <div>
                                                            <label className="text-gray-400 leading-3 text-sm">Name</label>
                                                            <h1 className="text-xl font-semibold leading-3 mb-4">{place.title1}</h1>

                                                            <label className="text-gray-400 leading-3 text-sm">Address</label>
                                                            <h1 className="font-semibold leading-3 mb-4">{place.title2}</h1>

                                                            <label className="text-gray-400 leading-3 text-sm">Category</label>
                                                            <h1 className="font-semibold leading-3 mb-4">{place.category}</h1>
                                                        </div>
                                                        <div className="w-60 h-36 overflow-hidden rounded-md">
                                                            <img src={place.img1} className="w-full h-full object-cover"/>
                                                        </div>
                                                    </div>
                                                    <div className="px-20 mt-4">{place.content}</div>
                                                    <div className="px-20 py-2">
                                                        <label className="text-gray-400 leading-3 text-sm">status</label>
                                                        <h1 className="leading-3 text-gray-300">{place.status}</h1>
                                                    </div>
                                                    <div className="mt-4 w-full h-[2px] rounded-md bg-gray-600"></div>
                                                </section>
                                            ))
                                        ) : (
                                            <div className="p-5 text-gray-200 font-semibold">No place added by you</div>
                                        )}

                                        {/*<section className="py-10">
                                            <div className="flex justify-evenly">
                                                <div>
                                                    <label className="text-gray-400 leading-3 text-sm">Name</label>
                                                    <h1 className="text-xl font-semibold leading-3 mb-4">Ramanathaswamy Temple</h1>

                                                    <label className="text-gray-400 leading-3 text-sm">Address</label>
                                                    <h1 className="text-lg font-semibold leading-3 mb-4">Tamil Nadu, India</h1>

                                                    <label className="text-gray-400 leading-3 text-sm">Category</label>
                                                    <h1 className="text-lg font-semibold leading-3 mb-4">Temple</h1>
                                                </div>
                                                <div className="w-48 h-32 bg-red-500 overflow-hidden">

                                                </div>
                                            </div>
                                            <div className="px-20 mt-4">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum hic enim harum deserunt placeat. Magni iusto, libero quos quidem quasi deserunt sint sequi quia optio quas? Consequatur porro enim ad ab adipisci totam voluptatibus, illo doloribus alias perspiciatis excepturi nostrum officiis cupiditate ea tempora neque cum delectus amet quaerat iure!
                                            </div>
                                            <div className="px-20 py-2">
                                                <label className="text-gray-400 leading-3 text-sm">status</label>
                                                <h1 className="leading-3 text-gray-300">pending</h1>
                                            </div>
                                            <div className="px-20 py-2">
                                                <label className="text-gray-400 leading-3 text-sm">message from user</label>
                                                <p className="leading-3 text-gray-300">No message available</p>
                                            </div>
                                            <div className="mt-4 w-full h-[2px] rounded-md bg-gray-600"></div>
                                        </section>*/}
                                    </div>
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