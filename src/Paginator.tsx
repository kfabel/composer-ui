import { useState } from "react";

const Paginator = ({
    maxItem,
    currentPage,
    nextPage,
    step
} : {
    maxItem: number,
    currentPage: number,
    nextPage : () => void
    step : number
}) => {
    const [current, setCurrent] = useState<number>(currentPage);
    let maxCurrent = maxItem - current * step

    const update = (forward: boolean) => {
        const next = current + (forward ? 1 : -1);
        setCurrent(next);
        maxCurrent -= current * step;
        nextPage();
    };
    return <>
        <button type="button" onClick={() => update(true)}>Load {step} More  of {maxCurrent}</button>
    </>
};

export default Paginator