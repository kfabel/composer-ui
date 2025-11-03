import { useState } from 'react'
import './App.css'
import Search from  './SearchBar'
import Datagrid, {type DataProps } from './Datagrid';
import Filters from './Filters';
import { Package } from './PackageTile';

const baseUri = 'https://packagist.org/';

function App() {
  var searchByFilter = 'package_name';
  const [currentSearch, setCurrentSearch] = useState<string|null>(null); 
  const [appliedFilters, applyFilters] = useState<Record<string, string|null>>({});
  const [data, setData] = useState<DataProps|null>(null);
  const [next, setNext] = useState<string|null>(null);

  const search = async (params: Record<string, string>) => {
    
    const page = (searchByFilter == 'vendor') ? 'packages/list.json' : 'search.json';
    const uri = new URL(page, baseUri);

    uri.search = (new URLSearchParams(params)).toString();

    return fetch(uri);
  }

  const reloadFilters = (FormData: FormData) => {
    const filterData : Record<string, string|null> = {};
    for(const [fname, fdata] of FormData.entries()) {
      if(fdata != null) {
        filterData[fname] = fdata.toString();
      }
    }
    applyFilters(filterData);

    console.log('search : ', currentSearch);
    if(currentSearch)
      buildAndSearch(currentSearch);
  }

  const buildParams = (input: string) => {

    const filterToQuery : Record<string, string> = {
      package_name: "q",
      type: "type",
      tag: "tag",
    }

    let params: Record<string, string> = {};
    params[filterToQuery[searchByFilter]] = input;

    for(const [k, v] of Object.entries(appliedFilters)){
      if(v != null && v != '') {
        params[filterToQuery[k]] = v
      }
    }

    return params;
  }

  const buildAndSearch = async (input: string) => {
    const resp = await search(buildParams(input))
    const payload = await resp.json();
    console.log(payload);

    const items = payload.results.map((item : Record<string, string|null>) => {
      return new Package(
        item.name || null, 
        item.description || null, 
        item.url || null, 
        item.repository || null
      )
    });

    setData({
      elementCount: parseInt(payload.total) || 0,
      step: items.length || 0,
      data: items || [],
    })

    if(payload?.next || false){
      setNext(payload.next);
    }
  }

  const buildAndSearchFromInput = (input: React.RefObject<HTMLInputElement|null>) => {
    const value : string = input?.current?.value || '';
    buildAndSearch(value);
  }

  const placeholder = `${searchByFilter.replace('_', ' ')}`;

  const readNext = async () : Promise<Package[]|null> => {
    if(next && data != null){
      const resp = await fetch(next);
      const payload = await resp.json();
      return payload.results.map((item : Record<string, string|null>) => {
        return new Package(
          item.name || null, 
          item.description || null, 
          item.url || null, 
          item.repository || null
        )
      });
    } else {
      return null
    }
  }

  const appendPackages = (newPackages: Package[]) => {
    setData(prev => {
      if(!prev) return prev;
      return {
        ...prev,
        data: [...prev.data, ...newPackages],
      };
    });
  }

  return (
    <>
      <h1>Composer package viewer</h1>
      <div className="card row justify-sb">
        <Search name="search"
          id="search"
          placeholder={placeholder}
          label="search" 
          onSearch={buildAndSearchFromInput}
          onChange={setCurrentSearch}
        ></Search>
        <Filters filters={[
          {
            type: 'text',
            label: 'Package Type',
            name: 'type',
          },
          {
            type: 'text',
            label: 'Package Tag',
            name: 'tag',
          },
        ]} onFilterChange={reloadFilters}></Filters>
      </div>
      <Datagrid dataProps={data} next={readNext} onAppend={appendPackages}></Datagrid>
    </>
  )
}

export default App
