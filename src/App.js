import React,{useState, useEffect} from 'react';
import './App.css';
import {MenuItem,Select,FormControl} from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import {Card,CardContent} from '@material-ui/core';
import {sortData, prettifyNumbers} from './util';
import  LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";

function App() { 
  const [countries,setCountries] = useState([]);
  const [country,setCountry] = useState('worldwide');
  const [countryInfo,setCountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat:34.80476, lng:-40.4796});
  const [mapZoom,setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] =useState([]);
  const [casesType,setCasesType] = useState('cases');

  //this is to load for the first time when page loads
  useEffect (()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      
      setCountryInfo(data)
    })
  },[])

  useEffect(()=>{
    const getCountriesData = async() => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        
        const countries= data.map((country) => ({
          name: country.country,
          value : country.countryInfo.iso2
        }))

        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
        setMapCountries(data);
      })
    }; 
    getCountriesData()   
  },[]);

  const onChangeCountry = async (event) => {
    const countryCode = event.target.value
    console.log(countryCode)
    
    const url = countryCode === 'worldwide' 
    ? 'https://disease.sh/v3/covid-19/all'
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setCountry(countryCode)
      //contains all info of the selected country
      setCountryInfo(data);
      console.log(data);

      setMapCenter([data.countryInfo.lat,data.countryInfo.long]);
      setMapZoom(4);
    })
    
  }
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid Tracker</h1>
          <FormControl className="app__dropdown">
            <Select varient="outlined" value={country} onChange={onChangeCountry}> 
                <MenuItem key="worldwide" value="worldwide">Worlwide</MenuItem>
                {
                  countries.map((country_index,idx) => (
                  <MenuItem key={idx}
                            value={country_index.value}>
                      {country_index.name}
                  </MenuItem>
                  ))
                }
            </Select>
            </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
                  active={casesType==='cases'}
                  title="Corona Virus Cases" 
                  cases={prettifyNumbers(countryInfo.todayCases)} 
                  total={prettifyNumbers(countryInfo.cases)}
                  onClick={(e)=>setCasesType('cases')}>
          </InfoBox>
          <InfoBox 
                active={casesType==='recovered'}
                title="Recovered" 
                cases={prettifyNumbers(countryInfo.todayRecovered)} 
                total={prettifyNumbers(countryInfo.recovered)}
                onClick={(e)=>setCasesType('recovered')}>
          </InfoBox>
          <InfoBox 
              active={casesType==='deaths'}
              title="Deaths" 
              cases={prettifyNumbers(countryInfo.todayDeaths)}
              total={prettifyNumbers(countryInfo.deaths)}
              onClick={(e)=>setCasesType('deaths')}>
          </InfoBox>
        </div>
        <div className="app__map">
          <Map countries={mapCountries} casesType={casesType} center={mapCenter} zoom={mapZoom}></Map>
        </div>
      </div>
      <Card className="app__right">
          <h3>Cases by country</h3>
          <Table countries={tableData}></Table>
              <h3>Worldwide new {casesType}</h3>
          <LineGraph className="app__lineGraph" casesType={casesType}></LineGraph>
      </Card>
    </div>
  );
}

export default App;
