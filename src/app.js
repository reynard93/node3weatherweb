const express = require('express')
const path = require('path')
const hbs = require('hbs')
const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
//define path for views
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicPath));

app.get('', (req,res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Andrew Mead'
  })
})

app.get('/products', (req,res) => {
  //search param is required**
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term'
    })
  }
  res.send({
    products: []
  })
})

app.get('/about', (req,res) => {
  res.render('about', {
    title: 'About MEMEME',
    name: "Andre Mead"
  })
})

app.get('/help', (req,res) => { 
  res.render('help', {
    helpText: 'lorem ipsum blah blah',
    title: 'Help',
    name: 'Andrew Mead'
  })
})


app.get('/weather', (req,res) => {
  if(!req.query.address){
    return res.send({
      error: 'You must provide an address'
    })
  }
  const address = req.query.address;
  geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => { //set up default object make sure our app dont crash even if no data provided
    if (error) {
      return res.send({
        error
      })
    }
    forecast(latitude, longtitude, (error, forecastData) => {
      if (error) {
        return res.send({
          error: error
        })
      }
      return res.send({
        forecast: forecastData,
        location,
        address
      })

    }) 
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    error: "Help article not found",
    name: 'Andrew Mead'
  })
})

//handling 404 pages
app.get('*', (req,res) => {
  res.render('404', {
    error: "Page not found",
    name: 'Andrew Mead'
  })
})

app.listen(port, () => {
  console.log('Server is up ' + port)
})