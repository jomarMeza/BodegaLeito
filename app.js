'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server,{
    cors: {origin : '*'}
});

app.get('/', function(req, res){
    res.send('hola mundo')
})    

io.on('connection',function(socket){
    socket.on('delete-carrito',function(data){
        io.emit('new-carrito',data);
        console.log(data);
    });


    socket.on('add-carrito-add',function(data){
        io.emit('new-carrito-add',data);
        console.log(data);
    });
    
});


var cliente_routes = require('./routes/cliente');
var admin_routes = require('./routes/admin');
var cupon_routes = require('./routes/cupon');

mongoose.connect('mongodb://mezaquintoabdiel:abdielAMQ1010@ac-31q7ave-shard-00-00.fxc8qo8.mongodb.net:27017,ac-31q7ave-shard-00-01.fxc8qo8.mongodb.net:27017,ac-31q7ave-shard-00-02.fxc8qo8.mongodb.net:27017/tienda?replicaSet=atlas-2jd6d6-shard-0&ssl=true&authSource=admin',{useUnifiedTopology: true, useNewUrlParser: true}, (err,res)=>{
    if(err){  
        throw err;
        console.log(err);
    }else{
        console.log("Corriendo....");
        server.listen(port, function(){
            console.log("Servidor " + port );
        });
    }
});

app.use(bodyparser.urlencoded({limit: '50mb',extended:true}));
app.use(bodyparser.json({limit: '50mb', extended: true}));


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_routes);
app.use('/api',admin_routes);
app.use('/api',cupon_routes);

module.exports = app;