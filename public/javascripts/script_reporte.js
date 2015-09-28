var socket = io.connect();

socket.on('connect',function(){
	console.log('llego');
	socket.emit('reporte_solicitar_eventos');
});

function enviardatos (mensaje,callback){
	if(mensaje == ""){
		callback("error_vacio");
	}else{
		socket.emit('reporte_ver',mensaje);
		callback('bien');
	}
}

document.getElementById("reporte_boton").addEventListener("click", function () {
	enviardatos(document.getElementById('reporte_evento').value,function(resultado){
		if(resultado=='bien'){
			//todo bien.
		}else if(resultado=='error_vacio'){
			document.getElementById('reporte_reporte').innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>No ha seleccionado un evento</div>";
		}
	});
});