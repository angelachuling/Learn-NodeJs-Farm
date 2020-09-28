//import built-in modules
const http = require("http");
const url = require("url");
const fs = require("fs");

//import 3rd party modules
const slugify = require("slugify"); //help to make nice url

//import my own modules
const replaceTemplate = require("./modules/replaceTemplate");

//load data
const tempOverview = fs.readFileSync(`${__dirname}/templates/template_overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template_card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template_product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = JSON.parse(data);

//make slugs for url
const slugs = productData.map(element=>slugify(element.productName, {lower: true}));
console.log(slugs);

//create server by using http library
const server = http.createServer((request, response)=>{

// console.log(url.parse(request.url, true));
console.log(request.url);

const {query, pathname} = url.parse(request.url, true);

    //overview page
    if(pathname ==='/' ||pathname ==='/overview'){
        response.writeHead(200, {'Content-type': 'text/html'});
        const cardsHtml = productData.map(element=>replaceTemplate(tempCard, element)).join('');
        // console.log(cardsHtml);
        const output = tempOverview.replace('{%PRODUCT_CARDS}', cardsHtml)
        response.end(output);
    } 
    
    //product page
    else if(pathname ==='/product'){
        // console.log(query);
        const product = productData[query.id]
        const output = replaceTemplate(tempProduct,product);
        response.writeHead(200, {'Content-type': 'text/html'});
        response.end(output);
    } 

    //api page    
    else if(pathname ==='/api'){
        response.writeHead(200, {'Content-type': 'application/json'});
        response.end(data);
    } 
    
    //not found page    
    else{
        response.writeHead(404, {'Content-type': 'text/html', 'my-own-header': 'Hello-world'});
        response.end('<h1>Page not found</h1>');
    }

}).listen(8000, ()=>{
    console.log('Listening to requests from port 8000');
});

//make the server listen on port 8000