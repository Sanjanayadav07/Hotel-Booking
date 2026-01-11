import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from 'cloudinary';
import Room from "../models/Room.js";

//Api to create  a new room for hotel
/*
export const createRoom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.userId })
        if (!hotel) return res.json({ success: false, message: "No Hotel Found" });

        //upload images to cloudinary
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        //wait for all upload to complete  
        const images = await Promise.all(uploadImages);
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({ success: true, message: "Room created successfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}
*/
export const createRoom = async (req, res) => {
    try {
        console.log("REQ.USER:", req.user);

        const hotel = await Hotel.findOne({ owner:  req.user._id });

        console.log("HOTEL FOUND:", hotel);

        if (!hotel) {
            return res.status(400).json({
                success: false,
                message: "Hotel not found. Please register hotel first.",
            });
        }

        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        });

        const images = await Promise.all(uploadImages);

        await Room.create({
            hotel: hotel._id,
            roomType: req.body.roomType,
            pricePerNight: Number(req.body.pricePerNight),
            amenities: JSON.parse(req.body.amenities),
            images,
        });

        res.json({ success: true, message: "Room created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};




//Api to get all room for hotel

export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 })
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


//Api to get all room for specific hotel

export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel.findOne({ owner: req.user._id })
        const rooms = await Room.find({ hotel: hotelData._id.toString() }).populate("hotel");
        res.json({ success: true, rooms });
    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}

//Api to toggal availibility of a room

export const toggleRoomAvailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({ success: true, message: "Room avilability Updated" });

    } catch (error) {
        res.json({ success: true, message: error.message });

    }
}

