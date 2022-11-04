const DataSelector = (root: HTMLElement, attribute: string) => {
    let select = (value: string, el?: HTMLElement) => {
        return (el || root).querySelector(
            `[data-${attribute}="${value}"]`
        ) as HTMLElement;
    };

    let selectAll = (value: string, el?: HTMLElement) => {
        return (el || root).querySelectorAll(
            `[data-${attribute}="${value}"]`
        ) as NodeListOf<HTMLElement>;
    };

    return {
        select,
        selectAll,
    };
};

export default DataSelector;
