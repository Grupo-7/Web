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
            var cadena1 = 'SELECT COUNT(carnet) AS \'count\' FROM ALUMNO WHERE carnet = \''+query['carnet']+'\';';
            
            connection.query(cadena1, function(err,result){
                if(result['count'] == 0){
                    var cadena2 = 'INSERT INTO ASISTENCIA VALUES('+query['evento']+',\''+query['carnet']+'\');';
                    connection.query(cadena2, function(err,result){
                        if(err){
                            res.render('android', { response: JSON.stringify({response: 'Su carnet ya fue registrado'}) });
                        }else{
                            res.render('android', { response: JSON.stringify({response: 'Registro exitoso'}) });
                        }
                    });
                }else{
                    res.render('android', { response: JSON.stringify({response: 'Carnet no encontrado'}) });
                }
                
            });
            break;
            
        case 'eventos':
            console.log('eventos');
            var cadena = 'SELECT E.id_evento, E.nombre, E.inicio, E.final, E.estado FROM EVENTO E WHERE E.estado = 1;';
            connection.query(cadena, function(err,result){
                if(err){
                    res.render('android', { response: JSON.stringify({response: 'Error'}) });
                }else{
                    res.render('android', { response: JSON.stringify({response: result}) });
                }
            });
            break;    
        default:
            result = 'Invalido';
            res.render('android', { response: JSON.stringify({response: result}) });
    }
    
});

module.exports = router;
