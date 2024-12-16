import React, { useEffect, useState } from "react";
import Cookies from 'universal-cookie';
import RiseLoader from "react-spinners/RiseLoader";
import PulseLoader  from "react-spinners/PulseLoader";

const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const coordinatesKey = import.meta.env.VITE_coordinatesKey;
const directionKey = import.meta.env.VITE_directionKey;

function HomePage() {

    // For toggling the Find Distance div
    const [dropdown, setDropdown] = useState(false);
    const toggleDropdown = () => {
        setDropdown(!dropdown);
        setResult(null);
    };

    // Distance calculation Functionality
    const [result, setResult] = useState(null);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    // For Distance calculation loading
    const [distanceCaclLoading, setDistanceCaclLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setDistanceCaclLoading(true);
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
            setDistanceCaclLoading(false);          // as the data is fetched from backend, loading is set to be false
            let distance = (finalData.features[0].properties.summary.distance / 1000).toFixed(2);
            setResult(<span className="text-green-600 font-bold">{distance} KM</span>);
        } catch (error) {
            setResult(<span className="text-red-500">Not found</span>);
        }
    };

    // For loading Functionality
    const [loading, setLoading] = useState(true);

    // For Fetching all the Categories
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/categories/all`)
            .then((res) => res.json())
            .then((data) => {
                setCategories(data)
                setLoading(false)               // as the data is fetched from backend, loading is set to be false
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, [categories]);

    // For Fetching most liked places
    const [likedPlaces, setLikedPlaces] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/likedPlaces`)
        .then((res) => res.json())
        .then((data) => setLikedPlaces(data))
        .catch((err) => console.error('Error fetching liked Places : ',err));
    }, [likedPlaces]);

    // This is for fetching the suggestions while searching
    const [allPlaces, setAllPlaces] = useState([]);
    useEffect(() => {
        fetch(`${backendUrl}/api/places/allPlaces/all`)
        .then((res) => res.json())
        .then((data) => setAllPlaces(data))
        .catch((err) => console.error("error in fetching places from backend : ", err))
    }, []);

    // Search place using Search bar Functionality
    const [value, setValue] = useState('');
    const [searchBy, setSearchBy] = useState(true);

    // While clicking Search Button
    const onSearch = (searchTerm) => {
        setValue(searchTerm);
        cookies.set('searchedPlace', searchTerm);
        window.location.href = '/searchedPlace';
    }

    return (
        <>
            <div className="text-white min-h-screen flex flex-col items-center justify-center sm:pt-24 pt-10 overflow-x-hidden">
                
                {/* Hero Section */}
                <section className="relative w-full h-screen flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-gray-900 to-gray-700">
                    <h1 className="sm:text-5xl text-4xl font-extrabold leading-tight text-blue-400">Explore Incredible India</h1>
                    <p className="text-lg mt-4 max-w-2xl text-gray-200">
                        Discover diverse cultures, stunning landscapes, and the warm hospitality of India’s most iconic destinations.
                    </p>
                    <button onClick={toggleDropdown} className="mt-6 px-8 sm:py-3 py-2 bg-blue-700 rounded-full text-xl text-white font-semibold hover:bg-blue-800 transition duration-300">Find Distance</button>

                    {/* Distance Finder Form */}
                    <div className={`form mt-8 transition duration-500 ease-in-out ${dropdown ? "opacity-100" : "opacity-0 hidden"}`}>
                        <form onSubmit={handleSubmit} className="bg-white text-black rounded-lg p-6 shadow-lg flex flex-col gap-4">
                            <div>
                                <label className="block font-semibold">From:</label>
                                <input
                                    type="text"
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-gray-500"
                                    placeholder="Enter starting location..."
                                />
                            </div>
                            <div>
                                <label className="block font-semibold">To:</label>
                                <input
                                    type="text"
                                    onChange={(e) => setTo(e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 outline-none focus:border-gray-500"
                                    placeholder="Enter destination..."
                                />
                            </div>
                            <button type="submit" className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300 font-bold">Calculate Distance</button>
                            {distanceCaclLoading ? (
                                <div className="flex justify-center items-center">
                                    <PulseLoader 
                                    color="#3dac4a"
                                    loading={distanceCaclLoading}
                                    size={10}
                                    aria-label="Loading Spinner"
                                    data-testid="loader"
                                    /> 
                                </div>
                            )
                            : result && <div className="mt-4 text-lg font-bold">Distance: {result}</div>}
                        </form>
                    </div>
                </section>

                {/* Most Liked places */}
                <section className="w-full sm:py-20 py-10 bg-gradient-to-r from-gray-200 to-gray-100">
                    <h1 className="sm:text-4xl text-2xl font-bold text-center text-gray-800">Most Liked Places</h1>
                    <p className="text-gray-500 text-center mt-4 max-w-2xl mx-auto">
                        Explore Top-rated destinations loved by users.
                    </p>

                    {loading ? (
                            <div className="py-10 flex justify-center items-center">
                                <RiseLoader
                                color="#232d7b"
                                loading={loading}
                                size={20}
                                aria-label="Loading Spinner"
                                data-testid="loader"
                                /> 
                            </div>
                        )
                        : likedPlaces.length > 0 ? (
                            <>
                            <div className="py-10 flex justify-center items-center">
                                <div className="sm:px-4 grid lg:grid-cols-4 grid-cols-2 gap-y-4 gap-x-4 sm:gap-x-6">
                                    {likedPlaces.map((lp) => (
                                        <div key={lp._id} className="w-36 h-48 sm:w-60 sm:h-80 bg-white rounded-lg shadow-lg overflow-hidden">
                                            <img src={lp.img1} className="w-full h-24 sm:h-44 object-cover"/>
                                            <div className="p-2 sm:p-4">
                                                <h3 className="sm:text-lg font-semibold text-gray-800">{lp.title1}</h3>
                                                <p className="text-gray-600 text-xs sm:text-base">{lp.title2}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col gap-4 justify-center items-center">
                                <h4 className="text-gray-500">Explore Top 10 Liked Places</h4>
                                <a href="/mostlikedPlaces" className="px-8 py-2 text-xl font-semibold rounded-full bg-blue-600 hover:bg-blue-700">Explore</a>
                            </div>
                            </>
                        ) : (<div className="text-lg font-bold text-gray-600 text-center mt-4">No liked Places Found</div>)
                    }
                </section>

                {/* Search Place Section */}
                <section className="w-full p-10 flex flex-col items-center gap-4 bg-gradient-to-r from-zinc-800 to to-slate-500">
                    <h1 className="sm:text-4xl text-lg font-bold text-gray-200 shadow-lg">Search Desired Place</h1>
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
                            <div className="inline-block">
                                <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="mt-2 border-2 rounded-l-full border-gray-400 bg-transparent outline-none px-2 py-1 text-sm" placeholder="search place..."/>
                                <button onClick={() => onSearch(value)} className="px-2 py-1 bg-blue-500 rounded-r-full">Search</button>
                            </div>
                        </div>
                        <div className={`absolute top-full flex flex-col gap-2 w-full p-4 mt-2 border-2 rounded-md border-gray-400 bg-zinc-700 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500 ${value ? "opacity-100 h-80 z-10" : "opacity-0 h-0"}`}>
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
                </section>

                {/* Category Section */}
                <section className="w-full py-10 sm:py-20 bg-gray-100">
                    <h2 className="sm:text-4xl text-2xl font-bold text-gray-800 text-center">Search By Category</h2>
                    <p className="text-gray-500 text-center max-w-2xl mx-auto mt-4">
                        Explore places based on specific interests.
                    </p>
                    
                    {loading ? (
                        <div className="py-10 flex justify-center items-center">
                            <RiseLoader
                            color="#232d7b"
                            loading={loading}
                            size={20}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                            /> 
                        </div>
                    )
                    : categories.length > 0 ? (
                        <div className="py-10 flex justify-center items-center">
                            <div className="sm:px-4 grid lg:grid-cols-4 grid-cols-2 gap-y-4 sm:gap-y-6 gap-x-4 sm:gap-x-6">
                                {categories.map((c) => (
                                    <div
                                        key={c._id}
                                        onClick={() => {
                                            cookies.set('category', c.title1);
                                            window.location.href = '/place';
                                        }}
                                        className="w-36 h-48 sm:w-60 sm:h-80 bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:scale-105 transform transition duration-300"
                                    >
                                        <img src={c.img1} alt={c.title1} className="w-full h-24 sm:h-44 object-cover"/>
                                        <div className="p-2 sm:p-4">
                                            <h3 className="sm:text-lg font-semibold text-gray-800">{c.title1}</h3>
                                            <p className="text-gray-600 text-xs sm:text-base">{c.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (<div className="text-lg font-bold text-gray-600 text-center mt-4">No popular destinations found</div>)}                
                </section>
            </div>
        </>
    );
}

export default HomePage;