  var fs = require('fs');
  var server=require("http").createServer(start);
  var io = require("socket.io")(server);
  var shtikles = [];


  function start(r,res) {
    console.log("Hello World!"); 
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.readFile("chavruta.html", function(error, data) {
        if(error) {
            console.log(error);
        } else {
            res.write(data);
        }
        res.end();
    });

    fs.readFile("maamers/maamer1.txt", "utf8", (error, data) => {
        if(error) {
            console.log(error);
        } else {
            io.emit("maamer loaded", data);
        }
    });
    io.on("connection", function(socket) {
        console.log("yay a connection!");
       /* io.on("word list", function(data) {
            shtikles = data;
        });*/
        socket.on("word clicked", function(idx) {
            console.log(idx);
            io.emit("selected", idx);
        });
        socket.on("disconnect", function(msg) {
            console.log("Disconnected");
        })
      });
 }
 
 server.listen(process.env.PORT || 8080);
