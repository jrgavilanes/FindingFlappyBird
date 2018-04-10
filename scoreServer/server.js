var express = require("express");
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());


var PORT = process.env.PORT || "3000";
var IP = process.env.IP || "127.0.0.1";

//Routes

app.get("/score", function(req, res){

    res.send("juanra 1000, nano 333");

})


app.post("/score", function(req, res){

   console.log(req.body);

    // let {titulo, descripcion} = req.body;
    // descripcion = req.sanitize(descripcion);

    // let nota = {};
    // nota.titulo = titulo;
    // nota.descripcion = descripcion;

    // db.post("notas", nota);

    // res.redirect("/") ;

});


app.get("*", function(req, res){

    res.send("404. Page not found");

});

//Server starts listening.
app.listen(PORT, IP, function(){

    console.log("Server listening ... Port: " + PORT + ", IP: " + IP);

});