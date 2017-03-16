var express = require('express');
var app =  express();

app.use(express.static('public'));

/*
app.get('/', function(req, res){
	res.send("Pagina principal");
});
*/
app.listen(8080, function(){
	console.log("La pagina esta corriendo en el puerto 8080!!!");
});