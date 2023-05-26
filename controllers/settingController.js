const Position = require("../models/position");
const Tolls = require("../models/tolls");
const User = require("../models/user");

const position_index = (req, res) => {
    Position.find(function (err, positions) {
        if (req.query.user) {
            positions = positions.filter(item => (item.userId == req.query.user));
        }
        var totalCount = positions.length;
        res.json({ positions, totalCount });
    });
};

const position_create = async (req, res) => {
    var totalCount = 0;
    var initialTolls;
    var tmpTolls;
    const userId = req.body.userId;
    await Position.deleteOne({ addressName: req.body.addressName, userId: userId }).then(function () {
        console.log('deleted');
    });

    Position.find(function (err, positions) {
        if (req.body.userId) {
            positions = positions.filter(item => (item.userId === req.body.userId));
        }
        totalCount = positions.length;
    });

    Tolls.find(function (err, tolls) {
        if (req.body.userId) {
            tolls = tolls.filter(item => (item.userId === req.body.userId));
        }
        initialTolls = tolls;
    });

    let position = await new Position(req.body);
    await position
        .save()
        .then((position) => {
            totalCount += 1;
            tmpTolls = Array.from({ length: totalCount }, () =>
                Array.from({ length: totalCount }, () => new Array(2))
            );
            for (let i = 0; i < totalCount; i++) {
                for (let j = 0; j < totalCount; j++) {
                    for (let k = 0; k < 2; k++) {
                        if (initialTolls && initialTolls[i] && initialTolls[i][j] && initialTolls[i][j][k])
                            tmpTolls[i][j][k] = initialTolls[i][j][k]
                        else
                            tmpTolls[i][j][k] = 0;
                    }
                }
            }
            // res.send(position);
        })
        .catch(function (err) {
            res.status(422).send("position update failed");
            console.log(err.message)
        });

    await Tolls.deleteOne({ userId: userId }).then(function () {
        console.log('deleted');
    });
    let tollsTable = await new Tolls({
        tmpTolls,
        userId
    });
    await tollsTable
        .save()
        .then(() => {
            res.status(200).json({ message: 'Table data saved successfully' });
        })
        .catch(function (err) {
            res.status(405).json({ message: 'Method not allowed' });
        });
}

const position_delete = async (req, res) => {
    var totalCount = 0;
    var initialTolls;
    var tmpTolls;
    const itemID = req.params.id;
    const userID = req.query.userId;
    console.log(itemID)
    Position.find(function (err, positions) {
        if (itemID) {
            positions = positions.filter(item => (item._id == itemID));
        }
        totalCount = positions.length;
    });

    Tolls.find(function (err, tolls) {
        if (itemID) {
            tolls = tolls.filter(item => (item._id == itemID));
        }
        initialTolls = tolls;
    });

    Position.findById(itemID, function (err, position) {
        if (!position) {
            res.status(404).send("Position not found");
        } else {
            Position.findByIdAndRemove(itemID)
                .then(function () {
                    totalCount -= 1;
                    tmpTolls = Array.from({ length: totalCount }, () =>
                        Array.from({ length: totalCount }, () => new Array(2))
                    );

                    for (let i = req.query.index + 1; i < totalCount; i++) {
                        for (let j = req.query.index + 1; j < totalCount; j++) {
                            for (let k = 0; k < 2; k++) {
                                if (initialTolls && initialTolls[i] && initialTolls[i][j] && initialTolls[i][j][k])
                                    tmpTolls[i - 1][j - 1][k] = initialTolls[i][j][k];
                                else
                                    tmpTolls[i - 1][j - 1][k] = 0;
                            }
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err.message)
                });
        }
    });

    await Tolls.deleteOne({ userId: userID }).then(function () {
        console.log('deleted');
    });

    let tollsTable = await new Tolls({
        tmpTolls,
        userID
    });

    await tollsTable
        .save()
        .then(() => {
            res.status(200).json({ message: 'Table data saved successfully' });
        })
        .catch(function (err) {
            res.status(405).json({ message: 'Method not allowed' });
        });
}

const tolls_index = async (req, res) => {
    Tolls.find(function (err, tolls) {
        if (req.query.user) {
            tolls = tolls.filter(item => (item.userId === req.query.user));
        }
        res.json(tolls);
    });
}

const tolls_update = async (req, res) => {
    const { data, userId } = req.body;
    Tolls.deleteMany({});

    const tolls = new Tolls({
        data,
        userId
    });

    await tolls
        .save()
        .then(() => {
            res.status(200).json({ message: 'Table data saved successfully' });
        })
        .catch(function (err) {
            res.status(405).json({ message: 'Method not allowed' });
        });
}

const user_index = async (req, res) => {
    User.findOne({ _id: req.params.id }, function (err, user) {
        if (!user) {
            res.status(404).send("This User doesn't exist!");
        } else {
            res.send(user);
        }
    });
}

const user_update = async (req, res) => {
    const url = req.protocol + '://' + req.get('host');

    const reqLogo = { 'url': (url + '/api/public/' + req.file.filename), 'type': req.file.mimetype };

    data = {};
    console.log(req.body)

    User.findOne({ _id: req.params.id }, async function (err, user) {
        if (user) {
            user.bank = req.body.bank;
            user.address = req.body.address;
            user.bsb = req.body.bsb;
            user.accountNo = req.body.accountNo;
            user.company = req.body.company;
            user.api = req.body.api;
            user.logo = reqLogo;
            user.abn = req.body.abn;
            console.log(user)

            await user
                .save()
                .then((user) => {
                    res.send(user);
                })
                .catch(function (err) {
                    res.status(422).send("User update failed");
                });

        } else {
            res.status(404).send("User not found");
        }
    })
}

const google_map = async (req, res) => {
    console.log(req.params.id)
    User.findOne({ _id: req.params.id }, async function (err, user) {
        if (user) {
            res.send(user.api);
        } else {
            res.status(404).send("User not found");
        }
    })
}

module.exports = {
    position_index,
    position_create,
    position_delete,
    tolls_index,
    tolls_update,
    user_index,
    user_update,
    google_map
}