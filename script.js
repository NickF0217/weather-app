// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=25c6b8239ec277d75611f85f42054af6
const searchbar = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const degSymbol = '\u00B0';
const reportContainer = document.getElementById('container');
const cityNameContainer = document.getElementById('city-name');
const locationName = document.createElement('h3');
const reportSection = document.getElementById('report-section');
const icon = document.getElementById('icon');
const tempBtn = document.getElementById('temp-change');

let baseURL1 = `http://api.openweathermap.org/data/2.5/weather?q=`;
let baseURL2 = '&APPID=25c6b8239ec277d75611f85f42054af6'

cityNameContainer.appendChild(locationName);
let report = {};
let tempStatus = 'fahrenheit';

function tempStatSwitch() {
  if (tempStatus === 'fahrenheit') {
    tempStatus = 'celsius';
  } else {
    tempStatus = 'fahrenheit';
  }
}

function changeTemp() {
  if (tempStatus === 'fahrenheit') {
    report.temperature = tempConvertFtoC(report.temperature);
  } else {
    report.temperature = tempConvertCtoF(report.temperature);
  }
}

tempBtn.addEventListener('click', () => {
  changeTemp();
  tempStatSwitch();
  console.log(report.temperature);
})

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

function tempConvertFtoC(f) {
  let c = (f - 32)/1.8;
  c = c.toFixed(1);
  return c;
}

function tempConvertCtoF(c) {
  let f = c * (9/5) + 32;
  f = f.toFixed(1);
  return f;
}

function capitalizeStr(string) {
  string = string.charAt(0).toUpperCase() + string.slice(1);
  return string;
}

async function makeWeatherReport(loc) {
  let newURL = `${baseURL1}${loc}${baseURL2}`;
  // let report = [];
  report = {conditions: null, temperature: null, humidity: null, 
  'low temp': null, 'high temp': null, wind: null};
  try {
    const weather = await fetch(newURL, {mode: 'cors'});
    const results = await weather.json();
    //console.log(results);

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

    let condStyle = results.weather[0].main;

    report.conditions = conditions;
    // report.temperature = `${temp}${degSymbol}F`;
    report.temperature = temp;
    report.humidity = `${humid}%`;
    report['low temp'] = `${lowTemp}${degSymbol}F`;
    report['high temp'] = `${highTemp}${degSymbol}F`;
    report.wind = windSpd;

    // console.table(report)
    postReport(report);
    styleReport(condStyle, conditions);
    reportIcon(condStyle, conditions);
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
  for (let i = 0; i < rep.length; i++) {
    const entry = document.createElement('p');
    entry.textContent = rep[i];
    reportSection.appendChild(entry);
  }
}

function styleReport(x, y) {
  if (x == "Clear") {
    reportSection.style.backgroundColor = "var(--sunny)";
    cityNameContainer.style.backgroundColor = "var(--sunny)";
  }
  else if (x == "Clouds") {
    if (y == "Few clouds" || y == "Scattered clouds") {
      reportSection.style.backgroundColor = "var(--sunny)";
      cityNameContainer.style.backgroundColor = "var(--sunny)";
    }
    else if (y == "Broken clouds" || y == "Overcast clouds") {
      reportSection.style.backgroundColor = "var(--cloudy)";
      cityNameContainer.style.backgroundColor = "var(--cloudy)";
    }
  }
  else if (x == "Rain" || x == "Thunderstorm" || x == "Drizzle" || x == "Snow" || x == "Mist") {
    reportSection.style.backgroundColor = "var(--cloudy)";
    cityNameContainer.style.backgroundColor = "var(--cloudy)";
  }
  else {
    reportSection.style.backgroundColor = 'white';
    cityNameContainer.style.backgroundColor = 'white';
    reportSection.style.color = 'black';
    cityNameContainer.style.color = 'black';
  }
}

function reportIcon(x, y) {
  if (x == "Clear") {
    icon.src = './images/001-sun.png';
  }
  else if (x == "Clouds") {
    if (y == "Few clouds" || y == "Scattered clouds") {
      icon.src = './images/002-cloudy.png';
    } else if (y == "Broken clouds" || y == "Overcast clouds") {
      icon.src = './images/003-cloud.png';
    }
  }
  else if (x == "Rain") {
    icon.src = "./images/004-rain.png";
  }
  else if (x == "Drizzle") {
    icon.src = "./images/008-rainy.png";
  }
  else if (x == "Thunderstorm") {
    icon.src = "./images/006-storm.png";
  }
  else if (x == "Snow") {
    icon.src = "./images/007-snow.png";
  }
  else if (x == "Mist") {
    icon.src = "./images/raining.png"
  }
}