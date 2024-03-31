import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


// for creating a list
router.get('/create',verifyToken, createListing);

export default router;