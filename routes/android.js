var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'admin',
        database: 'pruebas',
        port: 3306
    });
    
    connection.connect(function(error){
        if(error){
            throw error;
        }else{
            //console.log('Conexion correcta.');
        }
    });
    
    var result = null;
    
    switch(query['op']){
        case 'asistir':
            console.log('asistir');
            var cadena = 'INSERT INTO ASISTENCIA VALUES('+query['evento']+',\''+query['carnet']+'\');';
            connection.query(cadena, function(err,result){
                if(err){
                    res.render('android', { response: JSON.stringify({resultado: 'Error'}) });
                }else{
                    res.render('android', { response: JSON.stringify({resultado: 'Exito'}) });
                }
            });
            break;
            
        default:
            result = 'Invalido';
            res.render('android', { response: result });
    }
    
});

module.exports = router;