import { useState, useEffect } from 'react'

import './App.css'
import PropTypes from "prop-types"

import searchIcon from"./assets/icons8-search-16.png";
import clearIcon from"./assets/sun.jpg";
import cloudIcon from "./assets/cloud.jpg";
import dizzleIcon from "./assets/dizzle.jpg";
import rainIcon from "./assets/rain.jpg";
import windIcon from "./assets/icons8-wind-64.png";
import snowIcon from "./assets/snow.png";
import humidityIcon from "./assets/icons8-humidity-100.png";

const WeatherDetails = ({icon, temp , city, country , lat , log ,humidity, wind}) => {
  return (  <>
    <div className='image'>
      <img src={icon } alt='image' />
    </div>
    <div className='temp'>
    {temp}°C
    </div>
    <div className='location'>
      {city}
    </div>
    <div className='country'>
       {country}
    </div>
    <div className='cord'>
      <div>
        <span className='lat'>
           latitude
        </span>
        <span>{lat}</span>
      </div>
      <div>
        <span className='log'>
           longitude
        </span>
        <span>{log}</span>
      </div>
    </div>
    <div className='data-container'>
      <div className='element'>
        <img src = {humidityIcon} alt='humidity' className='icon'/>
        <div className='data'>
          <div className='humidity-percent'>
             {humidity} %
          </div>
          <div className='text'>Humidity</div>
        </div>
      </div>
      <div className='element'>
        <img src = {windIcon} alt='wind' className='icon'/>
        <div className='data'>
          <div className='wind-percent'>
             
             {wind} km/hr
          </div>
          <div className='text'>wind speed</div>
        </div>
      </div>
    </div>
    </>)
}

WeatherDetails.propTypes = {
  icon : PropTypes.string.isRequired,
  temp : PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country : PropTypes.string.isRequired,
  humidity : PropTypes.number.isRequired,
  wind : PropTypes.number.isRequired,
  lat : PropTypes.number.isRequired,
  log : PropTypes.number.isRequired,
}
function App() {
  let api_key ="127097d722f25ac0b46712d4e30fef7c";
  const [text, setText]= useState("Mumbai")

const [icon, setIcon] = useState(snowIcon);
const [temp, setTemp] = useState(0);
const [city, setCity] = useState("");
const [country, setCountry] = useState("");
const [lat, setLat] = useState("0");
const [log, setLog] = useState("0");
const [humidity, setHumidity] = useState(0);
const [wind, setWind] = useState(0);

const [cityNotFound, setCityNotFound] = useState(false);
const [loading, setLoading] = useState(false);
const [error,setError] = useState(null);

const weatherIconMap={
  "01d":clearIcon,
  "01n":clearIcon,
  "02d":cloudIcon,
  "02n":cloudIcon,
  "03d":dizzleIcon,
  "03n":dizzleIcon,
  "04d":dizzleIcon,
  "04n":dizzleIcon,
  "09d":rainIcon,
  "09n":rainIcon,
  "10d":rainIcon,
  "10n":rainIcon,
  "13d":snowIcon,
  "13n":snowIcon,
}


const search=async()=>{
  
  setLoading(true);

  let url =`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;

  try{
    let res = await fetch(url);
    let data = await res.json();
    //console.log(data)
    if (data.cod === "404"){
      console.error("City not found")
      setCityNotFound(true)
      setLoading(false)
      return;
    }

    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLog(data.coord.lon);
    const weatherIconCode = data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || clearIcon);
    setCityNotFound(false);

  }catch(error){
    console.error("An error occured;",error.message)

    setError("An error occured while fetching weather data.");

  }finally{
    setLoading(false)
  }
};
 const handleCity = async (e) => {
    setText(e.target.value);
 }
 const handleKeyDown = (e) => {
  if (e.key === "Enter") {
    search();
  }
 };

 useEffect (function (){
  search();

 },[])
 
  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type='text'
           className='cityInput' 
           placeholder='search city ' 
           onChange={handleCity}
           value={text}
           onKeyDown={handleKeyDown}
           />

          <div className='search-icon' onClick={()=> search()}>
            <img src={searchIcon} alt='search' />
          </div>
        </div>
        
        
       {loading && <div className='loading-message'>Loading...</div>}
       {error && <div className='error-message'>{error}</div>}
       {cityNotFound && <div className='city-not-found'>City Not Found</div>}
       
       {!loading && !cityNotFound && <WeatherDetails icon ={icon} temp = {temp} city ={city} country={country} lat = {lat} log = {log} 
        humidity={humidity} wind = {wind}
        />}

        <p className='copyright'>
          Designed by <span>Parthasarathi D</span>
        </p>
      </div>

        
    </>
  )
}

export default App
