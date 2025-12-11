const express = require('express');
const app = express();

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));

app.use('/', require('./routes/auth'));

app.get('/', (req,res)=>res.redirect('/login'));

app.listen(3000, ()=>console.log('Hospital App Running'));
