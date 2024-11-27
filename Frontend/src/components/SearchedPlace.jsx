import React, { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SlBubble, SlLike, SlBag, SlClose } from "react-icons/sl";
import Header from "./Header";
import Footer from "./Footer";

const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const coordinatesKey = import.meta.env.VITE_coordinatesKey;
const directionKey = import.meta.env.VITE_directionKey;

function SearchedPlace() {
    const [dropdown, setDropdown] = useState(null);
    const [result, setResult] = useState(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [commentOpen, setCommentOpen] = useState(null);
    const [commentData, setCommentData] = useState({ comment: '' });


    const user = cookies.get('user') || null;

    // This is for fetching the searched place from backend
    const [place, setPlace] = useState('');
    const [placeName, setPlaceName] = useState(cookies.get('searchedPlace'));

    useEffect(() => {
        if (placeName) {
            fetch(`${backendUrl}/api/places/searchedPlace/${placeName}`)
            .then((res) => res.json())
            .then((data) => setPlace(data))
            .catch((error) => console.error("Error fetching data:", error));
        }
    }, [placeName]);
    
    // This is for Find Distance Functionality
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

    // like place functionality
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
                    setPlace(updatedPlace);
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

    // save place functionality
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

    // comment Functionality
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
                setPlace(updatedPlace);
            } else {
                toast.error("Internal error", { autoClose: 1000, position: 'bottom-right', theme: 'colored' });
            }
        } catch (error) {
            console.error("Server Error");
        }
    };


    // Search place using search bar Functionality
    const [searchBy, setSearchBy] = useState(true);
    const [value, setValue] = useState('');

    const handleSelect = (e) => {
        setValue(e.target.value);
    }

    // This is for fetching places for search suggestions
    const [allPlaces, setAllPlaces] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/allPlaces/all`)
        .then((res) => res.json())
        .then((data) => setAllPlaces(data))
        .catch((err) => console.error("error in fetching places from backend : ", err))
    }, []);

    const onSearch = (searchTerm) => {
        setPlaceName(searchTerm);
        setPlaceName(searchTerm);
    }

    return(
        <div>
            <Header/>

            <div className="min-h-screen bg-zinc-700 sm:p-10 lg:pt-32 sm:pt-28 pt-20">
                {/* For Search bar */}
                <div className="px-10 py-5 text-white">
                    <div className="relative flex flex-col items-center">
                        <div> 
                            <div className="inline-block mr-5">
                                <p className="text-gray-400 pl-3">Search by</p>
                                <select 
                                onChange={(e) => setSearchBy(e.target.value === "placename")}
                                className="bg-transparent text-gray-400 px-2 py-1 rounded-full outline-none border-2 border-gray-400"
                                >
                                    <option value="placename" >place name</option>
                                    <option value="placeaddress" >place address</option>
                                </select>
                            </div>
                            <input type="text" value={value} onChange={handleSelect} className="mt-2 border-2 rounded-l-full border-gray-400 bg-transparent outline-none px-2 py-1 text-sm" placeholder="search place..."/>
                            <button onClick={() => onSearch(value)} className="px-2 py-1 bg-blue-500 rounded-r-full">Search</button>
                        </div>
                        <div className={`absolute top-full flex flex-col gap-2 w-full p-4 mt-2 border-2 rounded-md border-gray-400 bg-zinc-700 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 ${value ? "opacity-100 h-60" : "opacity-0 h-0"}`}>
                            {allPlaces.length > 0 ? (
                                allPlaces.filter((item) => {
                                    const searchTerm = value.toLowerCase();
                                    const placeName = searchBy ? item.title1.toLowerCase() : item.title2.toLowerCase() ;

                                    return searchTerm && placeName.startsWith(searchTerm) && placeName !== searchTerm;
                                })
                                .length > 0 ? (
                                    allPlaces.filter((item) => {
                                        const searchTerm = value.toLowerCase();
                                        const placeName = searchBy ? item.title1.toLowerCase() : item.title2.toLowerCase() ;
                                        
                                        return searchTerm && placeName.startsWith(searchTerm) && placeName !== searchTerm;
                                    })
                                    .map((item) => (
                                        <div 
                                        key={item._id}
                                        onClick={() => setValue(item.title1)}
                                        className="border-[1px] rounded-md border-gray-500 px-2 py-1"
                                        >
                                            <p className="cursor-pointer leading-5">{item.title1}</p>
                                            <p className="text-sm text-gray-400 leading-5">{item.title2}</p>
                                        </div>
                                    ))   
                                ) : (<div>No Place available</div>)
                            ) : (<div>No Place available</div>)}
                        </div>
                    </div>
                </div>

                {/* For displaying Place */}
                <div className="lg:w-4/5 mx-auto min-h-screen flex flex-col sm:gap-16 gap-8">
                    <div className="p-8 bg-gradient-to-tr from-zinc-400 to-zinc-300 rounded-lg shadow-lg">
                        <section className="flex flex-col justify-center items-center">
                            <h2 className="text-2xl text-center font-semibold">{place.title1}</h2>
                            <p className="text-lg text-center mb-6">{place.title2}</p>
                            <div className="lg:w-1/2 w-full sm:h-64 h-44 rounded overflow-hidden mb-4">
                                <img src={place.img1} alt="Place" className="w-full h-full object-cover" />
                            </div>
                            <p className="mt-4 leading-relaxed text-justify">{place.content}</p>
                        </section>
                        
                        <div className="flex gap-5 mt-4">
                            <button onClick={() => toggleDropdown(place._id)} className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 text-xs sm:text-sm font-bold">Find Distance</button>
                        </div>
                        
                        <div onClick={() => setTo(place.title2)} className={`form mt-2 ${dropdown === place._id ? "" : "hidden"}`}>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-sm">
                                <input type="text" onChange={(e) => setFrom(e.target.value)} className="bg-gray-700 max-w-fit text-white border border-gray-600 rounded px-2 py-1 outline-none" placeholder="Enter your location..." />
                                <button className="w-20 bg-blue-600 hover:bg-blue-700 text-white py-1 px-4 rounded-full">Calculate</button>
                                {result && <div className="font-semibold">Distance: {result}</div>}
                            </form>
                        </div>
                        
                        <ul className="flex gap-6 mt-6">
                            <li onClick={() => handleLike(place._id)} className="cursor-pointer">
                                <SlLike className="lg:text-xl" />
                                <p>{place.likes?.length || 0}</p>
                            </li>
                            <li onClick={() => handleSave(place._id)} className="cursor-pointer">
                                <SlBag className="lg:text-xl" />
                            </li>
                            <li onClick={() => handleComment(place._id)} className="cursor-pointer">
                                <SlBubble className="lg:text-xl" />
                                <p>{place.comments?.length || 0}</p>
                            </li>
                        </ul>

                        <div className={`fixed lg:w-1/3 w-full lg:h-3/4 h-1/3 pb-4 bg-gray-900 bottom-0 right-0 sm:p-4 p-2 flex flex-col justify-between transform transition-transform ${commentOpen === place._id ? "lg:translate-x-0 translate-y-0" : "lg:translate-x-full translate-y-full"}`}>
                            <div className="flex justify-between items-center sm:mb-4 mb-2 text-white">
                                <h3 className="text-2xl">Comments</h3>
                                <SlClose onClick={() => setCommentOpen(null)} className="text-xl cursor-pointer" />
                            </div>
                            <div className="overflow-y-auto h-4/5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
                                {[...place.comments].reverse().map((c) => (
                                    <div key={c._id} className="bg-gray-800 overflow-hidden px-3 py-2 rounded mb-3 text-white">
                                        <img src={c.profileImage} className="w-5 h-5 rounded-full object-cover inline mb-1"/>
                                        <p className="text-sm font-bold ml-1 inline">{c.username}</p>
                                        <p className="text-sm break-words">{c.comment}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="sm:mt-3 flex">
                                <input type="text" name="comment" value={commentData.comment} onChange={handleChange} placeholder="Write a comment..." className="w-full bg-gray-700 text-white px-4 py-2 rounded-l-lg outline-none scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent" />
                                <input type="button" value="Post" onClick={() => postComment(place._id)} className="bg-green-600 hover:bg-green-700 text-white py-1 px-4 rounded-r-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
            <ToastContainer/>
        </div>
    )
}

export default SearchedPlace;