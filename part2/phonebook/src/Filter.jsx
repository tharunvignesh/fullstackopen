const Filter = ({filterInput, handleFilterInputChange}) => {
    return (
        <div>filter shown with<input type="text" value={filterInput} onChange={handleFilterInputChange} /></div>
    )
}

export default Filter;