import Country from "./Country";

const CountriesList = ({ countries, onSearchChange, searchInput }) => {
    if (countries.length === 1 && countries[0]) {
        return <Country country={countries[0]} />;
    } else if (countries.length > 10 && searchInput) {
        return <div>Too many matches, specify another filter</div>;
    } else if(countries.length < 10 && countries.length > 1) {
        return (
            <div>
                {(
                    countries.map(country => (
                        <div key={country.cca3}>
                            {country.name.common}&nbsp;<button onClick={() => onSearchChange({ target: { value: country.name.common } })}>show</button>
                        </div>
                    ))
                )}
            </div>
        );
    }
}
export default CountriesList;