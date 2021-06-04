const createAutocomplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputValue,
  fetchData,
}) => {
  root.innerHTML = `
         <label><b>Search</b></label>
         <input class="input" />
         <div class="dropdown">
         <div class="dropdown-menu">
         <div class="dropdown-content results">
         </div>
         </div>
         </div>
`;
  const input = root.querySelector('input');
  const dropdown = root.querySelector('.dropdown');
  const results = root.querySelector('.results');
  const onInput = debounce(async (event) => {
    const items = await fetchData(event.target.value);
    if (!items.length) {
      dropdown.classList.remove('is-active');
      return;
    }
    results.innerHTML = '';
    dropdown.classList.add('is-active');
    for (let item of items) {
      const option = document.createElement('a');
      option.classList.add('dropdown-item');
      option.innerHTML = renderOption(item);
      results.appendChild(option);
      option.addEventListener('click', () => {
        dropdown.classList.remove('is-active');
        input.value = inputValue(item);
        onOptionSelect(item);
      });
    }
  });
  input.addEventListener('input', onInput);
  document.addEventListener('click', (event) => {
    if (!input.contains(event.target)) {
      dropdown.classList.remove('is-active');
    }
  });
};
