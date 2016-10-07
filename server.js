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

    let bufferToString;
    request.on('data',(data) =>{

      bufferToString = data.toString();

    });

    request.on('end',()=>{

      const parsedData = qs.parse(bufferToString);

      const fileName = './public/'+parsedData.elementName.toLowerCase() + '.html';


      let html=
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements - ${parsedData.elementName}</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>${parsedData.elementName}</h1>
  <h2>${parsedData.elementSymbol}</h2>
  <h3>Atomic number ${parsedData.elementAtomicNumber}</h3>
  <p>${parsedData.elementDescription}.</p>
  <p><a href="/">back</a></p>
</body>
</html>
`;
      fs.writeFile(fileName, html, (err)=>{
        if (err){
          response.end(err.message);

        }else{
          let statusCode = 200;

          response.writeHead(statusCode, {
            'Content-Type': 'application/json',
          });
          response.end(JSON.stringify({'success':true}));

        }

      });

    });

    let updatedIndexHTML =
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>The Elements</title>
  <link rel="stylesheet" href="/css/styles.css">
</head>
<body>
  <h1>The Elements</h1>
  <h2>These are all the known elements.</h2>
  <h3>These are 2</h3>
  <ol>
    <li>
      <a href="/hydrogen.html">Hydrogen</a>
    </li>
    <li>
      <a href="/helium.html">Helium</a>
    </li>
     <li>
      <a href="/boron.html">Boron</a>
    </li>
  </ol>
</body>
</html>`;

    fs.writeFile('./public/index.html',updatedIndexHTML, (err)=>{
      if (err){
        response.end(err.message);
      }

    });




  }

  if(request.method === 'PUT'){

  }

  if(request.method === 'DELETE'){

  }

}).listen(PORT);




