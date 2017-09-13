//Load connections
var connection = require('../config');
//Load PG library version 6 not version 7.
var pg = require("pg");
//Needed for Heroku Promises or APP crashes
pg.defaults.ssl = true;

var bodyParser = require("body-parser");

module.exports = function (app){

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));

    //View Indivisual User
    app.get('/person/:id',function(req,res){
        //with more time this passsed ID would be encrypted and decrypted here.
        var results = [];
        var personId = parseInt(req.params.id);

        pg.connect(connection.getDBConnStr, function(err, client) {
            if (err) throw err;
            
          
            client
              .query('select * from main where id = '+personId+' limit 1')
              .on('row', function(row) {
                
                results.push(row);
              })
              .on('end',()=>{
                  
                    res.render('./pages/person',{title:"Person Details",results:results});
                });
             
          });

    });
    //Home Page
    app.get('/', function(req, res) {
        //return search variable that a post was NOT made.
        //reutnr emptry results.
        //Change title
        res.render('./pages/index',{title:"Search", results:{},search:0});
    });
    //Home Page - Posted search result
    app.post('/', function(req, res) {

        var results = [];
        var search = req.body.search;
        //check if there's search parameters else render blank page
       if(search.length>0)
        {
        pg.connect(connection.getDBConnStr, function(err, client) {
            if (err) throw err;
            client
              .query("SELECT id,givenname,middleinitial,surname FROM main WHERE givenname ILIKE '%"+search+"%' or surname ILIKE '%"+search+"%'")
              .on('row', function(row) {  
                  //use On Row & End event since the output is cleaner then result callback funciton.  May not be the best technique until the 
                  //PG library can be confirmed it's faster for large scale data
                results.push(row);
              })
              .on('end',()=>{
                   //return search variable that a post was made.
                    //Change title
                    res.render('./pages/index',{title:"Search Results", results: results,search:1});
                });
              
          });
        }
        else
        {
            //return search variable that a post was made.
            //Change title
            res.render('./pages/index',{title:"Search Results",results:{},search:1});
        }
        
    });

    
}