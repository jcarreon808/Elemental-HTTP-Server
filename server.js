'use strict';

const http = require ('http');
const fs = require ('fs');
const qs = require ('querystring');
const PORT = 3000;

http.createServer((request, response) => {

  if(request.method === 'GET'){

    let pathName = request.url;
    let contentType;

    if(request.url.indexOf('.html') > -1){
      pathName ='./public' + request.url;
      contentType = 'text/html';
    }

    if(pathName === '/'){
      pathName = './public/index.html';
      contentType = 'text/html';

    } else {

      if(request.url.indexOf('.css') > -1){
        pathName = './public'+ request.url;
        contentType = 'text/css';
      }
    }

    fs.readFile(pathName, (err, data)=> {

      if(err){


        let statusCode = 404;
        contentType = 'text/html';

        fs.readFile('./public/404.html', (err, data) => {

          response.writeHead(statusCode, {
            'Content-Type': contentType,
            'Content-Length': data.toString().length,
          });

          response.write(data.toString());
          response.end();

        });

      } else {

        let statusCode = 200;

        response.writeHead(statusCode, {
          'Content-Type': contentType,
          'Content-Length': data.toString().length,
        });

        response.write(data.toString());
        response.end();
      }
    });
  }

  if(request.method === 'POST'){

    request.on('data',(data)=>{

      const parsedData = qs.parse(data.toString());
      console.log(parsedData);

      let html=
      `<h1>${parsedData.elementName}</h1>
      <h2>${parsedData.elementSymbol}</h2>
      <h3>${parsedData.elementAtomicNumber}</h3>
      <h4>${parsedData.elementDescription}</h4>`;

      response.end(html);
    });

  }

  if(request.method === 'PUT'){

  }

  if(request.method === 'DELETE'){

  }

}).listen(PORT);




// http.createServer(function(request, response) {
//   var headers = request.headers;
//   var method = request.method;
//   var url = request.url;
//   var body = [];
//   request.on('error', function(err) {
//     console.error(err);
//   }).on('data', function(chunk) {
//     body.push(chunk);
//   }).on('end', function() {
//     body = Buffer.concat(body).toString();
//     // At this point, we have the headers, method, url and body, and can now
//     // do whatever we need to in order to respond to this request.
//   });
// }).listen(8080); // Activates this server, listening on port 8080.