import React, { useState } from "react";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const cookies = new Cookies();

function AddCategory(){

    const [formdata, setFormdata] = useState({title1: '', description: '', img1: ''});
    const handleChange = (e) => {
        setFormdata({...formdata, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = cookies.get('token');
        if(!token){
            toast.error("Token not found, Login First",{
                onClose: () => {
                  window.location.href = '/login';
                },
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: false,
                theme: 'colored'
              })
        }

        try {
            const res = await fetch(`${backendUrl}/api/places/addCategory`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formdata)
            });
            if(res.ok){
                toast.success("Category added successfully",{
                    onClose: () => {
                        window.location.href = '/addCategory'
                    },
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: 'colored'
                });
            }
            else{
                toast.error("Error in adding the category",{
                    autoClose: 1000,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: 'colored'
                })
            }
        } catch (error) {
            toast.error("Server Error",{
                autoClose: 1000,
                closeOnClick: true,
                pauseOnHover: false,
                theme: 'colored'
            })
        }
    }

    return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="sm:p-10 p-4">
        <a href="/profile" className="px-4 py-1 rounded-lg bg-slate-600 text-white">Back</a>
        <h1 className="text-3xl text-white mb-10 mt-2">Add new Category</h1>
        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-4 lg:w-1/2 text-white">
          <input name="title1" value={formdata.title1} onChange={handleChange} placeholder="Define Category" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <input name="description" value={formdata.description} onChange={handleChange} placeholder="Brief Description of Category" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <input name="img1" value={formdata.img1} onChange={handleChange} placeholder="Image URL" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <button className="p-2 bg-zinc-600 rounded text-white hover:bg-zinc-700">Add Category</button>
        </form>
      </div>
      <ToastContainer/>
    </div>
    )
};

export default AddCategory;