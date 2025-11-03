import './PackageTile.css'
import '@fortawesome/fontawesome-free/css/all.min.css'



class Package {
    public name: string|null;
    public description: string|null;
    public url: string|null;
    public repo: string|null;

    constructor(name: string|null, description: string|null, url: string|null, repo: string|null) {
        this.name = name;
        this.description = description;
        this.url = url;
        this.repo = repo;
    }
}


const PackageTile = ({item} : {item: Package}) => {
    
    return <div className="package-tile">
        <div className="label">
            <h3>{item.name}</h3>
        </div>
        <div className="body">
            <p className="description">{item.description}</p>
            <div className="links">
                <a href={item.url ?? "#"}>
                    <i className="fa-solid fa-server"></i> Source
                </a>
                <a href={item.repo ?? "#"}>
                    <i className="fa-brands fa-github"></i> Repository
                </a>
            </div>
        </div>
    </div>
};

export default PackageTile

export {Package}