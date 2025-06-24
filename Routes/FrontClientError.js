const express = require('express'); // import Express
const router = express.Router(); // create a new router
const AllErrorFile = require('../use/AllErrorsOnFile.js');

router.post('/', (req, res) => {
  const { message, stack, url, userAgent } = req.body; // extract error details sent from front
  const FroStru =   // Building the error record structure
  {
    source: 'Front',
    timestamp: new Date().toISOString(),
    message,
    stack,
    url,
    userAgent
  };
  AllErrorFile(FroStru); // Adding the error record to Errors.json
  res.status(200).json({ success: true }); // respond back to fetch() in React
});
module.exports = router; // exports router for server.js
