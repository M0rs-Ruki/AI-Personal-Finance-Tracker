
import express from "express";
import { sendEmail } from "../utils/sendEmail.js";
import { submitFeedback, getFeedback } from "../controllers/feedbackController.js";
import {log} from 'console';


const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
})

router.get('/how-it-works', (req, res) => {
    res.render('how-it-works');
})

router.get('/about', (req, res) => {
    res.render('about');
})

router.get('/features', (req, res) => {
    res.render('features');
})

router.get('/contact', (req, res) => {
    res.render('contact');
})

router.post('/submit-feedback', submitFeedback );

router.get('/api/feedback', getFeedback )


router.post('/send-email', async (req, res) => {
  const { fullName, email, subject, message } = req.body;

  const result = await sendEmail({
    from: email, 
    subject,
    message,
    name: fullName,
  });

  if (result.success) {
    res.send('Email sent successfully!');
  } else {
    res.status(500).send('Failed to send email.');
  }
});


export default router;