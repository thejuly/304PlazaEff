var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');



const EventEmitter = require('events');
const eventEmitter = new EventEmitter();



/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('work at /Home'); //myScript
  

  fetch('https://script.google.com/macros/s/AKfycbyvJ761JsnxvHoyEmRK409y13uGfG1XVfhcxlWqZE8bzznlqQlRKWN0qDCJEMf7iFAiSQ/exec?method=hist').then((res)=>{
    return res.json();
  }).then((json)=>{
      // console.log(json);
      // console.log(json[0].euVal);
      // console.log(json[1].euVal)
      const msg = JSON.stringify(json);
      // console.log(msg)
      // res.write(msg);
      // res.write("data: "+ msg + "\n\n");
      // res.render('index', { hist: json }); //ok
      res.render('index', { hist: json }); //ok
      
      
  });
  
  // res.render('index', { title: msg });
});





//-------------------------------------------------------------------------------
//                       Get data from google sheet
//-------------------------------------------------------------------------------
router.get('/stream', function(req, res) {
  console.log('work at /stream'); //myScript
  // send headers for event-stream connection
  // see spec for more information
  
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });


  fetch('https://script.google.com/macros/s/AKfycbyvJ761JsnxvHoyEmRK409y13uGfG1XVfhcxlWqZE8bzznlqQlRKWN0qDCJEMf7iFAiSQ/exec?method=curr').then((res)=>{
    return res.json();
  }).then((json)=>{
      // console.log(json);
      // console.log(json[0].euVal);
      // console.log(json[1].euVal)
      const msg = JSON.stringify(json);
      // console.log(msg)
      // res.write(msg);
      res.write("data: "+ msg + "\n\n");
      
  });


  res.write('\n');


  eventEmitter.on('start', () => {
    // console.log('Handing start event');

    fetch('https://script.google.com/macros/s/AKfycbyvJ761JsnxvHoyEmRK409y13uGfG1XVfhcxlWqZE8bzznlqQlRKWN0qDCJEMf7iFAiSQ/exec?method=curr').then((res)=>{
      return res.json();
    }).then((json)=>{
        // console.log(json);
        // console.log(json[0].euVal);
        // console.log(json[1].euVal)
        const msg = JSON.stringify(json);
        // console.log(msg)
        // res.write(msg);
        res.write("data: "+ msg + "\n\n");
        
    });
  });




  // Timeout timer, send a comment line every 20 sec
  var timer = setInterval(function() {
    eventEmitter.emit('start');
  }, 5000);


});
//-------------------------------------------------------------------------------


module.exports = router;
