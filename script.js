// http://api.openweathermap.org/data/2.5/weather?q=London&APPID=25c6b8239ec277d75611f85f42054af6
const searchbar = document.getElementById('input');
const searchBtn = document.getElementById('search-btn');
const degSymbol = '\u00B0';
const reportContainer = document.getElementById('container');
const cityNameContainer = document.getElementById('city-name');
const locationName = document.getElementById('location-name');
const reportSection = document.getElementById('report-section');
const icon = document.getElementById('icon');
const tempBtn = document.getElementById('temp-change');
const fiveDayContainer = document.getElementById('fd-container');
const tempSection = document.getElementById('temp-section');
const highTempSection = document.getElementById('high-temp-section');
const lowTempSection = document.getElementById('low-temp-section');

let baseURL1 = `http://api.openweathermap.org/data/2.5/weather?q=`;
let baseURL2 = '&APPID=25c6b8239ec277d75611f85f42054af6'

cityNameContainer.appendChild(locationName);
let report = [];
let fiveDayReport = [];
let tempStatus = 'fahrenheit';
let rawTemp;
let highTempRaw;
let lowTempRaw;

function tempStatSwitch() {
  if (tempStatus === 'fahrenheit') {
    tempStatus = 'celsius';
  } else {
    tempStatus = 'fahrenheit';
  }
}

function changeTemp() {
  if (tempStatus === 'fahrenheit') {
    // report.temperature = `${tempConvertKtoC(rawTemp)}${degSymbol}C`;
    temp = tempConvertKtoC(rawTemp);
    highTemp = tempConvertKtoC(highTempRaw);
    lowTemp = tempConvertKtoC(lowTempRaw);

    tempSection.innerHTML = "";
    tempSection.innerHTML = `${temp}${degSymbol}C`;
    highTempSection.innerHTML = '';
    highTempSection.textContent = `High: ${highTemp}${degSymbol}C`;
    lowTempSection.innerHTML = '';
    lowTempSection.innerHTML = `Low: ${lowTemp}${degSymbol}C`;
  } else {
    // report.temperature = `${tempConvertKtoF(rawTemp)}${degSymbol}F`;
    temp = tempConvertKtoF(rawTemp);
    highTemp = tempConvertKtoF(highTempRaw);
    lowTemp = tempConvertKtoF(lowTempRaw);

    tempSection.innerHTML = "";
    tempSection.innerHTML = `${temp}${degSymbol}F`;
    highTempSection.innerHTML = '';
    highTempSection.textContent = `High: ${highTemp}${degSymbol}F`;
    lowTempSection.innerHTML = '';
    lowTempSection.innerHTML = `Low: ${lowTemp}${degSymbol}F`;
  }
}

tempBtn.addEventListener('click', () => {
  changeTemp();
  tempStatSwitch();
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

    tempSection.innerHTML = "";
    tempSection.innerHTML = temp;

    let humid = results.main.humidity;

    highTempRaw = results.main.temp_max;
    let highTemp;
    if (tempStatus === 'fahrenheit') {
      highTemp = `${tempConvertKtoF(highTempRaw)}${degSymbol}F`;
    } else {
      highTemp = `${tempConvertKtoC(highTempRaw)}${degSymbol}C`;
    } 

    highTempSection.innerHTML = '';
    highTempSection.textContent = `High: ${highTemp}`;

    lowTempRaw = results.main.temp_min;
    let lowTemp;
    if (tempStatus === 'fahrenheit') {
      lowTemp = `${tempConvertKtoF(lowTempRaw)}${degSymbol}F`;
    } else {
      lowTemp = `${tempConvertKtoC(lowTempRaw)}${degSymbol}C`;
    } 

    lowTempSection.innerHTML = '';
    lowTempSection.textContent = `Low: ${lowTemp}`;

    let windSpd = results.wind.speed;
    windSpd = (windSpd * 2.2369).toFixed();

    let condStyle = results.weather[0].main;
      
    report.push(`${conditions}`, 
    // `Temperature: ${temp}`,
    `Humidity: ${humid}%`,
    // `Low: ${lowTemp}`,
    // `High: ${highTemp}`,
    `Wind: ${windSpd} mph`);

    // console.table(report)
    postReport(report);
    styleReport(condStyle, conditions);
    reportIcon(condStyle, conditions);
    // await geoCode();
    // makeFiveDayReport();
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
  // console.log(results);
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
  const makeDay = (day, conditions, highTemp, lowTemp) => {
    return {day, conditions, highTemp, lowTemp};
  }

  let day2 = makeDay("Tomorrow", `${rep.daily[1].weather[0].description}`, 
    tempConvertKtoF(rep.daily[1].temp.max), tempConvertKtoF(rep.daily[1].temp.min));

  let day3 = makeDay("Day 3", `${rep.daily[2].weather[0].description}`, 
    tempConvertKtoF(rep.daily[2].temp.max), tempConvertKtoF(rep.daily[2].temp.min));

  let day4 = makeDay("Day 4", `${rep.daily[3].weather[0].description}`, 
    tempConvertKtoF(rep.daily[3].temp.max), tempConvertKtoF(rep.daily[3].temp.min));

  let day5 = makeDay("Day 5", `${rep.daily[4].weather[0].description}`, 
    tempConvertKtoF(rep.daily[4].temp.max), tempConvertKtoF(rep.daily[4].temp.min));

  // console.log(day2, day3, day4, day5);
  fiveDayReport.push(day2, day3, day4, day5);
  // console.log(fiveDayReport[1].conditions);
  postFiveDay();
}

function postFiveDay() {
  fiveDayContainer.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    let dayEntry = document.createElement('div');
    fiveDayContainer.appendChild(dayEntry);
    dayEntry.className = "day-entry";
    let dayName = document.createElement('p');
    let dayCond = document.createElement('p');
    let dayHigh = document.createElement('p');
    let dayLow = document.createElement('p');

    dayName.textContent = `${fiveDayReport[i].day}`;
    dayCond.textContent = capitalizeStr(fiveDayReport[i].conditions);
    dayHigh.textContent = `High: ${fiveDayReport[i].highTemp}${degSymbol}F`;
    dayLow.textContent = `Low: ${fiveDayReport[i].lowTemp}${degSymbol}F`;

    dayEntry.appendChild(dayName);
    dayEntry.appendChild(dayCond);
    dayEntry.appendChild(dayHigh);
    dayEntry.appendChild(dayLow);
    // console.log(fiveDayReport[1].conditions);
  }
}

const fiveDayBtn = document.getElementById('five-day');
fiveDayBtn.addEventListener('click', () => {
  geoCode().then(() => makeFiveDayReport());
})
