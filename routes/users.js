var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
    res.sendfile('arduino.html');
  //   res.sendFile(express.static(path.join(__dirname, 'arduino.html')))
});


module.exports = router;
