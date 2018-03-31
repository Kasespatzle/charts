var express = require('express');
var router = express.Router();
const chartJsNode = require('chartjs-node');
const crypto = require("crypto");
const path = require('path');
require('dotenv').config({path:path.join(process.cwd(),'.env')});
const fs = require('fs');


/**
 * Generator that returns a random rgba color with desired opacity
 * @param {int} quantity 
 * @param {float} opacity 
 */
function* randomColorGenerator(quantity,opacity){
  for(let i=0;i<quantity;i++){
    let nums = [0,0,0].map((num)=>{
      return Math.floor(Math.random()*1000)%256;
    });
    yield `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${opacity})`;
  }
}

/**
 * Generates a random integer between a range
 * @param {int} max 
 * @param {int} min 
 */
function randomInteger(max,min){
  return Math.floor(Math.random() * (max-min+1)) + min;
}

/* GET home page. */
router.get('/', (req, res, next)=>{
  res.render('index', { title: 'Rindou Chart' });
});

/**
 * Post request, returns a link to created chart
 * @param labels array of strings to name the params
 * @param values array of integers to refer the values of each label
 * @param label name of the label
 */

router.post('/',(req,res,next)=>{
  console.log(process.env)
  let labels = req.body.labels;
  let label = req.body.label;
  let values = req.body.values;
  if(!"labels" in req.body || !"values" in req.body || !"label" in req.body){
    return res.status(500).send("Labels and values are required");
  }
  if(labels.length !== values.length){
    return res.status(500).send("Equal ammount of labels and values required");
  }
  let [...colors] = randomColorGenerator(labels.length,1);
  let [...borders] = randomColorGenerator(labels.length,1);
  let chartOptions = {
    type: 'bar',
    data: {
        labels:labels,
        backgroundColor: "rgb(255,255,255)",
        datasets: [{
            label: label,
            data: values,  
            backgroundColor: colors,
            borderColor: borders,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true,
                    fontSize:20
                }
            }],
            xAxes:[{
              ticks:{
                fontSize:20
              }
            }]
        },
        plugins:{
          beforeDraw: function(chartInstance) {
            var ctx = chartInstance.chart.ctx;
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
          }
        }
    }
  };
  //Generate filename
  let filename;
  do{
    filename = crypto.randomBytes(randomInteger(10,5)).toString("hex") +".png";
  }while(fs.existsSync(`./public/charts/${filename}`));

  let chart = new chartJsNode(1366,768);
  chart.drawChart(chartOptions)
  .then(()=>{
    return chart.writeImageToFile('image/png',`./public/charts/${filename}`);
    
  })
  .then(()=>{
    return res.send(process.env.APP_HOST +"/charts/"+ filename+"\n");
  });
  
  console.log(colors);
  console.log(borders);
});

module.exports = router;
