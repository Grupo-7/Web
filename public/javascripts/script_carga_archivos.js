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
				$('#txt_resultado_lectura').text(e.target.result);
				document.getElementById('txt_resultado_lectura').innerHTML = "<p>"+e.target.result+"</p>";
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
		var leido = reader.readAsText(file);
		var socket = io.connect();
		var i;
		for(i=0;i<leido.split('\n').lenght;i++){}
			socket.emmit("estudiante",{leido.split('\n')[i]});
		}
	}
	catch(err){
		alert("Error al leer el archivo. \\n" + err.message);
	}
    
}