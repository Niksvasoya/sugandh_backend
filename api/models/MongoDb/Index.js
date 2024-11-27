const mongoose = require("mongoose");

// Connection URI 
const dbURI = "mongodb+srv://patelmitaxi20:KTN7PF2MlQptPvMR@cluster0.iru17.mongodb.net/data";
// const dbURI = "mongodb://localhost:27017/data";

// Connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

// Connect to MongoDB
mongoose.connect(dbURI, options)
  .then(() => {
    console.log("Connected to MongoDB");
    connectionCallback(); // Call the connection callback once connected
  })
  .catch(err => {
    console.error("Error connecting to MongoDB", err);
  });

let connectionCallback = () => {};

// Export a function to set the connection callback
module.exports.onConnect = (callback) => {
  connectionCallback = callback;
};

// Example usage of onConnect callback
module.exports.onConnect(() => {
  // This code will run once the database connection is established
  console.log("Database connection established. You can start querying now.");
});


// const mongoose = require("mongoose");
// // const uri = process.env.MONGODB_URI;

// // mongoose
// //      .connect('mongodb+srv://sylvia:Telemed1994S@telemed-east.1b4og.mongodb.net/telemedmd_db?retryWrites=true&w=majority', {
// //         useNewUrlParser: true,
// //         useUnifiedTopology: true,
// //         useCreateIndex: true
// //         })
// //      .then(() => console.log('DB connected successfully!'))
// //      .catch(e => {
// //          console.error('Connection error', e.message)
// //      })

// mongoose
//   .connect(`mongodb://127.0.0.1:27017/data`, {
//     //prod
//     //mongoose.connect(`mongodb://macapp:${encodeURIComponent('Macapp@2021')}@localhost:27017/macApp`, { //dev
//     // mongoose.connect(`mongodb://macapp:${encodeURIComponent('Macapp@2021')}@18.221.200.184:27017/macApp`, { //local
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true,
//   })
//   .then(() => console.log("DB connected successfully!"))
//   .catch((e) => {
//     console.error("Connection error", e.message);
//   });

// const db = mongoose.connection;

// module.exports = db;
