var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.carnet==null){
  		res.redirect('/');
	}else{
		res.render('reporte', { ucar: req.session.carnet });
	}
});

module.exports = router;