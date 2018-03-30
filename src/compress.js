const {createGzip,createDeflate} = require('zlib')
module.exports = (readstream,res,req) => {
    const acceptEncoding = req.headers['accept-encoding'];
    if (!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)){
        return readstream;
    } else if (acceptEncoding.match(/\bgzip\b/)) {
        res.setHeader('Content-Encoding','gzip');
        return readstream.pipe(createGzip());
    } else if (acceptEncoding.match(/\deflate\b/)) {
        res.setHeader('Content-Encoding','deflate');
        return readstream.pipe(createDeflate());
    }
}