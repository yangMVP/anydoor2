module.exports = {
    root:process.cwd(),
    hostname:'127.0.0.1',
    port:'4000',
    compress:/\.(html|js|css|md)/,
    cache:{
        maxAge:600,
        expires:true,
        cacheContral:true,
        etag:true,
        lastModified:true
    }
}