require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/userRoutes");
const adminDriverRoutes = require("./routes/admin/driverRoutes");
const cookieParser = require('cookie-parser')

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
connection();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use('/public', express.static('public'))

// routes
app.use("/api/users", userRoutes);

//admin 
app.use("/api/admin/drivers", adminDriverRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
})


// listening on port
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
