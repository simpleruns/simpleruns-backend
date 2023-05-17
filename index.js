require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/userRoutes");
const adminDriverRoutes = require("./routes/admin/driverRoutes");
const adminCustomerRoutes = require("./routes/admin/customerRoutes");
const settingRoutes = require("./routes/settingRoutes");
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
connection();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/public', express.static('public'));

// routes
app.use("/api/users", userRoutes);

//admin 
app.use("/api/admin/drivers", adminDriverRoutes);

app.use("/api/admin/customers", adminCustomerRoutes);

//setting
app.use("/api/settings", settingRoutes);

app.get('/api/settings/positions', (req, res) => {
    res.send(req.body);
})


// listening on port
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
