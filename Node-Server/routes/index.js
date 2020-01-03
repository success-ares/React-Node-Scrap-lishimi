var express = require('express');
var router = express.Router();
var scrapController = require('../controller/scrapController');
var scrap = new scrapController();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/scrap',scrap.scrapAction);

module.exports = router;
