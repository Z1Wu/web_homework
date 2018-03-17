let http = require('http');
let fs = require('fs');
let url = require('url');
let qs = require('querystring');
let cacheIndexHtml = '';
let cacheIndexCss = '';
let cacheIndexJs = '';
let tmpStorage = [];

let log = console.log;

let server = http.createServer().listen(8080);


(function init() {
    fs.readFile('demo_db.json', function(err, data){
        if(err) {
            log('file does not exists!');
        } else {
            tmpStorage = JSON.parse(data);
        }
    })
})();

server.on('request', (req, res) => {
    let thisUrl = url.parse(req.url);
    let pathName = thisUrl.pathname;
    let query = thisUrl.query;
    let tarUser = qs.parse(query);

    if (req.method === 'POST') {
        let body = '';
        req.on('data', function (data) {
            body += data;
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', function () {
            let post = qs.parse(body);
            log('post', post);
            tmpStorage.push(post);
            res.end(cacheIndexHtml);
        });
    } else if(req.method === 'GET') {
        if(queryCheck(tarUser)) {
            let username = tarUser.username;
            log('query', username);
            res.end(renderHtml(username));
        } else if (pathName === '/') {
            if(cacheIndexHtml) {
                res.end(cacheIndexHtml);
            } else {
                log('get html');
                fs.readFile('demo.html', function(err, data) {
                    cacheIndexHtml = data;
                    res.end(data);
                });
            }
        } else if (pathName === '/demo.css') {
            if(cacheIndexCss) {
                res.end(cacheIndexCss);
            } else {
                fs.readFile('demo.css', function(err, data) {
                    log('get css');
                    cacheIndexCss = data;
                    res.end(data);
                });
            }
        } else if (pathName === '/demo.js') {
            if(cacheIndexJs) {
                res.end(cacheIndexJs);
            } else {
                fs.readFile('demo.js', function(err, data) {
                    if(err) {
                        log(err);
                    }
                    cacheIndexJs = data;
                    log('get js file');
                    res.end(data);
                });
            }
        }
    }
});

function registerHandler(NewUser) {
    if(tmpStorage.indexOf(NewUser) === -1) {
        tmpStorage.push(NewUser);
    }
}

function queryCheck(tarUser) {
    let username = tarUser.username;
    for(let i = 0; i < tmpStorage.length; i++) {
        if(tmpStorage[i].username === username) {
            return true;
        }
    }
    return false;
}

function renderHtml(username) {
    let target = tmpStorage.find(function(item) {
        return item.username === username;
    });
    return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>User</title>
            <link href="demo.css" rel="stylesheet">
        </head>
        <body>
            <div class = "show-user">
                <h2> User Profile</h2>
                <p > ${target.username}</p>
                <p > ${target.phone} </p>
                <p > ${target.email} </p>
                <p > ${target.studentNumber}</p>
                <button type="button" onclick = 'window.history.back();'>
                    Back
                </button>
            </div>
        </body>
    </html>
    `
}


process.on('SIGINT', (code) => {

    fs.writeFileSync('demo_db.json', JSON.stringify(tmpStorage));
});

console.log('server running!');

