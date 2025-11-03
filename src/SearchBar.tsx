import 'fontawesome-free/css/all.css'
import './SearchBar.css'
import { useRef } from 'react';


function Search(
    {
        name, id, 
        placeholder, label,
        onSearch,
        onChange
    } : {
        name: string, id: string, 
        placeholder: string, label: string,
        onSearch : (ref: React.RefObject<HTMLInputElement | null>) => void,
        onChange: (val: string|null) => void
    }
){

    const searchRef = useRef<HTMLInputElement>(null);
    const changeHandler = () => {
        const val = searchRef?.current?.value || null;
        console.log("change: ", val);
        onChange(val);
    }

    return (
        <div className='search-bar'>
            <label htmlFor={id}>
                <span className="real-label">{placeholder}</span>
                <input ref={searchRef} onChange={changeHandler} placeholder='' type="search" name={name} id={id}/>
            </label>
            <button type="submit" onClick={() => {
                onSearch(searchRef);
            }}><i className="fas fa-search"></i> {label}</button>
        </div>
    );
};


export default Search;