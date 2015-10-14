var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'pruebas',
  port: 3306
});

connection.connect(
  function(error){
    if(error){
      throw error;
    }else{
      //console.log('Conexion correcta.');
    }
  });

/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.session.carnet == ''){
		res.render('index', { ucar: '' ,msj:'nada'});
	}else{
		res.render('index', { ucar: req.session.carnet ,msj:'nada'});
	}
}).post('/',function(req,res,next){
	switch(req.body.modo){
		case 'login':
		if(req.body.carnet!='admin'){
			var query= connection.query('SELECT CARNET FROM USUARIO WHERE CARNET = ? AND PASSWORD = ?',[req.body.carnet,req.body.pass],function(err,result){
				if(err){
					throw err;
					res.render('index',{ucar:'',msj:'fallo'});
				}
				if(result.length > 0){
					req.session.carnet;
					req.session.carnet = req.body.carnet;
					res.render('index',{ucar:req.session.carnet,msj:'exito'});
				}else{
					res.render('index',{ucar:'',msj:'fallo'});
				}
			});
		}else{
			console.log('admin?');
			req.session.carnet = 'admin';
			res.render('index',{ucar:req.session.carnet,msj:'admin'});
		}
		break;
		case 'salir':
		req.session.destroy();
		res.render('index', { ucar: '',msj:'nada' });
	}
	
	
});

module.exports = router;
