const API = {
  forecast: "https://api.open-meteo.com/v1/forecast",
  geocoding: "https://geocoding-api.open-meteo.com/v1/search"
};
const state = { unit: "c", place: null, weather: null };
const $ = (selector ) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let forecastRequestId = 0;
let searchRequestId = 0;
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];
function formatNigerianState(admin1 = "") {
  const normalized = admin1.trim().toLowerCase();
  if (normalized === "fct" || normalized === "abuja federal capital territory") {
    return "Federal Capital Territory";
  }

  const stateName = nigerianStates.find((name) =>
    normalized === name.toLowerCase() ||
    normalized === `${name.toLowerCase()} state`
  );
  return stateName ? `${stateName} State` : admin1;
}

function placeDetails(place) {
  return [place.admin2, formatNigerianState(place.admin1), place.country]
    .filter((part, index, parts) => part && parts.indexOf(part) === index);
}

function isValidForecast(data) {
  return Boolean(
    data &&
    data.current &&
    data.daily &&
    data.hourly &&
    Array.isArray(data.daily.time) &&
    Array.isArray(data.daily.weather_code) &&
    Array.isArray(data.daily.temperature_2m_max) &&
    Array.isArray(data.daily.temperature_2m_min) &&
    Array.isArray(data.daily.sunrise) &&
    Array.isArray(data.daily.sunset) &&
    Array.isArray(data.hourly.time) &&
    Array.isArray(data.hourly.temperature_2m) &&
    Array.isArray(data.hourly.weather_code)
  );
}

const weatherDescriptions = (code) => {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67].includes(code)) return "Rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Rain showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorms";
  return "Cloudy skies";
};

function weatherTheme(code, isDay) {
  if (!isDay) return "night";
  if ([95, 96, 99].includes(code)) return "storm";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "snow";
  if ([45, 48].includes(code)) return "fog";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "rain";
  if ([1, 2, 3].includes(code)) return "cloudy";
  return "clear";
}

function weatherIcon(code = 2, isDay = true) {
  const sun = `<g class="sun"><circle cx="35" cy="23" r="11" fill="#FFD773"/><g stroke="#FFE8A9" stroke-width="2.3" stroke-linecap="round"><path d="M35 4v5M35 37v5M16 23h5M49 23h5M21.6 9.6l3.6 3.6m19.6 19.6 3.6 3.6M48.4 9.6l-3.6 3.6M25.2 33.2l-3.6 3.6"/></g></g>`;
  const moon = `<path class="moon-shape" d="M43 8.7A17 17 0 0 0 55 34.4 18.4 18.4 0 1 1 43 8.7Z" fill="#FFE29A"/><circle cx="52" cy="11" r="1.2" fill="#FFF2C9"/><circle cx="57" cy="22" r="1" fill="#FFF2C9"/>`;
  const cloud = `<path class="weather-cloud" d="M18 45h29a10 10 0 0 0 .5-20 15.1 15.1 0 0 0-28.9-1.7A11 11 0 0 0 18 45Z" fill="#F8FCFF" stroke="#D9ECFF" stroke-width="1.3"/>`;
  let scene = "";
  if (code === 0) scene = isDay ? sun : moon;
  else if (code === 1 || code === 2) scene = `${isDay ? sun : moon}${cloud}`;
  else if ([45,48].includes(code)) scene = `${cloud}<g class="fog-lines" stroke="#E9F4FF" stroke-width="2" stroke-linecap="round"><path d="M14 51h34M19 57h28M26 63h20"/></g>`;
  else if ([71,73,75,77,85,86].includes(code)) scene = `${cloud}<g class="snowflakes" fill="#DFF1FF" stroke="#DFF1FF" stroke-width="2" stroke-linecap="round"><path d="M25 52v8m-3-4h6m7-4v8m-3-4h6m7-4v8m-3-4h6"/></g>`;
  else if ([95,96,99].includes(code)) scene = `${cloud}<path class="thunderbolt" d="m35 47-7 12h7l-3 10 13-16h-8l4-6Z" fill="#FFD66D"/>`;
  else if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) scene = `${cloud}<g class="rain-drops" stroke="#BDE4FF" stroke-width="2.5" stroke-linecap="round"><path d="m24 51-3 7m13-7-3 7m13-7-3 7"/></g>`;
  else scene = cloud;
  return `<svg viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${scene}</svg>`;
}

function lineIcon(name ) {
  const paths = {
    humidity: '<path d="M12 3.5s-6 7.2-6 11.4a6 6 0 0 0 12 0C18 10.7 12 3.5 12 3.5Z"/><path d="M9.5 15.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    wind: '<path d="M3 8h11a3 3 0 1 0-3-3M2 12h16a3 3 0 1 1-3 3M4 16h6"/>',
    visibility: '<path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6Z"/><circle cx="12" cy="12" r="2.7"/>',
    thermometer: '<path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z"/><path d="M11 11v7"/>',
    sunrise: '<path d="M3 18h18M5 14a7 7 0 0 1 14 0M12 2v3M4.9 6l2.1 2M19.1 6l-2.1 2"/>',
    sunset: '<path d="M3 18h18M5 14a7 7 0 0 1 14 0M12 9V3M5 7l2 2m12-2-2 2"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || ""}</svg>`;
}

function celsius(value) { return state.unit === "f" ? value * 9 / 5 + 32 : value; }
function temperature(value, digits = 0) { return Math.round(celsius(value)).toFixed(digits); }
function localDate(value) {
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  return new Date(year, month - 1, day, hour || 0, minute || 0);
}
function clock(value) {
  return localDate(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function dayLabel(value, index) {
  if (index === 0) return "Today";
  return localDate(`${value}T12:00`).toLocaleDateString([], { weekday: "short" });
}
function shortDate(value) {
  return localDate(`${value}T12:00`).toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
function showNotice(message = "") {
  const notice = $("#notice");
  notice.textContent = message;
  notice.hidden = !message;
}

function animateNumber(selector, value, suffix = "", decimals = 0) {
  const element = $(selector);
  const target = Number(value);
  if (!element || !Number.isFinite(target)) return;
  const current = Number.parseFloat(element.textContent.replace(/[^0-9.-]/g, ""));
  const start = Number.isFinite(current) ? current : 0;
  if (element.motionFrame) cancelAnimationFrame(element.motionFrame);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = `${target.toFixed(decimals)}${suffix}`;
    return;
  }
  element.classList.add("value-changing");
  const startTime = performance.now();
  const duration = 650;
  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${(start + (target - start) * eased).toFixed(decimals)}${suffix}`;
    if (progress < 1) {
      element.motionFrame = requestAnimationFrame(tick);
    } else {
      delete element.motionFrame;
      element.textContent = `${target.toFixed(decimals)}${suffix}`;
      window.setTimeout(() => element.classList.remove("value-changing"), 250);
    }
  };
  element.motionFrame = requestAnimationFrame(tick);
}

function setPlace(place) {
  state.place = place;
  $("#location-name").textContent = place.name;
  const locality = placeDetails(place).filter((part) => part !== place.name);
  $("#location-subtitle").textContent = locality.join(", ") || `Local weather · ${place.timezone || "your area"}`;
}

async function loadForecast(place) {
  const requestId = ++forecastRequestId;
  showNotice("");
  $("#updated-label").textContent = "Fetching the latest forecast…";
  document.body.classList.add("is-loading");
  const params = new URLSearchParams({
    latitude: place.latitude,
    longitude: place.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,visibility",
    hourly: "temperature_2m,weather_code,precipitation_probability,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: "5"
  });
  try {
    const response = await fetch(`${API.forecast}?${params}`);
    if (!response.ok) throw new Error("The forecast service is temporarily unavailable.");
    const data = await response.json();
    if (!isValidForecast(data)) throw new Error("Weather data was incomplete. Please try again.");
    if (requestId !== forecastRequestId) return;
    state.weather = data;
    setPlace(place);
    renderWeather();
    $("#updated-label").textContent = `Updated ${clock(data.current.time)} local time`;
  } catch (error) {
    if (requestId !== forecastRequestId) return;
    $("#updated-label").textContent = "Forecast unavailable";
    showNotice(`${error.message || "An unexpected error occurred."} Check your connection and try again.`);
  } finally {
    if (requestId === forecastRequestId) document.body.classList.remove("is-loading");
  }
}

function renderWeather() {
  const data = state.weather;
  if (!data) return;
  const current = data.current;
  const daily = data.daily;
  const code = current.weather_code;
  const description = weatherDescriptions(code);
  document.body.dataset.weatherTheme = weatherTheme(code, current.is_day === 1);
  animateNumber("#current-temperature", celsius(current.temperature_2m));
  $("#current-degree").textContent = state.unit === "f" ? "°F" : "°C";
  $("#current-condition").textContent = description;
  $("#current-date").textContent = shortDate(current.time.split("T")[0]);
  $("#current-icon").innerHTML = weatherIcon(code, current.is_day === 1);
  $("#current-mini-icon").innerHTML = weatherIcon(daily.weather_code[0], true);
  animateNumber("#feels-like", celsius(current.apparent_temperature), "°");
  $("#daily-summary").textContent = `High ${temperature(daily.temperature_2m_max[0])}° · Low ${temperature(daily.temperature_2m_min[0])}°`;
  animateNumber("#humidity", current.relative_humidity_2m);
  $("#humidity-note").textContent = current.relative_humidity_2m >= 70 ? "A little humid" : current.relative_humidity_2m <= 35 ? "On the dry side" : "Comfortable air";
  animateNumber("#wind-speed", current.wind_speed_10m);
  $("#wind-note").textContent = current.wind_speed_10m >= 30 ? "Breezy conditions" : current.wind_speed_10m >= 15 ? "Steady breeze" : "Light breeze";
  const visibilityKm = current.visibility / 1000;
  animateNumber("#visibility", visibilityKm, " km", visibilityKm >= 10 ? 0 : 1);
  $("#visibility-note").textContent = visibilityKm >= 10 ? "Clear horizon" : visibilityKm >= 5 ? "Some haze" : "Reduced visibility";
  $("#sunrise").textContent = clock(daily.sunrise[0]);
  $("#sunset").textContent = clock(daily.sunset[0]);
  $("#hourly-date").textContent = data.timezone_abbreviation || "Local time";
  renderHourly();
  renderDaily();
}

function renderHourly() {
  const hourly = state.weather.hourly;
  const start = hourly.time.findIndex((time) => time >= state.weather.current.time);
  const offset = Math.max(0, start);
  const items = hourly.time.slice(offset, offset + 24);
  if (!items.length) {
    $("#hourly-list").textContent = "Hourly forecast is unavailable.";
    return;
  }
  $("#hourly-list").innerHTML = items.map((time, i) => {
    const index = offset + i;
    const label = i === 0 ? "Now" : clock(time);
    const rain = hourly.precipitation_probability?.[index] ?? 0;
    const isDay = hourly.is_day?.[index] === 1;
    return `<div class="hour-card" style="--stagger-index:${i}"><span class="hour-time">${label}</span><span class="hour-icon">${weatherIcon(hourly.weather_code[index], isDay)}</span><span class="hour-temp">${temperature(hourly.temperature_2m[index])}°</span><span class="hour-rain"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3s-6 7-6 11a6 6 0 0 0 12 0c0-4-6-11-6-11Z"/></svg>${rain}%</span></div>`;
  }).join("");
}

function renderDaily() {
  const daily = state.weather.daily;
  $("#daily-list").innerHTML = daily.time.map((date, index) => {
    const code = daily.weather_code[index];
    return `<div class="day-row" style="--stagger-index:${index}"><span class="day-name">${dayLabel(date, index)}</span><span class="day-condition">${weatherIcon(code, true)}<span>${weatherDescriptions(code)}</span></span><span class="day-temps"><span>${temperature(daily.temperature_2m_max[index])}°</span><span>${temperature(daily.temperature_2m_min[index])}°</span></span></div>`;
  }).join("");
}

async function searchPlaces(query) {
  const params = new URLSearchParams({
    name: query,
    count: "10",
    language: "en",
    format: "json",
    countryCode: "NG"
  });
  const response = await fetch(`${API.geocoding}?${params}`);
  if (!response.ok) throw new Error("Location search is unavailable right now.");
  const data = await response.json();
  if (data.results !== undefined && !Array.isArray(data.results)) {
    throw new Error("Location search returned invalid results.");
  }
  const results = (data.results || [])
    .filter((place) => place.country_code === "NG")
    .sort((first, second) => {
      const queryName = query.toLocaleLowerCase();
      const firstExact = first.name.toLocaleLowerCase() === queryName;
      const secondExact = second.name.toLocaleLowerCase() === queryName;
      if (firstExact !== secondExact) return firstExact ? -1 : 1;
      const firstCapital = first.feature_code === "PPLC";
      const secondCapital = second.feature_code === "PPLC";
      if (firstCapital !== secondCapital) return firstCapital ? -1 : 1;
      return (second.population || 0) - (first.population || 0);
    });

  const seenLocations = new Set();
  return results.filter((place) => {
    const identity = place.id ?? `${place.name}:${place.latitude}:${place.longitude}`;
    if (seenLocations.has(identity)) return false;
    seenLocations.add(identity);
    return true;
  }).slice(0, 5);
}

function showPlaceChoices(places) {
  const results = $("#search-results");
  results.replaceChildren();
  if (!places.length) {
    const emptyResult = document.createElement("div");
    emptyResult.className = "search-result";
    emptyResult.textContent = "No places found. Try a nearby city.";
    results.appendChild(emptyResult);
  } else {
    places.forEach((place, index) => {
      const meta = placeDetails(place).join(", ");
      const button = document.createElement("button");
      button.type = "button";
      button.className = "search-result";
      button.setAttribute("role", "option");
      button.setAttribute("aria-selected", "false");
      button.dataset.placeIndex = String(index);
      const name = document.createElement("span");
      name.className = "result-name";
      name.textContent = place.name;
      const details = document.createElement("span");
      details.className = "result-meta";
      details.textContent = meta;
      button.append(name, details);
      button.addEventListener("click", () => {
        const place = places[Number(button.dataset.placeIndex)];
        $("#city-search").value = "";
        results.hidden = true;
        void loadForecast(place);
      });
      results.appendChild(button);
    });
  }
  results.hidden = false;
}

$("#search-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = $("#city-search").value.trim();
  if (!query) return;
  const requestId = ++searchRequestId;
  showNotice("");
  $("#updated-label").textContent = "Searching locations…";
  try {
    const places = await searchPlaces(query);
    if (requestId !== searchRequestId) return;
    if (!places.length) {
      $("#updated-label").textContent = "No matching place";
      showNotice(`We couldn’t find “${query}” in Nigeria. Try another Nigerian city or state.`);
      $("#search-results").hidden = true;
      return;
    }
    if (places.length === 1) {
      $("#search-results").hidden = true;
      $("#city-search").value = "";
      await loadForecast(places[0]);
    } else {
      $("#updated-label").textContent = "Choose the right place";
      showPlaceChoices(places);
    }
  } catch (error) {
    if (requestId !== searchRequestId) return;
    $("#updated-label").textContent = "Search unavailable";
    showNotice(`${error.message || "An unexpected error occurred."} Please try again.`);
  }
});

$("#location-button").addEventListener("click", () => {
  if (!navigator.geolocation) {
    showNotice("Your browser doesn’t support location access. Search for a city instead.");
    return;
  }
  $("#updated-label").textContent = "Finding your location…";
  navigator.geolocation.getCurrentPosition(async ({ coords }) => {
    const place = { name: "Your location", admin1: "", country: "", latitude: coords.latitude, longitude: coords.longitude, timezone: "local time" };
    await loadForecast(place);
  }, () => {
    $("#updated-label").textContent = "Location unavailable";
    showNotice("Location access was not available. Allow it in your browser or search for a city.");
  }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
});

$$(".unit-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.unit = button.dataset.unit;
    $$(".unit-button").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    renderWeather();
  });
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-form")) $("#search-results").hidden = true;
});

$$('[data-icon]').forEach((element) => { element.innerHTML = lineIcon(element.dataset.icon); });

const defaultPlace = {
  name: "Lagos",
  admin1: "Lagos State",
  country: "Nigeria",
  latitude: 6.5244,
  longitude: 3.3792,
  timezone: "Africa/Lagos"
};
void loadForecast(defaultPlace);
