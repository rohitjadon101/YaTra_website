import React from "react";
import Cookies from 'universal-cookie';
import IMG from '../assets/images/WebIcon.webp';

const cookies = new Cookies();

function Header() {
    // Retrieve logged-in user data if available
    let user = cookies.get('user') || null;

    return (
        <header className="w-full z-50 fixed flex justify-between items-center sm:p-6 p-4 bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-md">
            {/* Logo and Title */}
            <div className="flex items-center sm:gap-4 gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                    <img src={IMG} alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="sm:text-3xl text-lg font-bold text-gray-300 tracking-wider">YaTra</h1>
                    <p className="text-xs sm:text-base text-gray-400">Enjoy Vacations</p>
                </div>
            </div>

            {/* Navigation Links */}
            <nav className="flex items-center sm:gap-6 gap-2">
                <a href="/" className="text-gray-300 sm:text-base text-xs hover:text-blue-400 transition duration-300">Home</a>
                {user ? (
                    <div className="flex items-center sm:gap-4 gap-2">
                        <a href="/profile" className="relative flex items-center group">
                            <div className="sm:w-10 sm:h-10 w-6 h-6 rounded-full overflow-hidden border-2 border-blue-400 shadow-md">
                                <img src={user.profileImage} alt="User Profile" className="w-full h-full object-cover" />
                            </div>
                            <span className="sm:ml-2 ml-1 text-sm font-semibold text-gray-300 group-hover:text-blue-400 transition duration-300">
                                {user.username}
                            </span>
                        </a>
                    </div>
                ) : (
                    <div className="flex sm:gap-4 gap-2">
                        <a href="/login" className="sm:px-4 py-1 px-2 sm:text-base text-xs bg-zinc-500 hover:bg-zinc-600 rounded-lg text-white font-medium shadow transition duration-300">Login</a>
                        <a href="/register" className="sm:px-4 py-1 px-2 sm:text-base text-xs bg-zinc-500 hover:bg-zinc-600 rounded-lg text-white font-medium shadow transition duration-300">Register</a>
                    </div>
                )}
            </nav>
        </header>
    );
}

export default Header;