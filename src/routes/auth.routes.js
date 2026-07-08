import express from 'express';
import {signup, signin, signout} from '#controllers/auth.controller.js';

const router = express.Router();


//NOTE: we no longer need this new once below
//router.post('/sign-up' , (req, res) => {
  // Handle user sign-up logic here
 // res.send('POST /api/auth/sign-up response');
//});


router.post('/sign-up', signup);

router.post('/sign-in', signin);

router.post('/sign-out', signout);

export default router;