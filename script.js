// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=25c6b8239ec277d75611f85f42054af6
const searchbar = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const degSymbol = '\u00B0';
const reportContainer = document.getElementById('container');
const cityNameContainer = document.getElementById('city-name')
const locationName = document.createElement('h3');
const reportSection = document.getElementById('report-section');

let baseURL1 = `http://api.openweathermap.org/data/2.5/weather?q=`;
let baseURL2 = '&APPID=25c6b8239ec277d75611f85f42054af6'

cityNameContainer.appendChild(locationName);

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

function capitalizeStr(string) {
  string = string.charAt(0).toUpperCase() + string.slice(1);
  return string;
}

async function makeWeatherReport(loc) {
  let newURL = `${baseURL1}${loc}${baseURL2}`;
  let report = [];
  try {
    const weather = await fetch(newURL, {mode: 'cors'});
    const results = await weather.json();
    // console.log(results);

    locationName.innerHTML = '';
    let city = results.name;
    locationName.textContent = city;

    let conditions = results.weather[0].description;
    conditions = capitalizeStr(conditions);

    let temp = results.main.temp;
    temp = tempConvertKtoF(temp);

    let humid = results.main.humidity;

    let highTemp = results.main.temp_max;
    highTemp = tempConvertKtoF(highTemp);

    let lowTemp = results.main.temp_min;
    lowTemp = tempConvertKtoF(lowTemp);

    let windSpd = results.wind.speed;
    windSpd = (windSpd * 2.2369).toFixed();

    // report.conditions = conditions;
    // report.temperature = `${temp}${degSymbol}F`;
    // report.humidity = `${humid}%`;
    // report['low temperature'] = `${lowTemp}${degSymbol}F`;
    // report['high temperature'] = `${highTemp}${degSymbol}F`;
    // report.wind = `${windSpd} mph`

    report.push(`Conditions: ${conditions}`, 
    `Temperature: ${temp}${degSymbol}F`,
    `Humidity: ${humid}%`,
    `Low temp: ${lowTemp}${degSymbol}F`,
    `High temp: ${highTemp}${degSymbol}F`,
    `Wind: ${windSpd} mph`);

    // console.table(report)
    postReport(report);
    return city;
  }
  catch(err) {
    alert("No match found");
  }
}

searchBtn.addEventListener('click', () => {
  makeWeatherReport(searchbar.value);
});

searchbar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
  makeWeatherReport(searchbar.value);
  }
})

function postReport(rep) {
  reportSection.innerHTML = '';
  // locationName.textContent = searchbar.value;
  // reportSection.appendChild(locationName);
  for (let i = 0; i < rep.length; i++) {
    const entry = document.createElement('p');
    entry.textContent = rep[i];
    reportSection.appendChild(entry);
  }
}

/*
let testObj = [
  'one: one',
  'two: two',
  'three: three',
  "bestbooty: Kristie",
]

function postObj(obj) {
  for (let i = 0; i < obj.length; i++) {
    const entry = document.createElement('p');
    entry.textContent = obj[i];
    reportSection.appendChild(entry);
  }
}

postObj(testObj);
*/