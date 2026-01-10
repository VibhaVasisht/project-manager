import express from 'express';
import User from '../models/User.js';
import { updateUser, deleteUser } from '../controllers/user.controller.js';
import {protect} from '../middleware/auth.middleware.js';

const router = express.Router();
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, deleteUser);
export default router;
