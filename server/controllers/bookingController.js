
import transporter from "../configs/nodemailer.js";
import Booking from "../models/Booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

//function to check availability

const checkAvailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        const bookings = await Booking.find({
            room,
            checkInDate: { $lt: checkOut },
            checkOutDate: { $gt: checkIn },
        });

        return bookings.length === 0;
    } catch (error) {
        console.error(error);
        return false;
    }
};


// Api to check avilability of room
//post /api/bookings/check-avilability

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability({ checkInDate, checkOutDate, room })
        res.json({ success: true, isAvailable })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
        //res.json({ success: false, message: error.message })
    }
}

//Api to create new booking
//POST /api/booking/book

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
       const mongoUser = req.user; // ✅ middleware se aaya
        /*const clerkUserId = req.auth.userId; // ✅ FIXED

        if (!clerkUserId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const mongoUser = await User.findOne({ clerkId: clerkUserId });
        */
        if (!mongoUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Room is not available" });
        }

        const roomData = await Room.findById(room).populate("hotel");

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        //const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        const nights = Math.max(
            1,
            Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
        );

        const totalPrice = roomData.pricePerNight * nights;

        const booking = await Booking.create({
            user: mongoUser._id,      // Mongo ID
            room,
            hotel: roomData.hotel._id,
            guests,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalPrice,
        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            //to: req.user.email,
            to: mongoUser.email,
            subject: "Hotel Booking Details",
            html: `
            <h2>Your Booking Details</h2>
            <p>Dear ${mongoUser.name || "Guest"}</p>
            <p>Thankyou for bookings! Here is your details:</p>
            <ul>
               <li><strong>Booking ID:</strong> ${booking._id}</li>
               <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
               <li><strong>Location:</strong> ${roomData.hotel.address}</li>
               <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
               <li><strong>Total Amount:</strong> ${process.env.CURRENCY || "₹"} ${booking.totalPrice}</li>
               
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>If you make any changes, feel free to contact us.</p>
            `
        }

        //await transporter.sendMail(mailOptions)
        try {
            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error("Email failed:", mailError.message);
        }


        res.json({ success: true, message: "Booking created successfully", booking });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to create booking" });
    }
};


/*
export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guest } = req.body;

    const clerkUserId = req.auth.userId;
    if (!clerkUserId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const mongoUser = await User.findOne({ clerkId: clerkUserId });
    if (!mongoUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Room is not available" });
    }

    const roomData = await Room.findById(room).populate("hotel");

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = roomData.pricePerNight * nights;

    // ✅ STORE booking
    const booking = await Booking.create({
      user: mongoUser._id,
      room,
      hotel: roomData.hotel._id,
      guest,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalPrice,
    });

    // ✅ EMAIL FIX
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: mongoUser.email,
      subject: "Hotel Booking Details",
      html: `
        <h2>Your Booking Details</h2>
        <p>Dear ${mongoUser.name || "Guest"},</p>
        <p>Thank you for your booking! Here are your details:</p>
        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
          <li><strong>Location:</strong> ${roomData.hotel.address}</li>
          <li><strong>Check-in:</strong> ${booking.checkInDate.toDateString()}</li>
          <li><strong>Check-out:</strong> ${booking.checkOutDate.toDateString()}</li>
          <li><strong>Amount:</strong> ${process.env.CURRENCY || "$"} ${booking.totalPrice}</li>
        </ul>
        <p>We look forward to welcoming you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Booking created & email sent" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create booking" });
  }
};




/*
export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guest } = req.body;
        // const user = req.user._id;
        // const user = req.userId;
        //const user = req.auth.userId;
        const clerkUserId = req.auth.userId;
        //const clerkUserId = req.auth().userId; // "user_34VRl32naCIQTsoZrYjxAv3cizz"

        // ✅ Step 1: Find MongoDB user by clerkId
        const mongoUser = await User.findOne({ clerkId: clerkUserId });
        if (!mongoUser) {
            return res.status(404).json({ success: false, message: "User not found in DB" });
        }

        //Before Booking check availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        });

        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" });

        }

        //get total price for room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //calculate total price per night
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;

        //create booking
        const booking = await Booking.create({
            user: mongoUser._id,
            room,
            hotel: roomData.hotel._id,
            guest,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Failed to  create booking" });

    }
};*/

//Api to get all booking for a user
//GET/api/booking/user
export const getUserBookings = async (req, res) => {
    try {
        /*
        const clerkUserId = req.auth.userId;

        const mongoUser = await User.findOne({ clerkId: clerkUserId });
        if (!mongoUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }*/
       const mongoUser = req.user; // ✅ middleware se aaya

        const bookings = await Booking.find({ user: mongoUser._id })
            .populate("room hotel")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};


/*
export const getUserBookings = async (req, res) => {
    try {
        //const user = req.user._id;
        //const user = req.userId;
        const user = req.auth.userId;
        const bookings = (await Booking.find({ user }).populate("room hotel")).sort({ createdAt: -1 })
        res.json({ success: true, bookings })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" })

    }
}
*/
//
/*
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        // const hotel = await Hotel.findOne({ owner: req.userId })
        //const hotel = await Hotel.findOne({ owner: req.user._id})
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found" })
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate("room hotel user").sort({ createdAt: -1 });
        //total bookings 
        const totalBookings = bookings.length;

        //toal revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0)
        res.json({ success: true, dashboardData: { totalBookings, totalRevenue } })
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" })
    }
}*/

export const getHotelBookings = async (req, res) => {
    try {
        /*const clerkUserId = req.auth.userId;

        const mongoUser = await User.findOne({ clerkId: clerkUserId });
        if (!mongoUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }*/
       const mongoUser = req.user;
 

        const hotel = await Hotel.findOne({ owner: mongoUser._id });
        if (!hotel) {
            return res.json({ success: false, message: "No Hotel Found" });
        }

        const bookings = await Booking.find({ hotel: hotel._id })
            .populate("room hotel user")
            .sort({ createdAt: -1 });

        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

        res.json({
            success: true,
            dashboardData: { totalBookings, totalRevenue },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};
