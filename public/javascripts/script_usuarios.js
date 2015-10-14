var socket = io.connect();
socket.on('connect',function(){
	socket.emit('solicitar_llenar_usuarios');
});
socket.on('llenar_usuarios',function(data){
	var lista = document.getElementById("b_carnet");
	lista.options.length = 0;
	var datos = data.split(';');
	if(datos.length>0){
		var contador=0;
    	while(contador<datos.length){
      		var newOp = document.createElement("option");
      		newOp.text = datos[contador];
      		newOp.value = datos[contador];
      		lista.options.add(newOp);
      		contador++;
      	}
    }
	
});
socket.on('insertar_usuario_resultado',function(data){
	console.log('entro');
	if(data == 'exito'){
	document.getElementById('Messages').innerHTML = "<div class=\"alert alert-success alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Creado con éxito</div>";
}else{
	document.getElementById("Messages").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Hubo un error con la base de datos, no se pudo crear</div>";
}
});
socket.on('borrar_usuario_resultado',function(data){
	if(data == 'exito'){
	document.getElementById('Messages').innerHTML = "<div class=\"alert alert-success alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Borrado con éxito</div>";
}else{
	document.getElementById("Messages").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Hubo un error con la base de datos, no se pudo borrar</div>";
}
});
$(function(){
	document.getElementById('boton_crear').addEventListener('click',function(){
		var nombre = document.getElementById('nombre').value;
		var apellido = document.getElementById('apellido').value;
		var carnet = document.getElementById('carnet').value;
		var pass = document.getElementById('pass').value;
		var rol = 1;
		var bloqueada = 0;
		socket.emit('insertar_usuario',{n:nombre,a:apellido,c:carnet,p:pass,r:rol,b:bloqueada});
		setTimeout(function(){
			socket.emit('solicitar_llenar_usuarios');
		},1000);
	});
	document.getElementById('boton_borrar').addEventListener('click',function(){
		socket.emit('borrar_usuario',{c:document.getElementById('b_carnet').value});
		setTimeout(function(){
			socket.emit('solicitar_llenar_usuarios');
		},1000);
	});
});