var should = require('should');
var io = require('socket.io-client');

var socketURL = 'http://0.0.0.0:80';

var options ={
  transports: ['websocket'],
  'force new connection': true
};



describe("Main Server",function(){
  it('Deberia dar un resultado correcto', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_prueba',
        fi:'2019-11-24 17:15:10',
        ff:'2019-11-24 19:15:10'});

    });

    client1.on('resultado', function(respuesta){
      respuesta.should.equal("correcto");
      client1.disconnect();
      done();

    });
  });

  it('Deberia dar un resultado incorrecto', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'14',
        fi:'2019-11-24 17:15:10',
        ff:'2019-11-24 19:15:10'});

    });

    client1.on('resultado', function(respuesta){
      respuesta.should.equal("error1");
      client1.disconnect();
      done();

    });
  });

  it('Deberia dar un resultado de error por la fecha de los meses de 30 días', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_prueba',
        fi:'2019-04-31 17:15:10',
        ff:'2019-04-31 19:15:10'});

    });

    client1.on('resultado', function(respuesta){
      respuesta.should.equal("error01_fecha");
      client1.disconnect();
      done();

    });
  });

  it('Deberia dar un resultado de error por la fecha de febrero', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_prueba',
        fi:'2019-02-30 17:15:10',
        ff:'2019-02-30 19:15:10'});

    });

    client1.on('resultado', function(respuesta){
      respuesta.should.equal("error01_fecha");
      client1.disconnect();
      done();

    });
  });


  it('Deberia dar un resultado de error por el año bisiesto', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_prueba',
        fi:'2015-02-29 17:15:10',
        ff:'2015-02-29 19:15:10'});

    });

    client1.on('resultado', function(respuesta){
      respuesta.should.equal("error01_fecha");
      client1.disconnect();
      done();

    });
  });



  it('Deberia terminar el evento', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_terminado',
        fi:'2019-11-24 17:15:10',
        ff:'2019-11-24 19:15:10'});
    });

    client1.on('resultado', function(respuesta){
      client1.emit('solicitar_llenar');

    });

    client1.on("Llenar", function (data) {
     data2=data.split(";");
     if(data2.length>0){
       var contador=data2.length-1;
       while(0<contador){
         d1=data2[contador].split(",");
         if('evento_terminado'== d1[0]){
           client1.emit('terminar_evento',{
             id_evento_terminado:d1[1],
             nombre_usuario:'user1',
             contrasena:'123'
           });
           contador=0;}
           contador--;}
         }
       });

    client1.on('resultado2', function(respuesta){
      respuesta.should.equal("correcto");
      client1.disconnect();
      done();

    });
  });

  it('No deberia terminar el evento', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_terminado',
        fi:'2019-11-24 17:15:10',
        ff:'2019-11-24 19:15:10'});
    });

    client1.on('resultado', function(respuesta){
      client1.emit('solicitar_llenar');
      
    });

    client1.on("Llenar", function (data) {
     data2=data.split(";");
     if(data2.length>0){
       var contador=data2.length-1;
       while(0<contador){
         d1=data2[contador].split(",");
         if('evento_terminado'== d1[0]){
           client1.emit('terminar_evento',{
             id_evento_terminado:d1[1],
             nombre_usuario:'user1',
             contrasena:'122'
           });
           contador=0;}
           contador--;}
         }
       });

    client1.on('resultado2', function(respuesta){
      respuesta.should.equal("error_contrasena");
      client1.disconnect();
      done();
      
    });
  });

  it('Comprobar si se lee el formato de la fecha correctamente', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_evento', {
        nombre:'evento_prueba',
        fi:'2019-11-24 17:15:10',
        ff:'2019-11-24 19:15:10'});

    });

    client1.on('resultado', function(respuesta){
      respuesta.should.equal("correcto");
      client1.disconnect();
      done();
      
    });
  });


// Necesita arreglarse - Julio
/*  it('Estudiantes_carga_correcto', function(done){
>>>>>>> dev_julio
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_estudiante', {maestro:'201213234',seccion:'A',data:'201213230,Julio Flores'});
    });

    client1.on('estudiante_insertado', function(respuesta){
      respuesta.should.equal("correcto");
      client1.disconnect();
      done();
      
    });
  });*/

  it('Estudiantes_carga_error_vacio', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_estudiante', {maestro:'',seccion:'',data:','});
    });

    client1.on('estudiante_insertado', function(respuesta){
      respuesta.should.equal("error_vacio");
      client1.disconnect();
      done();
      
    });
  });

  it('Estudiantes_carga_error_numero_campos', function(done){
    var client1 = io.connect(socketURL, options);

    client1.on('connect', function(data){
      client1.emit('insertar_estudiante', {maestro:'201213234',seccion:'A',data:'201213230,Julio Flores,campo_extra'});
    });

    client1.on('estudiante_insertado', function(respuesta){
      respuesta.should.equal("error_campos");
      client1.disconnect();
      done();
    });
  });
  
// Necesita arreglarse - Julio
/*  it('Estudiantes_estudiante_individual_agregar_exito',function(done){
    var client1 = io.connect(socketURL,options);

    client1.on('connect',function(data){
      client1.emit('estudiante_individual',{modo:'agregar',nombre:'Julio 2',carnet:'200013230',maestro:'201213234',seccion:'A'});
    });

    client1.on('resultado_individual',function(respuesta){
      respuesta.should.equal('exito');
      client1.disconnect();
      done();
    });
  });*/

  // Prueba mal hecha - Julio
  /*it('reporte_seleccionar_reporte_vacio',function(done){
    var client1 = io.connect(socketURL,options);

    client1.on('connect',function(data){
      var estonovaaservir = require('../public/javascripts/script_reporte.js');
      estonovaaservir.enviardatos('',client1,function(resultado){
        resultado.should.equal('error_vacio');
        client1.disconnect();
        done();
      });
    });
  });*/

it('Login_correcto_darpermiso',function(done){
    var usuario='222222222';
	var contarasena='normal';
 var client1 = io.connect(socketURL, options);
client1.on('connect', function(data){
      client1.emit('validar_login', {
        carnet:usuario,
        password:contarasena});

    });

    client1.on('resultado_login', function(respuesta){
	respuesta_aux=respuesta.valor;
	respuesta_aux.should.equal(1);
client1.disconnect();
      done();
    });
	

  });

it('Login_incorrecto_nodarpermiso',function(done){
       var usuario='este usuario fijo no existe';
	var contarasena='esta contraseña fijo no existe';
 var client1 = io.connect(socketURL, options);
client1.on('connect', function(data){
      client1.emit('validar_login', {
        carnet:usuario,
        password:contarasena});

    });

    client1.on('resultado_login', function(respuesta){
	respuesta_aux=respuesta.valor;
	respuesta_aux.should.equal(0);
client1.disconnect();
      done();
    });

  });

  it('reporte_ver_reporte_error',function(done){
    var cliente = io.connect(socketURL,options);

    cliente.on('connect',function(data){
      cliente.emit('ver_reporte','');
    });

    cliente.on('resultado_reporte',function(data){
      data.should.equal('error');
      cliente.disconnect();
      done();
    });
  });

it('Crearcuenta_correcto_exito',function(done){
       var usuario='200113234';
	var contarasena='123';
	var nombre1= 'Pedro';
	var apellido1= 'Gutierrez'
 var client1 = io.connect(socketURL, options);
client1.on('connect', function(data){
      client1.emit('crear_cuenta', {
        carnet:usuario,
        password:contarasena,
	nombre: nombre1,
	apellido: apellido1,
	rol:0,
	bloqueada:0	});

    });

    client1.on('resultado_crear_cuenta', function(respuesta){
	respuesta_aux=respuesta.valor;
	respuesta_aux.should.equal(1);
	client1.disconnect();
      done();
    });

  });

it('Eliminarcuenta_correcto_exito',function(done){
       var usuario='200113234';
 var client1 = io.connect(socketURL, options);
client1.on('connect', function(data){
      client1.emit('eliminar_cuenta', {
        carnet:usuario});

    });

    client1.on('resultado_eliminar_cuenta', function(respuesta){
	respuesta_aux=respuesta.valor;
	respuesta_aux.should.equal(1);
	client1.disconnect();
      done();
    });

  });

});

