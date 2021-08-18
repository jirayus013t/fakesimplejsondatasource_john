var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var app = express();
var port = process.env.PORT || 3333;

const https = require('https');
const http = require('http');
app.use(bodyParser.json());

var getQueryData
var getQueryData_Daily
var getQueryData_Monthly
var timeserie
var timeserie_ricetype 
var timeserie_standardtype
var timeserie_standardtype_homrice
var timeserie_standardtype_hommalirice
var countryTimeseries = require('./country-series');



//For interacting with filterjsondatadynamodb server
var url_table_riceinspectprocessing = "http://localhost:3339/get_table_riceinspectprocessing"
var url_data_riceinspectprocessing = "http://localhost:3339/grafana/allriceinspectprocessing_usernametimestamp"
var url_data_ricetypename = "http://localhost:3339/grafana/listricetypename"
var url_data_standardname = "http://localhost:3339/grafana/liststandard"
var url_data_standardname_homrice = "http://localhost:3339/grafana/liststandard_homrice"
var url_data_standardname_hommalirice = "http://localhost:3339/grafana/liststandard_hommalirice"
var url_get_query = "http://localhost:3339/grafana/get_query"
var url_get_query_daily = "http://localhost:3339/grafana/get_query_daily"
var url_get_query_monthly = "http://localhost:3339/grafana/get_query_monthly"


//For testing with production
//var url_table_riceinspectprocessing = "http://ec2-13-213-62-58.ap-southeast-1.compute.amazonaws.com:3339/get_table_riceinspectprocessing"
//var url_data_riceinspectprocessing = "http://ec2-13-213-62-58.ap-southeast-1.compute.amazonaws.com:3339/grafana/allriceinspectprocessing_usernametimestamp"

/*  To init data on production
function initData() {
  https.get("https://r1aeobbn45.execute-api.ap-southeast-1.amazonaws.com/production/api/table")
  https.get("https://r1aeobbn45.execute-api.ap-southeast-1.amazonaws.com/production/api/data")
}

initData()
setInterval(function(){ initData() }, 3000);
*/

function getData(){
  http.get("http://localhost:3333/api/table")
  http.get("http://localhost:3333/api/data")
  http.get("http://localhost:3333/api/data/ricetype")
  http.get("http://localhost:3333/api/data/standardtype")
  http.get("http://localhost:3333/api/data/standardtype_homrice")
  http.get("http://localhost:3333/api/data/standardtype_hommalirice")
  http.get("http://localhost:3333/api/get_query")
  http.get("http://localhost:3333/api/get_query_daily")
  http.get("http://localhost:3333/api/get_query_monthly")
}


var annotation = {
  name : "annotation name",
  enabled: true,
  datasource: "generic datasource",
  showLine: true,
}

var annotations = [
  { annotation: annotation, "title": "Donlad trump is kinda funny", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "Wow he really won", "time": 1450754160000, text: "teeext", tags: "taaags" },
  { annotation: annotation, "title": "When is the next ", "time": 1450754160000, text: "teeext", tags: "taaags" }
];

var tagKeys = [
  {"type":"string","text":"Country"}
];

var countryTagValues = [
  {'text': 'SE'},
  {'text': 'DE'},
  {'text': 'US'}
];

var now = Date.now();
var decreaser = 0;
for (var i = 0;i < annotations.length; i++) {
  var anon = annotations[i];

  anon.time = (now - decreaser);
  decreaser += 1000000
}

var table =
  {
    columns: [{text: 'Time', type: 'time'}, {text: 'Country', type: 'string'}, {text: 'Number', type: 'number'}],
    rows: [
      [ 1234567, 'SE', 123 ],
      [ 1234567, 'DE', 231 ],
      [ 1234567, 'US', 321 ],
    ]
  };

 // console.log(table.rows[0])



  
function setCORSHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "accept, content-type");  
}


var now = Date.now();
var decreaser = 0;
for (var i = 0;i < table.rows.length; i++) {
  var anon = table.rows[i];

  anon[0] = (now - decreaser);
  decreaser += 1000000
}

app.all('/', function(req, res) {
  setCORSHeaders(res);
  res.send('I have a quest for you!');
  res.end();
});

var riceTypeSearch = []
var whiteStandardSearch = []
var homRiceStandardSearch = []
var hommaliRiceStandardSearch = []
var standardType = ["whiteRice","homRice","homMaliRice"]

app.all('/search', function(req, res){
  setCORSHeaders(res);
  riceTypeSearch = []
  whiteStandardSearch = []
  homRiceStandardSearch = []
  hommaliRiceStandardSearch = []
  var searchList = ['inferenceAll','query_Weekly', 'query_Daily', 'query_Monthly']

  _.each(timeserie, function(ts) {
    riceTypeSearch.push(ts.target+"_ricetype");
    
  });
  _.each(timeserie, function(ts) {
    searchList.push(ts.target+"_ricetype");
  });

  _.each(standardType, function(ts) {
    _.each(timeserie, function(s) {
      searchList.push(s.target+"&standard="+ts);
      if(ts=="whiteRice"){
        whiteStandardSearch.push(s.target+"&standard="+ts);
      }
      if(ts=="homRice"){
        homRiceStandardSearch.push(s.target+"&standard="+ts);
      }
      if(ts=="homMaliRice"){
        hommaliRiceStandardSearch.push(s.target+"&standard="+ts);
      }
      
      
    });
    
  });
  
  console.log(riceTypeSearch)
  console.log(whiteStandardSearch)
  console.log(homRiceStandardSearch)
  console.log(hommaliRiceStandardSearch)
  res.json(searchList);
  res.end();
});

app.all('/annotations', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(annotations);
  res.end();
});

function retreiveJSONTABLE(jsondata){
  table = jsondata;
}

function retreiveJSONURL(jsondata){
  timeserie = jsondata;
  
}

function retreiveJSONURL_ricetype(jsondata){
  timeserie_ricetype = jsondata;
}

function retreiveJSONURL_standardtype(jsondata){
  timeserie_standardtype = jsondata;
}

function retreiveJSONURL_standardtype_homrice(jsondata){
  timeserie_standardtype_homrice = jsondata;
}

function retreiveJSONURL_standardtype_hommalirice(jsondata){
  timeserie_standardtype_hommalirice = jsondata;
}


function retreiveJSONURL_getQuery(jsondata){
  getQueryData = jsondata;
}

function retreiveJSONURL_getQuery_Daily(jsondata){
  getQueryData_Daily = jsondata;
}

function retreiveJSONURL_getQuery_Monthly(jsondata){
  getQueryData_Monthly = jsondata;
}
// get riceInspectProcessing table
app.get('/api/table', function(req, res){

  let url = url_table_riceinspectprocessing;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONTABLE(json);
      
                    

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(table);
  
});


//get query timerange (Weekly)

app.get('/api/get_query', function(req, res){
  
  let url = url_get_query;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_getQuery(json);
              

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(getQueryData);
  
});

//get query timerange (Daily)
app.get('/api/get_query_daily', function(req, res){
  
  let url = url_get_query_daily;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_getQuery_Daily(json);
              

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(getQueryData_Daily);
  
});



//get query timerange (Monthly)
app.get('/api/get_query_monthly', function(req, res){
  
  let url = url_get_query_monthly;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_getQuery_Monthly(json);
              

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(getQueryData_Monthly);
  
});


// get all data including riceInspectProcessing and listInference

app.get('/api/data', function(req, res){
  //setCORSHeaders(res);
  //let url = "http://localhost:3339/grafana/allriceinspectprocessing_allcount";
  let url = url_data_riceinspectprocessing;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL(json);
              

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(timeserie);
  
});


// get riceTypeName listInference

app.get('/api/data/ricetype', function(req, res){
  //setCORSHeaders(res);
  //let url = "http://localhost:3339/grafana/allriceinspectprocessing_allcount";
  let url = url_data_ricetypename;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_ricetype(json);
      
                    

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(timeserie_ricetype);
  
});


// get standardName listInference white rice

app.get('/api/data/standardtype', function(req, res){
  
  let url = url_data_standardname;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_standardtype(json);
      
                    

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(timeserie_standardtype);
  
});




// get standardName listInference homrice

app.get('/api/data/standardtype_homrice', function(req, res){
  
  let url = url_data_standardname_homrice;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_standardtype_homrice(json);
      
                    

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(timeserie_standardtype_homrice);
  
});




// get standardName listInference hommalirice

app.get('/api/data/standardtype_hommalirice', function(req, res){
  
  let url = url_data_standardname_hommalirice;

  http.get(url,(res) => {
      let body = "";
  
      res.on("data", (chunk) => {
          body += chunk;
      });
      res.on("end", () => {
          try {                  
              let json = JSON.parse(body);           
              // do something with JSON 
              retreiveJSONURL_standardtype_hommalirice(json);
      
                    

          } catch (error) {
              console.log("This is the part where it is error");
              console.error(error.message);
          };
      });      
  }).on("error", (error) => {
      console.error(error.message);
      
  });
  res.json(timeserie_standardtype_hommalirice);
  
});




day = new Date('2021-03-31T12:47:41+07:00').getTime() / 1000
console.log(day)




app.all('/query', function(req, res){
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);
  getData()
  
  var tsResult = [];
  /*
  let fakeData = timeserie;


  if (req.body.adhocFilters && req.body.adhocFilters.length > 0) {
    fakeData = countryTimeseries;
  }*/

  _.each(req.body.targets, function(target) {
    if (target.type === 'table') {
      tsResult.push(table);
    } 
    //test
    if(target.target == "inferenceAll"){
      tsResult = timeserie
    }

    if(target.target == "query_Weekly"){
      tsResult = getQueryData
    }

    if(target.target == "query_Daily"){
      tsResult = getQueryData_Daily
    }

    if(target.target == "query_Monthly"){
      tsResult = getQueryData_Monthly
    }
    /*
    if(target.target == "riceType"){
      tsResult = timeserie_ricetype
    }*/

    for(i=0;i<=riceTypeSearch.length;i++){
      if(target.target == riceTypeSearch[i]){
        console.log(target.target+" = " + riceTypeSearch[i])
        http.get("http://localhost:3339/query_listRiceTypeName/?username="+target.target)
        tsResult = timeserie_ricetype
      }
    }
    //Check whiterice condition that receive from search target
    for(i=0;i<=whiteStandardSearch.length;i++){
      if(target.target == whiteStandardSearch[i]){
        console.log(target.target+" = " + whiteStandardSearch[i])
        http.get("http://localhost:3339/query_listStandardName/?username="+target.target)
        tsResult = timeserie_standardtype
      }
    }

    //Check homrice condition that receive from search target
    for(i=0;i<=homRiceStandardSearch.length;i++){
      if(target.target == homRiceStandardSearch[i]){
        console.log(target.target+" = " + homRiceStandardSearch[i])
        http.get("http://localhost:3339/query_listStandardName/homrice/?username="+target.target)
        tsResult = timeserie_standardtype_homrice
      }
    }


    //Check hommalirice condition that receive from search target
    for(i=0;i<=hommaliRiceStandardSearch.length;i++){
      if(target.target == hommaliRiceStandardSearch[i]){
        console.log(target.target+" = " + hommaliRiceStandardSearch[i])
        http.get("http://localhost:3339/query_listStandardName/hommalirice/?username="+target.target)
        tsResult = timeserie_standardtype_hommalirice
      }
    }
    
    /*
    else{
      http.get("http://localhost:3339/query_listRiceTypeName/?username="+target.target)
      tsResult = timeserie_ricetype
    }
    */

    //
    /*else {
      var k = _.filter(fakeData, function(t) {
        return t.target === target.target;
      });

      _.each(k, function(kk) {
        tsResult.push(kk)
      });
    }*/
  });
  
  console.log(tsResult)
  ////

  res.json(tsResult);
  res.end();
});

app.all('/tag[\-]keys', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  res.json(tagKeys);
  res.end();
});

app.all('/tag[\-]values', function(req, res) {
  setCORSHeaders(res);
  console.log(req.url);
  console.log(req.body);

  if (req.body.key == 'City') {
    res.json(cityTagValues);
  } else if (req.body.key == 'Country') {
    res.json(countryTagValues);
  }
  res.end();
});


app.listen(port);
console.log("Server is listening to port "+ port);


//For production listining on port
//module.exports = app;