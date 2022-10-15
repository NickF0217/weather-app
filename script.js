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
const fiveDayContainer = document.getElementById('fd-container');
const fiveDayTests = document.getElementsByClassName('test5d');

let baseURL1 = `http://api.openweathermap.org/data/2.5/weather?q=`;
let baseURL2 = '&APPID=25c6b8239ec277d75611f85f42054af6'

cityNameContainer.appendChild(locationName);
let report = [];
let fiveDayReport = [];
let tempStatus = 'fahrenheit';
let rawTemp;

function tempStatSwitch() {
  if (tempStatus === 'fahrenheit') {
    tempStatus = 'celsius';
  } else {
    tempStatus = 'fahrenheit';
  }
}

function changeTemp() {
  if (tempStatus === 'fahrenheit') {
    report.temperature = `${tempConvertKtoC(rawTemp)}${degSymbol}C`;
  } else {
    report.temperature = `${tempConvertKtoF(rawTemp)}${degSymbol}F`;
  }
}

tempBtn.addEventListener('click', () => {
  changeTemp();
  tempStatSwitch();
  makeWeatherReport(searchbar.value)
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

// function tempConvertFtoC(f) {
//   let c = (f - 32)/1.8;
//   c = c.toFixed(1);
//   return c;
// }

// function tempConvertCtoF(c) {
//   let f = c * (9/5) + 32;
//   f = f.toFixed(1);
//   return f;
// }

function capitalizeStr(string) {
  string = string.charAt(0).toUpperCase() + string.slice(1);
  return string;
}

async function makeWeatherReport(loc) {
  let newURL = `${baseURL1}${loc}${baseURL2}`;
  report = [];
  try {
    const weather = await fetch(newURL, {mode: 'cors'});
    const results = await weather.json();
    console.log(results);

    locationName.innerHTML = '';
    let city = results.name;
    locationName.textContent = city;

    let conditions = results.weather[0].description;
    conditions = capitalizeStr(conditions);

    rawTemp = results.main.temp;
    let temp;
    if (tempStatus === 'fahrenheit') {
      temp = `${tempConvertKtoF(rawTemp)}${degSymbol}F`;
    } else {
      temp = `${tempConvertKtoC(rawTemp)}${degSymbol}C`;
    } 

    let humid = results.main.humidity;

    let highTempRaw = results.main.temp_max;
    let highTemp;
    if (tempStatus === 'fahrenheit') {
      highTemp = `${tempConvertKtoF(highTempRaw)}${degSymbol}F`;
    } else {
      highTemp = `${tempConvertKtoC(highTempRaw)}${degSymbol}C`;
    } 

    let lowTempRaw = results.main.temp_min;
    let lowTemp;
    if (tempStatus === 'fahrenheit') {
      lowTemp = `${tempConvertKtoF(lowTempRaw)}${degSymbol}F`;
    } else {
      lowTemp = `${tempConvertKtoC(lowTempRaw)}${degSymbol}C`;
    } 

    let windSpd = results.wind.speed;
    windSpd = (windSpd * 2.2369).toFixed();

    let condStyle = results.weather[0].main;
      
    report.push(`Conditions: ${conditions}`, 
    `Temperature: ${temp}`,
    `Humidity: ${humid}%`,
    `Low: ${lowTemp}`,
    `High: ${highTemp}`,
    `Wind: ${windSpd} mph`);

    // console.table(report)
    postReport(report);
    styleReport(condStyle, conditions);
    reportIcon(condStyle, conditions);
    await geoCode();
    makeFiveDayReport();
  }
  catch(err) {
    alert("No match found");
  }
}

searchBtn.addEventListener('click', () => {
  makeWeatherReport(searchbar.value);
  // geoCode().then(() => {makeFiveDayReport()});
});

searchbar.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
  makeWeatherReport(searchbar.value);
  // geoCode().then(() => {makeFiveDayReport()});
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
    reportSection.style.backgroundColor = 'var(--cloudy)';
    cityNameContainer.style.backgroundColor = 'var(--cloudy)';
    reportSection.style.color = 'white';
    cityNameContainer.style.color = 'white';
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
    icon.src = "./images/raining.png";
  }
  else {
    icon.src = "./images/weather.png";
  }
}


let latitude;
let longitude;

async function makeFiveDayReport() {
  let fiveDayURL = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&appid=25c6b8239ec277d75611f85f42054af6`;

  const fiveDay = await fetch(fiveDayURL, {mode: 'cors'});
  const results = await fiveDay.json();
  console.log(results);
  // postFiveDay(results);
  fiveDayInfo(results);
}

async function geoCode() {
  let geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchbar.value}&limit=5&appid=25c6b8239ec277d75611f85f42054af6`;
  
  const latLon = await fetch(geoURL, {mode: 'cors'});
  const results = await latLon.json();
  // console.log(results);
  latitude = results[0].lat;
  longitude = results[0].lon;
  // console.log(latitude, longitude);
  // return latitude, longitude;
}

function fiveDayInfo(rep) {
  let day2 = {
    day: "Tomorrow",
    conditions: `${rep.daily[1].weather[0].description}`,
    "High temp": `${rep.daily[1].temp.max}`,
    "Low temp": `${rep.daily[1].temp.max}`
  }

  let day3 = {
    day: "Day 3",
    conditions: `${rep.daily[2].weather[0].description}`,
    "High temp": `${rep.daily[2].temp.max}`,
    "Low temp": `${rep.daily[2].temp.max}`
  }

  let day4 = {
    day: "Day 4",
    conditions: `${rep.daily[3].weather[0].description}`,
    "High temp": `${rep.daily[3].temp.max}`,
    "Low temp": `${rep.daily[3].temp.max}`
  }
  let day5 = {
    day: "Day 5",
    conditions: `${rep.daily[4].weather[0].description}`,
    "High temp": `${rep.daily[4].temp.max}`,
    "Low temp": `${rep.daily[4].temp.max}`
  }
  // console.log(day2, day3, day4, day5);
  fiveDayReport.push(day2, day3, day4, day5);
  // console.log(fiveDayReport);
  postFiveDay();
}

function postFiveDay() {
  fiveDayContainer.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    let dayEntry = document.createElement('div');
    dayEntry.textContent = fiveDayReport[i];
    fiveDayContainer.appendChild(dayEntry);
  }
}

const fiveDayBtn = document.getElementById('five-day');
fiveDayBtn.addEventListener('click', () => {
  geoCode().then(() => makeFiveDayReport());
})

/*
Geocoding call:
`http://api.openweathermap.org/geo/1.0/direct?q=<LOCATION>&limit=5&appid=25c6b8239ec277d75611f85f42054af6`

One call by call:
`https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=25c6b8239ec277d75611f85f42054af6`

Notes: posting the five day report in object form isnt working. Search a city to see.
*/