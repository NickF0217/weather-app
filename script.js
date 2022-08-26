// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=25c6b8239ec277d75611f85f42054af6
let baseURL1 = `http://api.openweathermap.org/data/2.5/weather?q=`;
let baseURL2 = '&APPID=25c6b8239ec277d75611f85f42054af6'
// console.log(baseURL1 + 'Miami' + baseURL2);

function tempConvertKtoC(k) {
  let c = k - 273.15;
  c = c.toFixed(1);
  return c;
}

// function testWeather() {
//     fetch('http://api.openweathermap.org/data/2.5/weather?q=Charlotte&APPID=25c6b8239ec277d75611f85f42054af6',
//     {mode: 'cors'})
//     .then(function(response) {
//         let result;
//         result = response.json();
//         console.log(result);
//     })
// }
// testWeather();

function test2(loc) {
  let newURL = `${baseURL1}${loc}${baseURL2}`;
  fetch(newURL, {mode: 'cors'})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let temp = data.main.temp;
    let tempCel = tempConvertKtoC(temp);
    console.log(`The temperature in ${loc} is ${tempCel} degrees celcius`);
  })
}
test2('New York');

