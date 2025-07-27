import countryService from "./services/countries";
import Weather from "./Weather";

const Country = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital.join(', ')}</p>
      <p>Area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.keys(country.languages).map((key) => (
          <li key={key}>{country.languages[key]}</li>
        ))}
      </ul>
      <img src={country.flags.svg} alt={`Flag of ${country.name.common}`} width="150" />
      <Weather country={country} />
    </div>
  );
}
export default Country;