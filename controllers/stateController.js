var Dtc = require('../model/maskModel');
exports.add = function (req, res) {
    var data = new Dtc({
        state:req.body.state
    });
    //Save and check error
    data.save(function (err) {
        if (err)
            res.json(err);

        res.json({
            message: "New state Added!",
            data: data
        });
    });
};

// View Dtc
exports.index = function (req, res) {
    Dtc.get(function (err, Dtc) {
        if (err)
            res.json({
                status: "error",
                message: err
            });
        res.json({
            status: "success",
            message: "Got states Successfully!",
            data: Dtc       
        });
    },50);
};