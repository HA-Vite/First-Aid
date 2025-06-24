// importing JavaScript Packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const FrontClient = require('./Routes/FrontClientError.js');// Handles /api/log-error
const AllErrorSend = require('./use/AllErrorsOnFile.js');// Sending all errors to Errors.json

const app = express(); // initializing express enviroment to run apps
app.use(express.json()); // json body parser to manage .json requests 


// Activating MiddleWares Applications 

// 1) CORS Config
// the only allowed domains that can connect to the First-Aid website 
const allowedOrigins = ['https://yourdomain.com','http://localhost:5000','http://localhost:5173'];
// Activating and Specifying the Configurations
app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'], // Determining that the only allowed requests are GET , POST
    allowedHeaders: ['Content-Type']
  })
);

// 2) Helmet Config
// Activating and Specifying the Configurations
app.use(
  helmet({
    contentSecurityPolicy: true , // CSP anti-malicious code 
    frameguard: { action: "deny" }, // iframe blocker  
    referrerPolicy: { policy: "no-referrer" }, // forbid sending referrer info between pages
    xssFilter: true ,// Anti Cross-Site Scripting tool (an old one but ok)
    hsts: { maxAge: 31536000, includeSubDomains: true }, // Forces the browser to connect via HTTPS
    noSniff: true // forbid running disguised scripts
  })
);

// 3) Rate Limiting Activation and Configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Specifying 15 minutes
  max: 100, // Setting the maximum limit as 100 request 
  message: " We're sorry , You have exceeded the maximum limit of requests , try again later "
});
app.use(limiter);

// 4) Data Validator Activation and Configuration
app.post('/api/feedback', // Feedback endpoint with the validation
// Length of the request shouldn't be more than 500 characters
  body('comment').isLength({ max: 500 }),
// Processing the validation inside the functions
  (req, res) => {
    const errors = validationResult(req);
// Sending the errors when found , under the flag of bad request
    if (!errors.isEmpty()) 
    {
// Return 400 if validation fails
      return res.status(400).json({ errors: errors.array() });
    }
    res.json({ success: true }); //else 
  }
);


const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 5) Error Logs
app.use('/api/log-error', FrontClient); // Linking the Front error catcher endpoint
// Catching the errors from the Backend and Server (for the error logs)
app.use((err, req, res, next) => {
  console.error('Backend Error Occured : ', err);
  // Record error structure on the JSON logs file
  AllErrorSend({
    source:    'Back',
    timestamp: new Date().toISOString(),
    message:   err.message,
    stack:     err.stack,
    url:       req.originalUrl,
    method:    req.method
  });
  res.status(500).json({ error: 'Internal Server Error' });
});




// initializing the Server , and Specifying the port that server will run on
// if port is not specified on client side , Run on port 5000
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {console.log(`The Server runs on port ${PORT}`);
});
