var socket = io.connect();

$(document).ready(function () {
	LimpiarDatosFormulario();
	$('#btn_cargar_archivo').click(function() {
		CargarArchivo();
	});
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
		for(i=0;i<lista.length;i++){
			socket.emit("insertar_estudiante",lista[i]);
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