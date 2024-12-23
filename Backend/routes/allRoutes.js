const express = require("express");
const router = express.Router();
const place = require('../models/placeModel');
const user = require('../models/userModel');
const addedPlace = require('../models/addedPlaceModel');
const category = require('../models/placeCategory')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const dotenv = require("dotenv");

dotenv.config();

// Get Categories on home Page
router.get('/categories/all', async (req,res) => {
    try {
        const cate = await category.find();
        res.json(cate);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get Top 4 liked places
router.get('/likedPlaces', async (req,res) => {
    try {
        const places = await place.find()
            .sort({'likes.length': -1})
            .limit(4);
        res.json(places);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get Top 10 liked places
router.get('/tenlikedPlaces', async (req,res) => {
    try {
        const places = await place.find()
            .sort({'likes.length': -1})
            .limit(10);
        res.json(places);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Get places by category
router.get('/:category', async (req,res) => {
    try {
        const places = await place.find({category: req.params.category});
        if (!places.length) return res.status(404).json({ message: 'No places found in this category'});
        res.json(places); 
    } catch (error) {
        res.status(500).json({message: 'Server error. Please try again later.'});
    }
});

// Get Searched place
router.get('/searchedPlace/:placeName', async (req, res) => {
    try {
        const pl = await place.findOne({ title1: req.params.placeName });
        if (!pl) return res.status(404).json({ message: 'No place found' });
        res.status(200).json(pl);
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Get all the places for Searching functionality
router.get('/allPlaces/all', async (req,res) => {
    try {
        const allPlaces = await place.find();
        if (!allPlaces.length) return res.status(404).json({ message: 'No places found'});
        res.status(200).json(allPlaces);
    } catch (error) {
        console.error("Server error : ", error);
        res.status(500).json({message: "Server error :"});
    }
})

// User Registration
router.post('/register', async (req, res) => {
    const {name, username, email, password} = req.body;

    const foundUser = await user.findOne({email});
    if(foundUser) return res.status(400).json({message : 'User already Registerd'})
    else{
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const createUser = new user({
            name,
            username,
            email,
            password: hash
        });
        
        try {
            const savedUser = await createUser.save();
            res.status(200).json(savedUser);
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
})

// User login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    
    try {
        const foundUser = await user.findOne({email});
        if(!foundUser) return res.json({message: 'Incorrect email or password'});

        bcrypt.compare(password, foundUser.password, (err, result) => {
            if (err) {
                return res.json({ message: "Something went wrong" });
            }
            if (!result) {
                return res.json({ message: 'Incorrect email or password' });
            }
            const token = jwt.sign({id: foundUser._id}, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({token, foundUser});
        })
    } catch (error) {
        res.json({message: error.message});
    }
})

// Add new category
router.post('/addCategory', auth, async (req, res) => {
    const {title1, description, img1} = req.body;
    const newCategory = new category({
        title1,
        description,
        img1
    });

    try {
        await newCategory.save();
        res.status(200).json();
    } catch (error) {
        console.error("Error occured : ", error);
        res.status(500).json();
    }
})

// Add new place
router.post('/addPlace/:userID', async (req, res) => {
    const { title1, title2, img1, content, category } = req.body;
    const userID = req.params.userID;

    const foundUser = await user.findById(userID);

    // Place added by Admin
    if(foundUser.email === process.env.ADMIN_EMAIL){
        const newPlace = new place({
            title1, title2, img1, content, category
        });
        
        try {
            const savedPlace = await newPlace.save();
            res.status(200).json({message: "place added successfully"});
        } catch (error) {
            console.error("Error : ", error.message);
            res.status(500).json({ message: "something went wrong" });
        }
    }
    // Place Added by User
    else{
        const newPlace = new addedPlace({
            title1, title2, img1, content, category, userInfo: foundUser._id
        });

        try {
            const savedPlace = await newPlace.save();
            res.status(200).json({message: "place sent to Admin for review"});
        } catch (error) {
            console.error("Error : ", error.message);
            res.status(500).json({ message: "something went wrong" });
        }
    }
});

// Like Functionality
router.post('/:id/like', auth, async (req, res) => {
    const placeID = req.params.id;
    const {userID} = req.body;

    try {
        const foundPlace = await place.findById(placeID);
        const newUser = await user.findById(userID);

        if(!foundPlace.likes.includes(userID)){
            foundPlace.likes.push(userID);
            await foundPlace.save();

            newUser.likedPlaces.push(placeID);
            await newUser.save();

            res.status(200).json(foundPlace);
        }
        else{
            foundPlace.likes = foundPlace.likes.filter(id => id.toString() !== userID);
            newUser.likedPlaces = newUser.likedPlaces.filter(id => id.toString() !== placeID);
            await foundPlace.save();
            await newUser.save();

            res.status(200).json(foundPlace);
        }
    } catch (error) {
        res.status(500).json({message : "server error : ", error});
    }
});

// Save Place Functionality
router.post('/:id/save', async (req, res) => {
    const placeID = req.params.id;
    const {userID} = req.body;

    try {
        const newUser = await user.findById(userID);

        if(!newUser.savedPlaces.includes(placeID)){
            newUser.savedPlaces.push(placeID);
            await newUser.save();
            res.status(200).json({message: "place added successfully"});
        }
        else{
            newUser.savedPlaces = newUser.savedPlaces.filter(id => id.toString() !== placeID);
            await newUser.save();
            res.status(200).json({message: "place unsaved"});
        }
    } catch (error) {
        res.status(500).json({message : "server error : ", error});
    }
});

// Comment Funtionality
router.post('/:id/comment', auth, async (req,res) => {
    const placeID = req.params.id;
    const {comment, userID} = req.body;

    try {
        const foundPlace = await place.findById(placeID);
        const foundUser = await user.findById(userID);
        const username = foundUser.username;
        const profileImage = foundUser.profileImage;

        foundPlace.comments.push({profileImage, username, comment});
        await foundPlace.save();
        res.status(200).json(foundPlace);
    } catch (error) {
        res.status(500).json({message: `server error: ${error}`});
    }
});

// Functionality of getting liked and saved places on Profile Page
router.get('/likedSavedPlaces/:userID', async (req,res) => {
    const foundUser = await user.findById(req.params.userID).populate(['likedPlaces', 'savedPlaces']);
    try {
        res.status(200).json(foundUser);
    } catch (error) {
        res.status(500).json({message: `server error: ${error}`});
    }
});

// Functionality for Removing the Saved Place
router.post('/RemoveSavedPlace/:placeID', auth, async (req,res) => {
    try {
        const placeID = req.params.placeID;
        const userID = req.body.userID;
        const foundUser = await user.findById(userID);

        if(!foundUser) return res.status(404).json({message: "user not found"});
        if(!placeID) return res.status(404).json({message: "place not found"});

        if(foundUser.savedPlaces.includes(placeID)){
            foundUser.savedPlaces = foundUser.savedPlaces.filter(id => id.toString() !== placeID);
            await foundUser.save();
        }
        res.status(200).json();
    } catch (error) {
        res.status(500).json({message: "Server Error : ", error});
    }
})

// Functionality for Fetching the place added by a user
router.get('/placeAddedByUser/:userID', async (req, res) => {
    const userID = req.params.userID;

    try {
        const placesFound = await addedPlace.find({userInfo: userID});

        if(!placesFound) return res.status(404).json({message: "No place added by you"});
        res.status(200).json(placesFound);
    } catch (error) {
        console.log("Server Error : ", error);
        res.status(500).json({message: "Server Issue"});
    }
})

// Functionality for Fetching the place added by a user on Admin Page
router.get('/addedPlace/adminPage', async (req, res) => {
    try {
        let placesFound = await addedPlace.find();
        placesFound = placesFound.filter((p) => p.status === "Pending");

        if(!placesFound) return res.status(404).json({message: "No place added by user"});
        res.status(200).json(placesFound);
    } catch (error) {
        console.log("Server Error : ", error);
        res.status(500).json({message: "Server Issue"});
    }
})

// Functionality for accepting the place added by user
router.post('/addedPlace/:placeID', async (req, res) => {
    const placeID = req.params.placeID;

    try {
        const foundPlace = await addedPlace.findById(placeID);

        const newPlace = new place({
            title1: foundPlace.title1,
            title2: foundPlace.title2,
            img1: foundPlace.img1,
            content: foundPlace.content,
            category: foundPlace.category
        })
        await newPlace.save();

        foundPlace.status = "Added✅";
        await foundPlace.save();

        res.status(200).json();

    } catch (error) {
        console.log("Server Issue : ", error);
        res.status(500).json();
    }
})

// Functionality for Rejecting the place added by user
router.post('/addedPlace/rejected/:placeID', async (req, res) => {
    const placeID = req.params.placeID;

    try {
        const foundPlace = await addedPlace.findByIdAndDelete(placeID);
        res.status(200).json();
    } catch (error) {
        console.log("Server Issue : ", error);
        res.status(500).json();
    }
})

module.exports = router;