//token: 7afe1964d88c492499945c039c3f51d3
var express = require("express");
var app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

//utk heroku
const port=process.new.PORT;

app.listen(port, function(){
    console.log(`${port} hehehe`);
});

//app.listen(3000, function(){
//    console.log(`3000 hehehe`);
//});

const users = require("./routes/users");
app.use("/",users);