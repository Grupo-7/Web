var socket = io.connect();
socket.on("connect", function () {
  socket.emit('solicitar_llenar');
});
socket.on("Llenar", function (data) {
  var list = document.getElementById('Lista_eventos');
  list.options.length=0;
  data2=data.split(";");
  if(data2.length>0){
    var contador=0;
    while(contador<data2.length){
      d1=data2[contador].split(",");
      var newOp = document.createElement("option");
      newOp.text = d1[0];
      newOp.value = d1[1];
      list.options.add(newOp);
      contador++;}
    }
  });
document.getElementById("Send").addEventListener("click", function () {
  var fecha_inicio=document.getElementById("fecha1").value.replace("T"," ")+":00";
  var fecha_fin=document.getElementById("fecha2").value.replace("T"," ")+":00";
  console.log(fecha_inicio);
  socket.emit('insertar_evento',{
    nombre:document.getElementById("nombre_evento").value,
    fi:fecha_inicio,
    ff:fecha_fin
  });
});
socket.on("resultado", function (respuesta) {
  document.getElementById("Messages").innerHTML ="";
  if(respuesta=="correcto"){
    document.getElementById("Messages").innerHTML = "<div class=\"alert alert-success alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Creado con éxito</div>";
  }
  else if(respuesta=="error1"){
    document.getElementById("Messages").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>El nombre del evento no puede ser un número</div>";
  }
  else if(respuesta=="error01_fecha"){
    document.getElementById("Messages").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>La fecha que se ingreso no existe</div>";
  }
  else if(respuesta=="error02_fecha"){
    document.getElementById("Messages").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>El nombre del evento no puede ser un número</div>";
  }
  else {
    document.getElementById("Messages").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Hubo un error con la base de datos, no se pudo crear el evento</div>";
  }
  socket.emit('solicitar_llenar');
});
document.getElementById("terminar_evento").addEventListener("click", function () {
  var list = document.getElementById('Lista_eventos');
  socket.emit('terminar_evento',{
    id_evento_terminado:list.options[list.selectedIndex].value,
    nombre_usuario:'user1',
    contrasena:document.getElementById("Contrasena").value
  });
});
socket.on("resultado2", function (respuesta) {
  document.getElementById("Messages2").innerHTML ="";
  if(respuesta=="correcto"){
    document.getElementById("Messages2").innerHTML = "<div class=\"alert alert-success alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Se ha terminado el evento exitosamente</div>";
  }
  else if(respuesta=="error_contrasena"){
    document.getElementById("Messages2").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>La contrasena no es correcta</div>";
  }
  else {
    document.getElementById("Messages2").innerHTML = "<div class=\"alert alert-danger alert-dismissable\"><button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">&times;</button>Hubo un error con la base de datos, no se pudo terminar el evento</div>";
  }
  socket.emit('solicitar_llenar');
});