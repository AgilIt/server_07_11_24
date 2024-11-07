const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../config/s3');

const router = express.Router();

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  body('phone').matches(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
    .withMessage('Please enter a valid French phone number'),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('address').trim().notEmpty(),
  body('postalCode').trim().notEmpty(),
  body('country').trim().notEmpty()
];

router.post('/register', validateRegistration, userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(auth);
router.put('/profile', userController.updateProfile);
router.post('/profile/photo', upload.single('profilePhoto'), userController.uploadProfilePhoto);
router.delete('/account', userController.deleteAccount);

module.exports = router;