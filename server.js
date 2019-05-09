const path=require('path');

// Local Server Path
const CONFIG = require('./package.json');
const LOCAL_PATH=path.resolve(__dirname,'./Static');

// Dependences
const Koa = require('koa');
const serve= require('koa-static');

const koaBody = require('koa-body');
const main=serve(LOCAL_PATH);



//app
const app=new Koa();

//parser
app.use(koaBody());

//setting routers
app.use(main);

app.use(require('./excel').routes());

app.listen(CONFIG.PORT,function(){
    console.log(`启动成功！http://localhost:${CONFIG.PORT}`)
});