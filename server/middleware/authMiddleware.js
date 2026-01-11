import { getAuth } from "@clerk/express";
import User from "../models/User.js";


export const attachUser = async (req, res, next) => {
  try {
    const clerkUserId = req.auth?.userId;

    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    let user = await User.findOne({ clerkId: clerkUserId });

    // ✅ Auto-create user if not exists (IMPORTANT)
    if (!user) {
      user = await User.create({
        clerkId: clerkUserId,
        email: req.auth.sessionClaims?.email,
        name: req.auth.sessionClaims?.name || "Guest User",
        role: "user",
      });
    }

    req.user = user; // 🔥 THIS WAS MISSING
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Auth failed" });
  }
};
export const protect = attachUser;


/*
export const attachUser = async (req, res, next) => {
  try {
    // ✅ Clerk session from request
     const { userId } = getAuth(req); 

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // ✅ Find or auto-create user
    let user = await User.findOne({ clerkId: userId });
    if (!user) {
      user = await User.create({ clerkId: userId });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};*/




/*import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    if (!req.auth) {
  return res.status(401).json({
    success: false,
    message: "Clerk auth not initialized",
  });
}


    // ✅ NEW Clerk API (no deprecation)
    //const { userId } = req.auth();
    //const userId = req.auth.userId;
    const session = auth(req);  // ✅ new function-style API
    const userId = session?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    let user = await User.findOne({ clerkId: userId });

    // Auto-create user
    if (!user) {
      user = await User.create({ clerkId: userId });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};



/*import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // ✅ Clerk correct way

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    // 🔥 User auto-create if not exists
    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      user = await User.create({
        clerkId: userId,
      });
    }

    req.user = user;
    req.userId = user._id;
    next();

  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};



/*
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // Clerk auth

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;        // full user
    req.userId = user._id;  // Mongo _id
    next();

  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
*/

/*
import User from "../models/User.js";


//middlewre to  check user is authentication

export const protect = async (req,res, next) => {
    //const {userId} = req.auth;
    const { userId } = req.auth();
     
    if(!userId) {
        res.json({success: false, message: "not authenticated"})
    }else{
        const user = await User.findById(userId);
        //req.user = user;
        req.userId = userId;
        next();
    }
}  

*/

