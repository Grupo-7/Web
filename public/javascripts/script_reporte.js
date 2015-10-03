var socket = io.connect();

socket.on('connect',function(){
	console.log('llego');
	socket.emit('reporte_solicitar_eventos');
});
socket.on('reporte_eventos',function(datos){
	var list=document.getElementById("reporte_evento");
	list.options.length=0;
	data = datos.split(';');
	if (data.length>0){
		var contador = 0;
		for(contador; contador<data.length;contador++){	
			xdata=data[contador].split('~');
			var newOp = document.createElement("option");
			newOp.text = xdata[1];
			newOp.value = xdata[0];
			list.options.add(newOp);
		}
	}
});

function enviardatos (mensaje,callback){
	if(mensaje == ""){
		callback("error_vacio");
	}else{
		socket.emit('ver_reporte',mensaje);
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

socket.on('resultado_reporte',function(datos){
	if(datos!=''){
		var espacio = document.getElementById('reporte_reporte');
		var listota = "<table class=\"table table-hover\"><thead><tr><th>Carnet</th><th>Nombre</th></tr></thead><tbody>";
		var data = datos.split(';');
		for(var i = 0;i<data.length;i++){
			listota = listota + "<tr><td>" + data[i].split('~')[0]+"</td><td>"+data[i].split('~')[1]+"</td></tr>";
		}
		listota = listota + "</tbody></table>";
		espacio.innerHTML = listota;
		console.log(datos);
	}else{
		var espacio = document.getElementById('reporte_reporte');
		var listota = "<table class=\"table table-hover\"><thead><tr><th>Carnet</th><th>Nombre</th></tr></thead><tbody>";
		listota = listota + "</tbody></table>";
		espacio.innerHTML = listota;
	}
});