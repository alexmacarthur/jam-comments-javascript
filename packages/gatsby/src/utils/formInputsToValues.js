export default formElement => {
  return [...formElement.elements].reduce((obj, input) => {
    obj[input.name] = input.value;
    return obj;
  }, {});
};
