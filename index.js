require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require('cookie-parser')

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
connection();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// routes
app.use("/api/users", userRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
})


// listening on port
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
