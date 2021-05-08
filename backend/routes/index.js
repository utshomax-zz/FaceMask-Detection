let router = require('express').Router();

//set default API response
router.get('/', function(req, res) {
    res.json({
        status: 'API Works',
        message: 'Welcome to Facemask API'
    });
});

//Import dctdata Controller
var stateController = require('../controllers/stateController');

// dctdata routes
router.route('/dtcdata')
    .get(stateController.index)
    .post(stateController.add);

//Export API routes
module.exports = router;