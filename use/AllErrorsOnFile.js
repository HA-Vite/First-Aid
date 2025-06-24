const fs   = require('fs'); // importing Node.js file system module
const path = require('path');
const LOG_FILE = path.join( __dirname, '..', 'Logs', 'Errors.json');

function logErrorToFile(errorEntry) {
  try 
  {
    const exists = fs.existsSync(LOG_FILE); //check the existance of the record (Errors.json)
    // Reading previous errors and checking for empty array []
    const data = exists ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8')) : [];
    data.push(errorEntry); // Adding a new error record
    fs.writeFileSync(LOG_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } 
  // if writing fails, show a console warning
  catch (err) {console.error(' Sorry , Failed to write error : ', err.message);
  }
}
module.exports = logErrorToFile;       // export for use in server.js
