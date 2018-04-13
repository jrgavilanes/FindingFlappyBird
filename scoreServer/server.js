var express = require("express");
var bodyParser = require('body-parser');
var expressSanitizer = require('express-sanitizer');

var crypto = require("crypto"); //Esto igual sobra, ahora está en un modulo nativo.

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./database.db', (err) => {
    if (err) throw err;
});

db.run("CREATE TABLE IF NOT EXISTS scores (user string, score int);");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());


var PORT = process.env.PORT || "7000";
var IP = process.env.IP || "0.0.0.0";

const SALT = "oJETE78@flipasMIL1009";

//Routes

app.get("/score", function (req, res) {

    //res.send("JRG 1000#PER 5");

    let sql = ` SELECT rowid, user, score  
                FROM scores 
                ORDER BY score DESC, rowid ASC
                LIMIT 5;`;

    db.all(sql, [], (err, rows) => {
        
        if (err) {
            throw err;
        }


        console.log(new Date().toLocaleString() + "-> score -> " + req.ip);

        let salida = "";
        rows.forEach((row) => {
            salida += `${row.user} ${row.score}#`;             
        });
        salida = salida.substr(0, salida.length-1);
        res.send(salida);
    });

})

app.get("/score-min", function (req, res) {

    let sql = ` SELECT rowid, user, score  
                FROM scores 
                ORDER BY score DESC, rowid ASC
                LIMIT 5;`;

    db.all(sql, [], (err, rows) => {
        
        if (err) console.log(err);
        
        console.log(new Date().toLocaleString() + "-> score-min -> " + req.ip);
        
        if (rows.length === 0 ) {
            res.send("1");
        } else {
            res.send(`${rows[rows.length-1].score}`);
        }        

    });    

})


app.post("/score", function (req, res) {

    //console.log(req);

    //console.log(req.body);

    let { USER, SCORE, hash } = req.body;

    let palabra = crypto.createHash("md5").update(SALT + USER + SCORE).digest("hex");

    if (palabra === hash) {
        //console.log("SÍ te creo");

        USER = req.sanitize(USER);
        USER = USER.trim().toUpperCase();
        SCORE = req.sanitize(SCORE);

        // let SQL = `INSERT INTO scores(user,score) VALUES('${USER}',${SCORE});`;
        // console.log(SQL);

        db.run(`INSERT INTO scores(user,score) VALUES(?,?);`, [USER, SCORE], (err) => {
            if (err) {
                console.log(err);
                res.status(500);
            }
            console.log(new Date().toLocaleString() + "-> insert ok -> (" + USER + " "+ SCORE + ") -> " + req.ip);
            res.status(200).send("ok");
        });    

    } else {
        //console.log("No te creo", USER, SCORE);
        console.log(new Date().toLocaleString() + "-> insert KO -> (" + USER + " "+ SCORE + ") -> " + req.ip);
        res.status(404).send("ko");
    }

    // descripcion = req.sanitize(descripcion);

    // let nota = {};
    // nota.titulo = titulo;
    // nota.descripcion = descripcion;

    // db.post("notas", nota);

    // res.redirect("/") ;

});


app.get("*", function (req, res) {

    res.send("404. Page not found");

});

//Server starts listening.
app.listen(PORT, IP, function () {

    console.log("Server listening ... Port: " + PORT + ", IP: " + IP);

});
