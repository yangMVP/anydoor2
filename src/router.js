const fs = require('fs');
const promisfiy = require('util').promisify;
const stat = promisfiy(fs.stat);
const reddir = promisfiy(fs.readdir);
const path = require('path');
const conf = require('./config/defaultConfig')
const handlebars = require('handlebars');
const tplPath = path.join(__dirname,'./temp/dir.html')
const source = fs.readFileSync(tplPath);
const template = handlebars.compile(source.toString());
const mine = require('./mime');
const compress = require('./compress');
const range = require('./range');
const isFresh = require('./cache')
module.exports = async function (res,req,filePath) {
    try {
        const stats = await stat(filePath);
        if (stats.isFile()) {
            const ext = mine(filePath);
            res.setHeader('Content-Type',ext);

            if (isFresh(stats,req,res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            let rs;
            const {code,start,end} = range(stats.size,req,res);
            if (code === 200) {
                res.statusCode = 200;
                rs = fs.createReadStream(filePath);
            } else {
                res.statusCode = 206;
                rs = fs.createReadStream(filePath,{start,end});
            }
            if (filePath.match(conf.compress)) {
                rs = compress(rs,res,req)
            }
            rs.pipe(res);
        } else if (stats.isDirectory()) {
            const files = await reddir(filePath);
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
            const dir = path.relative(conf.root,filePath);
            console.info(conf.root,filePath,dir)
            const data = {
                files:files.map(file => {
                    return {
                        file,
                        icon:mine(file)
                    }
                }),
                title:path.basename(filePath),
                dir:dir ? `/${dir}`:''
            }
            res.end(template(data))
        }
    } catch (err){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain');
        res.end(`${filePath} 不存在`);
    }
}