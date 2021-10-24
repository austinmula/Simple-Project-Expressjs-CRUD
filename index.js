const PORT = 3000 || process.env.PORT;
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const fileName = 'studentdata.json';

let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

const app = express();

app.use('/api/students', require('./routes/studentroutes'));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined'));

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/students', function (req, res) {
  res.render('students', { data });
});

app.get('/charts', function (req, res) {
  res.render('charts');
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
