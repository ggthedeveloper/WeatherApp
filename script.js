const BASE = "http://localhost:3000";

let map, marker, chart;

/* ===== UI ===== */
function toggleMode(){
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
}

/* ===== WEATHER ===== */
async function getWeather(city){
  city ||= document.getElementById("city").value;
  if(!city) return;

  saveCity(city);

  const res = await fetch(`${BASE}/weather?city=${city}`);
  const data = await res.json();

  if (data.cod !== 200) {
    alert("City not found or API error");
    return;
  }

  updateUI(data);
  loadMap(data.coord.lat, data.coord.lon);
  getAQI(data.coord.lat, data.coord.lon);
  getForecast(data.coord.lat, data.coord.lon);
}

async function getWeatherByCoords(lat, lon){
  const res = await fetch(`${BASE}/weather?lat=${lat}&lon=${lon}`);
  const data = await res.json();

  updateUI(data);
  loadMap(lat, lon);
  getAQI(lat, lon);
  getForecast(lat, lon);
}

/* ===== UI UPDATE ===== */
function updateUI(data){
  document.getElementById("temp").innerText = `${Math.round(data.main.temp)}°C`;
  document.getElementById("feels").innerText = `Feels like ${Math.round(data.main.feels_like)}°C`;
  document.getElementById("desc").innerText = data.weather[0].description;
  document.getElementById("place").innerText = `${data.name}, ${data.sys.country}`;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  aiSummary(data);
}

/* ===== FORECAST ===== */
async function getForecast(lat, lon){
  const res = await fetch(`${BASE}/forecast?lat=${lat}&lon=${lon}`);
  const data = await res.json();

  if (!data.list) return;

  drawChart(data);
  showForecast(data);
}

function drawChart(data){
  const list = data.list.slice(0, 8);

  const temps = list.map(i => i.main.temp);
  const times = list.map(i =>
    new Date(i.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  );

  if (chart) chart.destroy();

  chart = new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: "Temperature (°C)",
        data: temps,
        borderColor: "#ff9800",
        backgroundColor: "rgba(255,152,0,0.2)",
        fill: true,
        tension: 0.4
      }]
    }
  });
}

function showForecast(data){
  const box = document.getElementById("forecast");
  box.innerHTML = "";

  data.list
    .filter(i => i.dt_txt.includes("12:00"))
    .forEach(d => {
      box.innerHTML += `
        <div class="day">
          <p>${new Date(d.dt_txt).toLocaleDateString("en",{weekday:"short"})}</p>
          <img src="https://openweathermap.org/img/wn/${d.weather[0].icon}.png">
          <p>${Math.round(d.main.temp)}°C</p>
        </div>`;
    });
}

/* ===== MAP ===== */
function loadMap(lat, lon){
  if(!map){
    map = L.map("map").setView([lat,lon],10);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
    marker = L.marker([lat,lon]).addTo(map);
  } else {
    map.setView([lat,lon],10);
    marker.setLatLng([lat,lon]);
  }
}

/* ===== AQI ===== */
async function getAQI(lat, lon){
  const res = await fetch(`${BASE}/aqi?lat=${lat}&lon=${lon}`);
  const data = await res.json();

  const aqi = data.list[0].main.aqi;
  const pm25 = data.list[0].components.pm2_5;
  const pm10 = data.list[0].components.pm10;

  const levels = [
    ["Good 😊", "#2ecc71", "Enjoy outdoor activities"],
    ["Fair 🙂", "#27ae60", "Sensitive people be cautious"],
    ["Moderate 😐", "#f1c40f", "Reduce outdoor exposure"],
    ["Poor 😷", "#e67e22", "Avoid outdoor activities"],
    ["Very Poor ☠️", "#e74c3c", "Stay indoors"]
  ];

  const [text, color, advice] = levels[aqi - 1];

  document.getElementById("aqi").innerText = `Air Quality: ${text}`;
  document.getElementById("pm").innerText = `PM2.5: ${pm25} | PM10: ${pm10}`;
  document.getElementById("health").innerText = `Health Advice: ${advice}`;

  const bar = document.getElementById("aqiFill");
  bar.style.width = `${aqi * 20}%`;
  bar.style.background = color;

  document.getElementById("aqiBox").style.display = "block";
}

/* ===== EXTRA FEATURES ===== */
function aiSummary(data){
  let text = "Weather is ";
  if(data.main.temp > 30) text += "hot. Stay hydrated.";
  else if(data.main.temp < 10) text += "cold. Wear warm clothes.";
  else text += "pleasant.";

  document.getElementById("ai").innerText = "🤖 " + text;
}

function saveCity(city){
  let list = JSON.parse(localStorage.getItem("cities")) || [];
  if(!list.includes(city)){
    list.unshift(city);
    localStorage.setItem("cities", JSON.stringify(list.slice(0,5)));
  }
}

function voiceSearch(){
  if (!("webkitSpeechRecognition" in window)) {
    alert("Voice search supported only in Chrome");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.onresult = e => {
    document.getElementById("city").value = e.results[0][0].transcript;
    getWeather();
  };
  rec.start();
}

function getLocation(){
  navigator.geolocation.getCurrentPosition(pos => {
    getWeatherByCoords(pos.coords.latitude, pos.coords.longitude);
  });
}

async function citySuggestions(query){
  if(query.length < 2){
    document.getElementById("suggestions").innerHTML = "";
    return;
  }

  const res = await fetch(`${BASE}/cities?q=${query}`);
  const cities = await res.json();

  const box = document.getElementById("suggestions");
  box.innerHTML = "";

  cities.forEach(c => {
    const div = document.createElement("div");
    div.innerText = `${c.name}, ${c.country}`;
    div.onclick = () => {
      document.getElementById("city").value = c.name;
      box.innerHTML = "";
      getWeather(c.name);
    };
    box.appendChild(div);
  });
}

/* ===== SERVICE WORKER ===== */
if("serviceWorker" in navigator){
  navigator.serviceWorker.register("service-worker.js");
}