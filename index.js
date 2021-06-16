const express = require("express");
const app = express();

app.use(express.urlencoded({extended:true}));

mahasiswa = [{
    nrp: "123",
    nama:"budi"
},{
    nrp: "456",
    nama: "adi"
}
];

app.get("/", function(req,res){
    return res.status(200).send("Hello World");
});


app.get("/mahasiswa", function(req,res){
    return res.status(200).send(mahasiswa);
});

app.get("/mahasiswa/:id", function(req,res){
    var id=req.params.id;
    return res.status(200).send(mahasiswa[id]);
});

app.post("/mahasiswa/", function(req,res){
    return res.status(200).send({
        nrp: "123",
        nama: "Budi"
    });
});
const port= process.env.PORT || 3000
app.listen(port, function(req,res){
    console.log(`listening on port ${port}`);
});