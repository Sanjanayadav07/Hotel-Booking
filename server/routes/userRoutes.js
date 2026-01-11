
import express from'express';
import { protect} from '../middleware/authMiddleware.js';
import { getUserData, storeRecentSecarchCities} from '../controllers/userController.js';


const userRouter = express.Router();

userRouter.get('/', protect, getUserData);
userRouter.post('/store-recent-search', protect, storeRecentSecarchCities);

export default  userRouter;
