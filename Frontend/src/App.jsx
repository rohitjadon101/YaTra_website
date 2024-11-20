import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from "./Home";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
import AddPlace from "./components/AddPlace";
import AddCategory from "./components/AddCategory";
import ProfilePage from "./components/ProfilePage";
import MostLikedPlaces from "./components/MostLikedPlaces";
import Places from "./components/Places";
import EditProfile from "./components/EditProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/profile" element={<ProfilePage/>}/>
        <Route path="/addPlace" element={<AddPlace/>}/>
        <Route path="/addCategory" element={<AddCategory/>}/>
        <Route path="/place" element={<Places/>}/>
        <Route path="/mostlikedplaces" element={<MostLikedPlaces/>}/>
        <Route path="/editProfile" element={<EditProfile/>}/>
      </Routes>
    </Router>
  )
}

export default App;