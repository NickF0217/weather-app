// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=25c6b8239ec277d75611f85f42054af6
let baseURL1 = `http://api.openweathermap.org/data/2.5/weather?q=`;
let baseURL2 = '&APPID=25c6b8239ec277d75611f85f42054af6'
// console.log(baseURL1 + 'Miami' + baseURL2);

function tempConvertKtoC(k) {
  let c = k - 273.15;
  c = c.toFixed(1);
  return c;
}

function tempConvertKtoF(k) {
  let f = 1.8*(k-273) + 32;
  f = f.toFixed(1);
  return f;
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
    // console.log(data);
    let temp = data.main.temp;
    let tempConv = tempConvertKtoF(temp);
    console.log(`Test 2: The temperature in ${loc} is ${tempConv} degrees fahrenheit`);
  })
}
// test2('Sacramento');

async function test3(loc) {
  let newURL = `${baseURL1}${loc}${baseURL2}`;
  try {
    const weather = await fetch(newURL, {mode: 'cors'});
    const results = await weather.json();
    // console.log(results);
    let temp = await results.main.temp;
    let tempConv = await tempConvertKtoF(temp);
    console.log(`Test 3: The temperature in ${loc} is ${tempConv} degrees fahrenheit`);
  }
  catch(err) {
    console.log("No match found");
  }
}
// test3('Manhattan');

