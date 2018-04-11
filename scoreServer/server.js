var express = require("express");
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');

var crypto = require("crypto");


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());


var PORT = process.env.PORT || "3000";
var IP = process.env.IP || "127.0.0.1";

const SALT = "oJETE78@flipasMIL1009";

//Routes

app.get("/score", function(req, res){

    // res.send("JRG ..... 10#PER ..... 20#JUL ..... 5#RAB ..... 11");
    res.send("JRG 1000#PER 5");

})

app.get("/score-min", function(req, res){

    console.log("devuelvo");
    res.send("5");

})


app.post("/score", function(req, res){

//console.log(req)  ;
    
    console.log(req.body);

    let {datos, hash} = req.body;

    let palabra = crypto.createHash("md5").update(SALT+datos).digest("hex");
    
    if (palabra === hash){
        console.log("SÍ te creo");
    } else {
        console.log("NO te creo");
    }
    

    
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