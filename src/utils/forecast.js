const request = require('request')

const forecast = (lat,long, callback) => {
  const url = `https://api.darksky.net/forecast/62712e4529e0fb166be64ddea21038b4/${lat},${long}`;

  request({url, json: true}, (error, {body}) => {
    if (error) {
      callback('unable to connect to Weather service');
    } else if (body.error) {
      callback('unable to find location, try another search')
    } else {
      const {temperature, precipProbability} = body.currently;
      callback(undefined,`It is currently ${temperature} degrees out. There is a ${precipProbability}% chance of rain.`)
    }
  })
}

module.exports = forecast