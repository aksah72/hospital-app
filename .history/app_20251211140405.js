const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let appointments = [];

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index', { title: 'Hospital Appointment Booking' });
});

app.post('/book', (req, res) => {
  const { name, email, doctor, date, time } = req.body;

  if (!name || !email || !doctor || !date || !time) {
    return res.render('index', {
      title: 'Hospital Appointment Booking',
      error: 'All fields are required!'
    });
  }

  const appointment = {
    id: appointments.length + 1,
    name,
    email,
    doctor,
    date,
    time,
    createdAt: new Date().toLocaleString()
  };

  appointments.push(appointment);
  res.redirect('/appointments');
});

app.get('/appointments', (req, res) => {
  res.render('appointments', {
    title: 'All Appointments',
    appointments
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`App running at http://localhost:${PORT}`);
});
