import React, { useState } from "react";
import Cookies from "universal-cookie";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function AddPlace() {
  const [formData, setFormData] = useState({title1: '',title2: '',img1: '',content: '',category: ''});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = cookies.get("token");

    if (!token) {
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

    fetch(`${backendUrl}/api/places/addPlace`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        toast.error(`${data.message}`,{
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: false,
          theme: 'colored'
        })
      } else {
        toast.success("Place added successfully",{
          onClose: () => {
            window.location.href = '/addPlace';
          },
          autoClose: 1500,
          closeOnClick: true,
          pauseOnHover: false,
          theme: 'colored'
        })
      }
    })
  };

  return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="sm:p-10 p-4">
        <a href="/profile" className="px-4 py-1 rounded-lg bg-slate-600 text-white">Back</a>
        <h1 className="text-3xl text-white mb-10 mt-2">Add new Place</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:w-1/2 text-white">
          <input name="title1" value={formData.title1} onChange={handleChange} placeholder="place name" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <input name="title2" value={formData.title2} onChange={handleChange} placeholder="address of place" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <input name="img1" value={formData.img1} onChange={handleChange} placeholder="Image URL 1" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Content..." required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none h-40 resize-none" />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="category" required className="p-2 rounded bg-transparent border-2 border-zinc-600 outline-none" />
          <button type="submit" className="p-2 bg-zinc-600 rounded text-white hover:bg-zinc-700">Add Place</button>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default AddPlace;