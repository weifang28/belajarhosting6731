var express = require("express");
const router= express.Router();
const mysql = require("mysql");

const axios=require("axios");

module.exports=router;
const connection=mysql.createConnection({host:"localhost", database:"T4_6731", user:"root", password:""});
connection.connect();

router.get("/", async function(req, res){
    res.render("login",{error_msg:""});
    no_telp=""; nama="";
});

router.get("/register", async function(req, res){
    res.render("register",{error_msg:"", success_msg:""});
});

router.get("/login", async function(req, res){
    res.render("login",{error_msg:""});
    no_telp=""; nama="";
});

// router.get("/favorites", async function(req, res){
//     res.redirect("/favorites");
// });

// var error_msg="", success_msg="";
router.post("/user-register", async function(req, res){
    var newno_telp=req.body.no_telp;
    var newnama=req.body.nama;
    var newpassword=req.body.password;
    var newcpassword=req.body.cpassword;
    if(!isNaN(newno_telp)){
        connection.query(`SELECT * FROM users WHERE NO_TELP='${newno_telp}'`,(err,result,field) => {
            if(err) throw err;
            if(result.length>0){
                //ada
                res.render("register", {error_msg: "Nomor Telepon Sudah Terdaftar", success_msg: ""});
            }else{
                if(newpassword==newcpassword){
                    connection.query(`INSERT INTO USERS VALUES(?,?,?)`,[newno_telp, newnama, newpassword],(err,result,field) => {
                        if(err) throw err;
                        res.render("register",{success_msg: "Registered!", error_msg: ""});
                    });
                }else{
                    res.render("register", {error_msg: "Password dan Confirm Password Tidak Sama", success_msg: ""});
                }
            }
        });
    }else{
        res.render("register", {error_msg: "No Telp harus numeric", success_msg: ""});
    }
});

let config={headers:{"X-Auth-Token": "7afe1964d88c492499945c039c3f51d3"}};

var hasil;
var no_telp="", nama="";
router.get("/home", async function(req, res){
    if(no_telp=="") res.redirect("/");
    var link="https://api.football-data.org/v2/teams/";
    hasil= await axios.get(link, config);
    connection.query(`SELECT * FROM favs WHERE NO_TELP='${no_telp}'`,(err,result,field) => {
        if(err) throw err;
        res.render("home",{
            data: hasil.data,
            no_telp: no_telp,
            nama: nama,
            favs: result
        });
    });

});
router.post("/user-login", async function(req, res){
    var newno_telp=req.body.no_telp;
    var newpassword=req.body.password;
    var link="https://api.football-data.org/v2/teams/";
    hasil= await axios.get(link, config);
    connection.query(`SELECT * FROM users WHERE NO_TELP='${newno_telp}'`,(err,result,field) => {
        if(err) throw err;
        if(result.length>0){
            connection.query(`SELECT * FROM users WHERE NO_TELP='${newno_telp}' AND PASSWORD='${newpassword}'`,(err,result,field) => {
                if(err) throw err;
                if(result.length>0){
                    no_telp=newno_telp;
                    nama=result[0].nama;
                    res.redirect("/home");
                }else{
                    res.render("login",{error_msg: "Password Salah!"});
                }
            });
        }else{
            res.render("login",{error_msg: "No Telp tidak terdaftar!"});
        }
    });
});

router.post("/detail", async function(req, res){
    if(no_telp=="") res.redirect("/");

    var newid=req.body.id;
    var link="https://api.football-data.org/v2/teams/"+newid;
    hasil= await axios.get(link, config);
    connection.query(`SELECT * FROM favs WHERE NO_TELP='${no_telp}' AND ID='${newid}'`,(err,result,field) => {
        if(err) throw err;
        if(result.length>0){
            res.render("detail",{data:hasil.data, mode: 1});
        }else{
            res.render("detail",{data:hasil.data, mode: 0});
        }
    });
});

router.post("/addFavorites", async function(req, res){
    var newid=req.body.id;
    var newno_telp=req.body.no_telp;
    var link="https://api.football-data.org/v2/teams/";
    hasil= await axios.get(link, config);
    // console.log(hasil.data);
    connection.query(`SELECT * FROM favs WHERE NO_TELP='${newno_telp}' AND ID='${newid}'`,(err,result,field) => {
        if(err) throw err;
        if(result.length<=0){
            connection.query(`INSERT INTO favs VALUES('${newno_telp}','${newid}')`,(err,result,field) => {
                if(err) throw err;
                console.log("Masuk lur");
                res.redirect("/home");
            });
        }
        else res.redirect("/home");
    });
});

router.post("/delFavorites", async function(req, res){
    var newid=req.body.id;

    connection.query(`DELETE FROM favs WHERE ID='${newid}'`,(err,result,field) => {
        if(err) throw err;
        res.redirect("/home");
    });
});

router.get("/favorites", async function(req, res){
    if(no_telp=="") res.redirect("/");
    var link="https://api.football-data.org/v2/teams/";
    hasil= await axios.get(link, config);
    console.log(no_telp);
    connection.query(`SELECT * FROM favs WHERE NO_TELP='${no_telp}'`,(err,result,field) => {
        if(err) throw err;
        if(result.length>=0){
            // console.log(hasil.data);
            console.log(hasil.data.teams[0].id)
            console.log(result);
            res.render("favorites",{
                data: hasil.data,
                favs: result
            });
        }else{
            res.redirect("/home");
        }
    });
});