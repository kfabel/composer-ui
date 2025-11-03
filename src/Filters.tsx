import { useEffect, useRef } from "react";
import './Filters.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

interface Filter {
    name: string;
    type: 'text' | 'select' | 'checkbox'
    options?: Record<string, any>;
    label?: string;
}

const Filters = ({filters, onFilterChange} : {filters: Filter[], onFilterChange: ((data: FormData) => void )}) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    const formRef = useRef<HTMLFormElement>(null);

    const buildChoices = (choices: Record<string, string>) => {
       return Object.entries(choices).map(([key, value]) => (
            <option key={key} value={key}>
                {value}
            </option>
        ));
    }

    const renderFilters = (filters: Filter[]) => {
        return Object.entries(filters).map(([idx, filter]) => {
            const htmlId : string = `${filter.name}_filter`;
            switch(filter.type) {
                case 'text' : 
                    return (
                        <label htmlFor={htmlId} key={idx}>
                            <span className="real-label">{filter.label || ''}</span>
                            <input  type="text" name={filter.name} id={htmlId}/>
                        </label>
                    )
                case 'select':
                    return (
                        <label htmlFor={htmlId} key={idx}>
                            <span className="real-label">{filter.label || ''}</span>
                            <select  name={filter.name} id={htmlId}>
                                {buildChoices(filter.options?.choices || {})}
                            </select>
                        </label>
                    ) 
                case 'checkbox':
                    return (
                        <label htmlFor={htmlId} key={idx}>
                            <span className="real-label">{filter.label || ''}</span>
                            <input type="checkbox"  name={filter.name} id={htmlId}/> 
                        </label>
                    )
                default:
                    break;
            }
        });
    }

    const toggleModal = () => {
        if(modalRef.current?.hasAttribute('open')){
            modalRef.current?.close();
        } else {
            modalRef.current?.showModal();
        }
    }

    useEffect(() => {
        formRef.current?.addEventListener('submit', function(this: HTMLFormElement, ev: SubmitEvent) {
        ev.preventDefault();
        console.log("form submitted");
        const formData = new FormData(this);
        onFilterChange(formData);
    })}, []);

    return <>
        <button type="button" onClick={toggleModal}><i className="fa-solid fa-filter"></i></button>
        <dialog ref={modalRef}>
            <form ref={formRef} action="#" method="get">
                <div className="filters">
                    {renderFilters(filters)}
                </div>
                <div className="buttons">
                    <button type="submit" onClick={toggleModal}>
                        Apply
                    </button>
                    <button type="reset">
                        Reset
                    </button>
                    <button type="button" onClick={toggleModal}>
                        Close
                    </button>
                </div>
            </form>

        </dialog>
    </>
}

export default Filters;

export {type Filter};