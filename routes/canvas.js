/**
 * Created by bgh29 on 2017-07-24.
 */
var express = require('express');
var router = express.Router();
/* GET users listing. */

router.get('/', function(req, res, next) {
    res.render('paint');
});

module.exports = router;