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
	    case 'login':
		    var query = 'SELECT carnet,bloqueada,libre_hasta,password FROM USUARIO WHERE CARNET = \''+query['carnet']+'\';';
            connection.query(query,function(error,result){
     			 if(error){
                    //ERROR DE CONEXION
                    res.render('android', { response: JSON.stringify({response: 'No se puede conectar a la base de datos.', codigo: 0}) });
      			 }else {
        		    if (result.length > 0){
                        if(result['password'] === query['password']){
                            //CREDENCIALES CORRECTAS
                            if(result['bloqueada'] == 0){
                                //LA CUENTA NO ESTA BLOQUEADA
                                res.render('android', { response: JSON.stringify({response: 'Login exitoso.', codigo: 1}) });
                            }else{
                                //CUENTA BLOQUEADA
                                var query = 'SELECT carnet FROM USUARIO WHERE carnet=\''+query['carnet']+'\' AND libre_hasta < NOW();';
                                connection.query(query,function(err,result){
                                    if(result.length > 0){
                                        //YA PUEDE DESBLOQUEARSE
                                        var query = 'UPDATE USUARIO SET bloqueada=0 WHERE carnet=\''+query['carnet']+'\';'
                                        connection.query(query,function(err,result){
                                            res.render('android', { response: JSON.stringify({response: 'La cuenta fue desbloqueada. Login exitoso.', codigo: 1}) });
                                        });
                                    }else{
                                        //SIGUE BLOQUEADA
                                        res.render('android', { response: JSON.stringify({response: 'Su cuenta esta bloqueada.', codigo: 0}) });
                                    }
                                });
                            }
                        }else{
                            //CREDENCIALES INCORRECTAS
                            if(result['bloqueada'] >= 2){
                                //BLOQUEAR
                                var query = 'UPDATE USUARIO SET bloqueada=3,libre_hasta=ADDTIME(NOW(),\'3:00:00\') WHERE carnet=\'' + result['carnet'] + '\';';
                                connection.query(query,function(err,result){
                                    res.render('android', { response: JSON.stringify({response: 'Por seguridad se ha bloqueado esta cuenta.', codigo: 0}) });
                                });
                            }else{
                                //SUMAR A INTENTOS FALLIDOS
                                var b = result['bloqueada']+1;
                                var query = 'UPDATE USUARIO SET bloqueada=' + b + ' WHERE carnet=\'' + result['carnet'] + '\';';
                                connection.query(query,function(err,result){
                                    res.render('android', { response: JSON.stringify({response: 'Credenciales incorrectas.', codigo: 0}) });
                                });
                            }
                        }
                    }else{
                        //CUENTA NO EXISTE
                        res.render('android', { response: JSON.stringify({response: 'Cuenta no valida.', codigo: 0}) });
                    }
      			}
    		});
        default:
            result = 'Invalido';
            res.render('android', { response: JSON.stringify({response: result}) });
    }
    
});

module.exports = router;
