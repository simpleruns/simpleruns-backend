const Position = require("../models/position");
const Tolls = require("../models/tolls");

const position_index = (req, res) => {
    Position.find(function (err, positions) {
        if (req.query.user) {
            positions = positions.filter(item => (item.userId === req.query.user));
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
    const userId = req.query.userId;

    Position.find(function (err, positions) {
        if (userId) {
            positions = positions.filter(item => (item.userId === userId));
        }
        totalCount = positions.length;
    });

    Tolls.find(function (err, tolls) {
        if (userId) {
            tolls = tolls.filter(item => (item.userId === userId));
        }
        initialTolls = tolls;
    });

    Position.findById(req.params.id, function (err, position) {
        if (!position) {
            res.status(404).send("Position not found");
        } else {
            Position.findByIdAndRemove(req.params.id)
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

module.exports = {
    position_index,
    position_create,
    position_delete,
    tolls_index,
    tolls_update
}