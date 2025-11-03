import PackageTile, { Package } from './PackageTile';
import Paginator from './Paginator';
import './Datagrid.css'

interface DataProps {
  elementCount: number;
  step: number;
  data: Package[];
};

const Datagrid = ({ dataProps, next, onAppend } : {
    dataProps : DataProps|null
    next: () => Promise<Package[]|null>
    onAppend: (pkgs: Package[]) => void 
}) => {
    if(dataProps == null){
        return <></>;
    }

    return (
        <section className='datagrid'>
            <div className="data-container">
                {dataProps.data.map((item, idx) => (
                    <PackageTile key={idx} item={item} />
                ))}
            </div>

            <Paginator
                maxItem={dataProps.elementCount}
                currentPage={0}
                step={dataProps.step}
                nextPage={async () => {
                    const newPage = await next();
                    if(newPage && newPage.length) {
                        onAppend(newPage);
                    }
                }}
            />
        </section>
    );
};

export default Datagrid;
export  {type DataProps};