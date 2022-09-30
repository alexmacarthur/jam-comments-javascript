const DataSelector = (root: HTMLElement, attribute: string) => {
  let select = (value: string, el?: HTMLElement) => {
    return (el || root).querySelector(`[data-${attribute}="${value}"]`);
  }

  let selectAll = (value: string, el?: HTMLElement) => {
    return (el || root).querySelectorAll(`[data-${attribute}="${value}"]`); 
  }

  return {
    select, selectAll
  }
}

export default DataSelector;
