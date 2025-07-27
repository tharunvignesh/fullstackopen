import { useState, useEffect } from 'react'
import countriesService from './services/countries.js'
import CountriesList from './CountriesList.jsx';
import CountryFilter from './CountryFilter.jsx';
function App() {
  const [allCountries, setAllCountries] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredCountries, setFilteredCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        countriesService.getAll().then(data => {
          setAllCountries(data);
        })
      } catch (error) {
        console.error('Error fetching countries:', error)
      }
    }
    fetchCountries()
  }, [])


  const onSearchChange = (event) => {
    const searchInput = event.target.value.toLowerCase();
    setSearchInput(searchInput);
    const filteredCountries = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(searchInput)
    );
    setFilteredCountries(filteredCountries);

  }
  return (
    <>
      <CountryFilter searchInput={searchInput} onSearchChange={onSearchChange} />
      <CountriesList countries={filteredCountries} searchInput={searchInput} onSearchChange={onSearchChange} />
    </>
  )
}

export default App
