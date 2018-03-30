// supervisor 启动 热更新
const http = require('http');
const chalk = require('chalk');
const path = require('path');
const router = require('./router');
const fs = require('fs');
const conf = require('./config/defaultConfig');
const openUrl = require('./openUrl');

class Server {
    constructor (config) {
        this.conf = Object.assign({},conf,config);
    }

    start() {
        // const promisfiy = require('util').promisify;
        // const stat = promisfiy(fs.stat);
        // const reddir = promisfiy(fs.readdir);
        const server = http.createServer((req,res) => {
            const filePath = path.join(conf.root,req.url);
            router(res,req,filePath);
            // try {
                
            //     const stats = await stat(filePath);
            //     if (stats.isFile()) {
            //         res.statusCode = 200;
            //         res.setHeader('Content-Type','text/plain');
            //         fs.createReadStream(filePath).pipe(res)
            //     } else if (stats.isDirectory()) {
            //         const dir = await reddir(filePath);
            //         fs.readdir(filePath,(err,files) => {
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type','text/plain');
            //             res.end(files.join(','))
            //         })
                    
            //     }
            // } catch (err){
            //     res.statusCode = 404;
            //     res.setHeader('Content-Type','text/plain');
            //     res.end(`${filePath} 不存在`);
            // }
            
            // fs.stat(filePath,(err,stats) => {
            //     if (err) {
            //         res.statusCode = 404;
            //         res.setHeader('Content-Type','text/plain');
            //         res.end(`${filePath} 不存在`);
            //         return;
            //     }
            //     if (stats.isFile()) {
            //         res.statusCode = 200;
            //         res.setHeader('Content-Type','text/plain');
            //         fs.createReadStream(filePath).pipe(res)
            //     } else if (stats.isDirectory()) {
            //         fs.readdir(filePath,(err,files) => {
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type','text/plain');
            //             res.end(files.join(','))
            //         })
                    
            //     }
            // })
        })
        server.listen(this.conf.port,this.conf.hostname,() => {
            const addr = `http://${this.conf.hostname}:${this.conf.port}`;
            console.info(`server start at ${chalk.green(addr)}`);
            openUrl(addr);
        })
    }
}

module.exports = Server;
