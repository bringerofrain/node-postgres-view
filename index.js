var express = require('express');
var app = express();
//Load custom controllers
var apiController = require("./controllers/apiController")



//Port imported from Heroku
app.set('port', (process.env.PORT || 5000));

//Static Files imported from Heroku no need to change
app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//Load Routes
apiController(app);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
