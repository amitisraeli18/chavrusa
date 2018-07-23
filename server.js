  var fs = require('fs');
  var server=require("http").createServer(start);
  var io = require("socket.io")(server);
  var words = [];
  var curID, curWord;
  var port = process.env.OPENSHIFT_NODEJS_PORT || 8080, 
        id = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

  function saveWords() {
    fs.writeFile("./data/words.txt", JSON.stringify(words), function(err) {
        if(err) {
            return console.log(err);
        } 

        console.log("saved it!");
        io.emit("word added", {idx:curID,word:curWord});
    })
  }

  function start(r,res) {

    console.log("Hello World!"); 
    res.writeHead(200, {'Content-Type':'text/html'});
    fs.readFile("chavruta.html", function(error, data) {
        console.log("READ");
        if(error) {
            console.log(error);
        } else {
            res.write(data);
        }
        res.end();
    });

    
    io.on("connection", function(socket) {
        fs.readFile("maamers/maamer1.txt", "utf8", (error, data) => {
            if(error) {
                console.log(error);
            } else {
                io.emit("maamer loaded", data);
            }
        });
        console.log("yay a connection!");
        socket.on("new word", function(obj) {
            if(obj && obj.word) {
                words.push(obj.word);
                curID = words.length-1;
                curWord = obj.word;
                console.log("YAY", obj.id);
                saveWords();
            }
        });

        socket.on("word clicked", function(idx) {
            console.log(idx);
            io.emit("selected", idx);
        });
        socket.on("disconnect", function(msg) {
            console.log("Disconnected");
        })
      });
 }
 
 server.listen(port, id);
