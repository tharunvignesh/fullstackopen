const CountryFilter = ({ onSearchChange, searchInput }) => {
    return (
        <div>
            <div>find countries&nbsp;<input value={searchInput} onChange={onSearchChange} /></div>
        </div>
    )
}

export default CountryFilter;