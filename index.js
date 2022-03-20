//SERVIDOR CON NODEJS PURO
/* const http = require('http');

const server = http.createServer((req, res) => {
    res.status = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World');
});

server.listen(3000, () => {
    console.log('Server on Port: 3000');
}); */

//SERVIDOR UTILIZANDO EL FRAMEWORK EXPRESSJS
const express = require('express'); //LLAMANDO AL MODULO EXPRESS
const morgan = require('morgan'); //LLAMANDO AL MODULO MORGAN
const app = express(); //DEVUELVE UN OBJETO QUE INICIALIZA LAS PROPIEDADES Y METODOS DEL SERVIDOR 

//SETTING. SON AQUELLAS VARIABLES QUE SE ESTABLECEN EN EL SERVIDOR COMO CONFIGURADORES.
//SE ACCEDE A ELLA CON EL METODO app.get('variable') Y DENTRO EL NOMBRE DE LA VARIABLE.
app.set('port',3000); //ESTABLECIENDO EL NUMERO DEL PUERTO
app.set('view engine', 'ejs'); //ESTABLECIENDO COMO MOTOR DE PLANTILLA A EJS

//MIDDLEWARE: ES EN POCAS PALABRAS ES UN MANEJADOR DE PETICION QUE SE EJECUTA ANTES DE LLEGAR A SU RUTA ORIGINAL.
//SE UTILIZA MAYORMENTE PARA PROCESAR DATOS ANTES DE QUE LLEGUE A TODAS LAS RUTAS CREADAS EN EL SERVIDOR
//PARA USER UN MIDDLEWARE SOLO UTILIZAR: app.use(funcion_middleware)

//FUNCION QUE SE EJECUTARA COMO UN MIDDLEWARE EN LA APLICACION
function logger(req, res, next){
    //req.protocol: obtiene el protocolo por la que se hizo la peticion
    //req.get('host'): obtiene el nombre del servidor al cual se envio la peticion
    //req.originalUrl: obtiene la ruta a la cual se hizo la peticion en el servidor
    let path_complete = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`Peticion recibida en: ${path_complete}`);

    //console.log('HA PASADO POR EL MIDDLEWARE LOGGER');
    next();
}

//AREA DE MIDDLEWARES
app.use(express.json()); //MIDDLEWARE QUE FUNCIONA PARA QUE NODE ENTIENDA LOS MENSAJES JSON RECIBIDOS DE UN CLIENTE
//app.use(logger); //MIDDLEWARE QUE SE CREO MANUALMENTE
app.use(morgan('dev')); //MIDDLEWARE DE MORGAN QUE FUNCIONA PARA MOSTRAR LA INFORMACION DE LA PETICION A UNA RUTA

//ENRUTAMIENTO: PETICIONES HTTP ENVIADAS AL SERVIDOR PARA QUE EL ENVIE UNA RESPUESTA RESPECTIVA
//req: o request (peticion), maneja los metodos y propiedades de la peticion hecha al servidor
//res: o response (respuesta), maneja los metodos y propiedades de la respuesta del servidor

//METODO all(): SE UTILIZA PARA CUANDO SE SOLICITA UNA RUTA, LLEGUE PRIMERAMENTE A ELLA Y LUEGO CONTINUE A OTRAS PETICCIONES CON LA MISMA RUTA. MAYORMENTE UTILIZADA PARA VALIDACIONES DE PETICIONES EN UNA MISMA RUTA.
app.all("/users",(req, res, next) => {
    console.log('HA PASADO POR EL METODO all()');
    //res.send('METODO ALL PRINCIPAL ANTES DE CUALQUIER PETICION'); //NO SE UTILIZA SI CONTINUA LA FUNCION next()
    next(); //FUNCION QUE PERMITE CONTINUAR CON LAS DEMAS PETICIONES EN LA MISMA RUTA.
});

//METODOS HTTP MAS USADOS COMUNMENTE.
//GET: se utiliza para pedirle recursos al servidor
//POST: se utiliza para enviar recursos al servidor para ser guardados
//PUT: para enviar un identificador o varios al servidor para modificar recursos
//DELETE: para enviar un identificador al servidor para eliminar recursos

//ENRUTAMIENTO GET A LA RUTA INICIAL DEL PROYECTO, CON RENDERIZADO DE DATOS A LA VISTA DE INDEX.EJS
app.get('/', (req, res) => {
    const data = [{name: 'Wilson'},{name: 'Ana'},{name: 'Rosa'},{name: 'Daniel'},{name: 'WeeNoO'},{name: 'Minino'}];
    res.render('index.ejs', {people: data}); //METODO QUE TRABAJA CON EL MOTOR DE PLANTILLAS EJS
});

//ENRUTAMIENTO GET A LA RUTA DE ABOUT
app.get('/about',(req, res)=>{
    res.send('AREA DE ACERCA DE! QUE DESEA SABER?');
});

//ENRUTAMIENTO POST A LA RUTA DE REGISTRO DE USUARIO
app.post('/form-user',(req, res)=>{
    res.send('REGISTRANDO AL USUARIO');
});

//ENRUTAMIENTO PUT A LA RUTA DE MODIFICACION DE USUARIO
app.put('/edit-information',(req, res)=>{
    res.send('MODIFICANDO AL USUARIO');
});

//ENRUTAMIENTO DELETE A LA RUTA DE ELIMINADO DE USUARIO
app.delete('/delete-user',(req, res)=>{
    res.send('ELIMINANDO AL USUARIO');
});

//TRABAJANDO CON UNA RUTA Y VARIOS METODOS HTTP

//PETICION GET PARA TOMAR LOS DATOS DE UN USUARIO
app.get('/users',(req, res)=>{
    //ENVIANDO AL CLIENTE UN OBJETO JSON
    res.json({
        username: 'Wilfredo',
        email: 'wilfredo@email.com'
    });
});

//PETICION POST PARA REGISTRAR A UN USUARIO
app.post('/users',(req, res)=>{
    console.log(req.body); //RECIBIENDO UN OBJETO JSON
    res.send('REGISTRANDO AL USUARIO');
});

//PETICION DELETE PARA ELIMINAR A UN USUARIO ATRAVES DE UN PARAMETRO EN LA RUTA
app.delete('/users/:userId',(req, res)=>{
    //ENVIANDO MENSAJE DE USUARIO ELIMINADO CON EL ID PASADO POR PARAMETRO EN LA URL
    res.send(`EL USUARIO ${req.params.userId} HA SIDO ELIMINADO`);
});

//PETICION PUT PARA MODIFICAR A UN USUARIO ATRAVES DE UN PARAMETRO EN LA RUTA
app.put('/users/:userId',(req, res)=>{
    //DATOS QUE HAN SIDO MODIFICADOS POR EL CLIENTE
    console.log(req.body);
    //ENVIANDO MENSAJE DE USUARIO MODIFICADO CON EL ID PASADO POR PARAMETRO EN LA URL
    res.send(`EL USUARIO ${req.params.userId} MODIFICADO!`);
});

//AREA DE MIDDLEWARE PARA ARCHIVOS ESTATICOS (HTML, CSS, JAVASCRIPT, etc...)
//SE EJECUTA CUANDO NO EXISTE LA RUTA PRINCIPAL "/" CON ALGUNA PETICION GET AL SERVIDOR
//COMIENZA A EJECUTAR EL index.html CREADO COMO ARCHIVO PRINCIPAL DE LA CARPETA public
//SE PUEDE ACCEDER DESDE LA URL A LOS ARCHIVOS ESTATICOS DE LA CARPETA public COMO SI
//ESTUVIERAN EN LA DIRECCION PRINCIPAL DEL PROYECTO
app.use(express.static('public'));

//METODO PARA QUE EL SERVIDOR ESCUCHE EN UN PUERTO 3000 Y MANDE UN MENSAJE POR CONSOLA CUANDO ESTE ESCUCHANDO
app.listen(app.get('port'), () => {
    console.log('SERVER ON PORT: ', app.get('port'));
});