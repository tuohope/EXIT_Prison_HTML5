var express = require('express');
var router = express.Router();
var path = require('path');


router.get('/', function(req, res, next) {
    res.sendfile('arduino.html');
});

module.exports = router;
