import React, { useState } from "react";
import Cookies from 'universal-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const cookies = new Cookies();
const backendUrl = import.meta.env.VITE_BACKEND_URL;

function LoginPage(){

    const [formdata, setFormData] = useState({email: '',password: ''});

    const handleChange = (e) => {
      setFormData({...formdata, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
          const res = await fetch(`${backendUrl}/api/places/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formdata)
          })
          const data = await res.json();

          if(data.token){
            cookies.set('token', data.token);
            cookies.set('user', data.foundUser);
            toast.success("Login SucccessFully",{
              onClose: () => {
                window.location.href = '/'
              },
              autoClose: 1500,
              position: 'top-right',
              closeOnClick: true,
              pauseOnHover: false,
              theme: 'colored'
            });
          }
          else{
            toast.error(`${data.message}`, {
              autoClose: 1500,
              position: 'top-right',
              closeOnClick: true,
              pauseOnHover: false,
              theme: 'colored'
            })
          }

        } catch (error) {
          toast.error(`${data.message}`, {
            autoClose: 1500,
            position: 'top-right',
            closeOnClick: true,
            pauseOnHover: false,
            theme: 'colored'
          })
        }
    };

    return (
      <div className="min-h-screen bg-zinc-900 flex justify-center items-center">
          <div className="sm:w-1/3 px-2 lg:px-4 py-10 border-2 border-zinc-600 rounded-lg overflow-hidden flex flex-col justify-center">
              <h1 className="text-2xl font-bold mb-5 ml-4 text-white">User Login</h1>
              <form onSubmit={handleSubmit} className="flex flex-col p-4 text-white w-full">
                  <input type="email" name="email" value={formdata.email} onChange={handleChange} placeholder="email" className="px-4 py-2 bg-zinc-800 rounded-lg outline-none"/>
                  <input type="password" name="password" value={formdata.password} onChange={handleChange} placeholder="password" className="px-4 py-2 bg-zinc-800 rounded-lg outline-none mt-2"/>
                  <div className="flex gap-4 mt-10">
                      <button className="px-4 py-1 bg-blue-600 rounded-lg">Login</button>
                      <a href="/" className="px-4 py-1 bg-zinc-600 rounded-lg">Back</a>
                  </div>
              </form>
          </div>
          <ToastContainer />
      </div>
    )
}

export default LoginPage;