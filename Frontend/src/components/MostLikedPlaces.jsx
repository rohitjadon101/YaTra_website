import {React, useEffect, useState} from "react";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlBubble, SlLike, SlBag, SlClose } from "react-icons/sl";
import Header1 from "./Header";
import Footer from "./Footer";

const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const coordinatesKey = import.meta.env.VITE_coordinatesKey;
const directionKey = import.meta.env.VITE_directionKey;

function MostLikedPlaces(){

    const [likedPlaces, setLikedPlaces] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/tenlikedPlaces`)
        .then((res) => res.json())
        .then((data) => setLikedPlaces(data))
        .catch((err) => console.error('Error fetching liked Places : ',err));
    })

    const [dropdown, setDropdown] = useState(null);
    const [result, setResult] = useState(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [commentOpen, setCommentOpen] = useState(null);
    const [commentData, setCommentData] = useState({ comment: '' });

    const user = cookies.get('user') || null;

    const toggleDropdown = (placeID) => {
        setDropdown(dropdown === placeID ? null : placeID);
        setResult(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let res1 = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${from}&key=${coordinatesKey}`);
            let data1 = await res1.json();
            let lat1 = data1.results[0].geometry.lat;
            let long1 = data1.results[0].geometry.lng;

            let res2 = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${to}&key=${coordinatesKey}`);
            let data2 = await res2.json();
            let lat2 = data2.results[0].geometry.lat;
            let long2 = data2.results[0].geometry.lng;

            let finalRes = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${directionKey}&start=${[long1, lat1]}&end=${[long2, lat2]}`);
            let finalData = await finalRes.json();
            let distance = (finalData.features[0].properties.summary.distance / 1000).toFixed(2);
            setResult(<span className="text-green-600 font-semibold">{distance} KM</span>);
        } catch (error) {
            setResult(<span className="text-red-400 text-sm">Unable to fetch distance</span>);
        }
    };

    const handleLike = async (placeID) => {
        if (user) {
            try {
                const response = await fetch(`${backendUrl}/api/places/${placeID}/like`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.get('token')}`
                    },
                    body: JSON.stringify({ userID: user._id })
                });
                if (response.ok) {
                    const updatedPlace = await response.json();
                    setPlaces(places.map((p) => p._id === placeID ? updatedPlace : p));
                } else {
                    console.error("Failed to like the place");
                }
            } catch (error) {
                console.error("Error liking the place:", error);
            }
        } else {
            toast.info("Please log in to like places", { autoClose: 1500, position: 'bottom-right', theme: 'colored' });
        }
    };

    const handleSave = async (placeID) => {
        if (user) {
            try {
                const res = await fetch(`${backendUrl}/api/places/${placeID}/save`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${cookies.get('token')}`
                    },
                    body: JSON.stringify({ userID: user._id })
                });
                if (res.ok) {
                    const data = await res.json();
                    toast.success(data.message, { autoClose: 1500, position: 'bottom-left', theme: 'colored' });
                } else {
                    toast.error('Error: Unable to save place', { autoClose: 1500, position: 'bottom-left', theme: 'colored' });
                }
            } catch (error) {
                console.error("Server Error:", error);
            }
        } else {
            toast.info("Please log in to save places", { autoClose: 1500, position: 'bottom-right', theme: 'colored' });
        }
    };

    const handleComment = (placeID) => {
        if (user) {
            setCommentOpen(commentOpen === placeID ? null : placeID);
        } else {
            toast.info("Please log in to comment", { autoClose: 1500, position: 'bottom-right', theme: 'colored' });
        }
    };

    const handleChange = (e) => {
        setCommentData({ ...commentData, [e.target.name]: e.target.value });
    };

    const postComment = async (placeID) => {
        try {
            const response = await fetch(`${backendUrl}/api/places/${placeID}/comment`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${cookies.get('token')}`
                },
                body: JSON.stringify({ ...commentData, userID: user._id })
            });
            if (response.ok) {
                setCommentData({ comment: "" });
                const updatedPlace = await response.json();
                setPlaces(places.map((p) => p._id === placeID ? updatedPlace : p));
            } else {
                toast.error("Internal error", { autoClose: 1000, position: 'bottom-right', theme: 'colored' });
            }
        } catch (error) {
            console.error("Server Error");
        }
    };

    return(
        <>
        <Header1/>
        <div className="sm:p-10 sm:pt-28 pt-24 bg-gray-200">
            <h1 className="text-4xl text-gray-800 text-center font-bold mb-4">Top 10 Liked Places</h1>
            <div className="lg:w-4/5 mx-auto min-h-screen flex flex-col sm:gap-16 gap-8">
            {likedPlaces.length > 0 ? (
                likedPlaces.map((p) => (
                    <div key={p._id} className="p-8 bg-gradient-to-tr from-gray-200 to-gray-100 rounded-lg shadow-lg">
                        <section className="flex flex-col justify-center items-center">
                            <h2 className="text-2xl text-center font-semibold">{p.title1}</h2>
                            <p className="text-lg text-center mb-6">{p.title2}</p>
                            <div className="lg:w-1/2 w-full sm:h-64 h-44 rounded overflow-hidden mb-4">
                                <img src={p.img1} alt="Place" className="w-full h-full object-cover" />
                            </div>
                            <p className="mt-4 leading-relaxed">{p.content}</p>
                        </section>
                        
                        <div className="flex gap-5 mt-4">
                            <button onClick={() => toggleDropdown(p._id)} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 text-xs sm:text-sm font-bold">Find Distance</button>
                        </div>
                        
                        <div onClick={() => setTo(p.title2)} className={`form mt-2 ${dropdown === p._id ? "" : "hidden"}`}>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-sm">
                                <input type="text" onChange={(e) => setFrom(e.target.value)} className="bg-gray-700 max-w-fit text-white border border-gray-600 rounded px-2 py-1 outline-none" placeholder="Enter your location..." />
                                <button className="w-20 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full">Calculate</button>
                                {result && <div className="font-semibold">Distance: {result}</div>}
                            </form>
                        </div>
                        
                        <ul className="flex gap-6 mt-6">
                            <li onClick={() => handleLike(p._id)} className="cursor-pointer">
                                <SlLike className="lg:text-xl" />
                                <p>{p.likes.length}</p>
                            </li>
                            <li onClick={() => handleSave(p._id)} className="cursor-pointer">
                                <SlBag className="lg:text-xl" />
                            </li>
                            <li onClick={() => handleComment(p._id)} className="cursor-pointer">
                                <SlBubble className="lg:text-xl" />
                                <p>{p.comments.length}</p>
                            </li>
                        </ul>

                        <div className={`fixed lg:w-1/3 w-full lg:h-3/4 h-1/3 pb-4 bg-gray-900 bottom-0 right-0 sm:p-4 p-2 flex flex-col justify-between transform transition-transform ${commentOpen === p._id ? "lg:translate-x-0 translate-y-0" : "lg:translate-x-full translate-y-full"}`}>
                            <div className="flex justify-between items-center sm:mb-4 mb-2 text-white">
                                <h3 className="text-2xl">Comments</h3>
                                <SlClose onClick={() => setCommentOpen(null)} className="text-xl cursor-pointer" />
                            </div>
                            <div className="overflow-y-auto h-4/5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
                                {[...p.comments].reverse().map((c) => (
                                    <div key={c._id} className="bg-gray-800 overflow-hidden px-3 py-2 rounded mb-3 text-white">
                                        <img src={c.profileImage} className="w-5 h-5 rounded-full object-cover inline mb-1"/>
                                        <p className="text-sm font-bold ml-1 inline">{c.username}</p>
                                        <p className="text-sm break-words">{c.comment}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="sm:mt-3 flex">
                                <input type="text" name="comment" value={commentData.comment} onChange={handleChange} placeholder="Write a comment..." className="w-full bg-gray-700 text-white px-4 py-2 rounded-l-lg outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent" />
                                <input type="button" value="Post" onClick={() => postComment(p._id)} className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-r-lg" />
                            </div>
                        </div>
                    </div>
                ))
            ) : (<div className="p-4 text-xl font-semibold text-center">No place available</div>)}
            </div>
            <ToastContainer/>
        </div>
        <Footer/>
        </>
    )
};
export default MostLikedPlaces;