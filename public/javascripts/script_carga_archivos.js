var socket = io.connect();
socket.on("connect",function(){
	socket.emit('solicitar_llenar_pag_estudiantes');
});
socket.on('llenar_pag_estudiantes',function(datos){
	var list=document.getElementById("lista_secciones");
	list.options.length=0;
	var list2=document.getElementById("seccion_borrar_seccion");
	list2.options.length=0;
	var list3=document.getElementById("seccion_seleccionada");
	list3.options.length=0;
	data = datos.split(';');
	if (data.length>0){
		var contador = 0;
		for(contador; contador<data.length;contador++){	
			elemento = data[contador];
			var newOp = document.createElement("option");
			newOp.text = elemento;
			newOp.value = elemento;
			var newOp2 = document.createElement("option");
			newOp2.text = elemento;
			newOp2.value = elemento;
			var newOp3 = document.createElement("option");
			newOp3.text = elemento;
			newOp3.value = elemento;
			list.options.add(newOp);
			list2.options.add(newOp2);
			list3.options.add(newOp3);
		}
		socket.emit('solicitar_llenar_lista_estudiantes',list3.value);
	}
});
socket.on('llenar_lista_estudiantes',function(datos){
	var espacio = document.getElementById('lista_estudiantes');
	var listota = "<table class=\"table table-hover\"><thead><tr><th>Nombre</th><th>Carnet</th></tr></thead><tbody>";
	var data = datos.split(';');
	for(var i = 0;i<data.length;i++){
		listota = listota + "<tr><td>" + data[i].split('~')[0]+"</td><td>"+data[i].split('~')[1]+"</td></tr>";
	}
	listota = listota + "</tbody></table>";
	espacio.innerHTML = listota;
});

$(document).ready(function () {
	LimpiarDatosFormulario();
	$('#btn_cargar_archivo').click(function() {
		CargarArchivo();
	});
	document.getElementById('seccion_seleccionada').onchange = function(){		
		socket.emit('solicitar_llenar_lista_estudiantes',document.getElementById('seccion_seleccionada').value);
	};
});

//Funcion que limpia los valores del fileupload
function LimpiarDatosFormulario(){
	$("#flu_carga").val("");
}

//Funcion que carga el archivo al servidor
function CargarArchivo(){
	try{
		if(VerificarArchivo()){
			//Se procede a hacer la carga del archivo
			input = document.getElementById('flu_carga');
			//var archivo = input.files[0];
			LeerArchivo(input.files[0], function(e) {
				//se procede a leer el archivo
				var leido= e.target.result;
				var i;
				var lista=leido.split('\n');
				for(i=0;i<lista.length-1;i++){
					socket.emit("insertar_estudiante",{maestro:'201213234',seccion:document.getElementById('lista_secciones').value,data:lista[i]});
				}
				
			});
			alert("Archivo cargado de manera exitosa.")
		}
		else alert("Debe seleccionar un archivo.");
	}
	catch(err)
	{
		alert(err.message);
	}
}

//Funcion que verifica el archivo
function VerificarArchivo()
{
	try{
		var Archivo = $("#flu_carga").val();
		if (Archivo == "") return false;
		return true;
	}
	catch(err){
		alert("Se ha producido un error al verificar el archivo. \\n" + err.message);
		return false;
	}
}

//Funcion que lee el archivo
function LeerArchivo(file, callback){
	try{
		var reader = new FileReader();
		reader.onload = callback
		reader.readAsText(file);
	}
	catch(err){
		alert("Error al leer el archivo. \n" + err.message);
	}

}