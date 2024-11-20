import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function EditProfile(){

    const [formdata, setFormdata] = useState({
        name: '',
        username: '',
        email: '',
        password: ''
    });
    const handleChange = (e) => {
        setFormdata({...formdata, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch(`${backendUrl}/api/places/register`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formdata)
        }).then(async (res) => {
            if(res.ok){
                toast.success("User Registered Successfully",{
                    onClose: () => {
                        window.location.href = '/login';
                    },
                    autoClose: 2000,
                    position: 'bottom-right',
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: 'colored'
                })
            }else{
                toast.warn("User already Registered",{
                    autoClose: 2000,
                    position: 'bottom-right',
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: 'colored'
                })
            }
        }).catch((err) => {
            toast.error("Server Error",{
                autoClose: 2000,
                position: 'bottom-right',
                closeOnClick: true,
                pauseOnHover: false,
                theme: 'colored'
            })
        });
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-white">
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-5">Edit Profile</h1>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-5 md:w-1/2 lg:w-1/3">
                        <input type="text" name="name" value={formdata.name} onChange={handleChange} placeholder="Full name" className="px-4 py-1 bg-transparent border-2 border-zinc-600 rounded-md outline-none"/>
                        <input type="text" name="username" value={formdata.username} onChange={handleChange} placeholder="Username" className="px-4 py-1 bg-transparent border-2 border-zinc-600 rounded-md outline-none"/>
                        <input type="email" name="email" value={formdata.email} onChange={handleChange} placeholder="Email" className="px-4 py-1 bg-transparent border-2 border-zinc-600 rounded-md outline-none"/>
                        <input type="password" name="password" value={formdata.password} onChange={handleChange} placeholder="Password" className="px-4 py-1 bg-transparent border-2 border-zinc-600 rounded-md outline-none"/>
                        <div className="w-full flex gap-6">
                            <button className="px-4 py-1 bg-blue-500 rounded-md hover:bg-blue-700">Register</button>
                            <a href="/" className="px-4 py-1 bg-zinc-500 rounded-md hover:bg-zinc-700">Back</a>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer/>
        </div>
    )
}

export default EditProfile;