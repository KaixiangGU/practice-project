//export entire class
export default class Select {
  constructor(element) {
    //here we construct with original <option> element
    this.element = element;
    this.options = getOptionData(document.querySelectorAll("option"));
    //use option data as parameter, return new option object literal
    this.selectBox = document.createElement("div");
    this.label = document.createElement("span");
    this.optionListWraper = document.createElement("ul");
    setup(this);
    element.style.display = "none";
    element.after(this.selectBox);
    //insert whole custom selectBox container after original select box
  }

  //in order to dynamically update selected label, we need a getter to return value
  get selectedOption() {
    return this.options.find((option) => option.selected);
  }

  get optionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  //1.display selected option 2.toggle selected value
  selectCustomOptionList(optionValue) {
    const newSelectedOption = this.options.find((option) => {
      return option.value === optionValue;
    });

    const prevSelectedOption = this.selectedOption;
    //change options object value
    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;
    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.label.innerText = newSelectedOption.label;
    //querySelect actual previous and new selected element
    const prevSelectedElement = this.optionListWraper.querySelector(`[data-value="${prevSelectedOption.value}"]`);
    const newSelectedElement = this.optionListWraper.querySelector(`[data-value="${newSelectedOption.value}"]`);

    //remove selected class from prevSelected Element and put on new one selected class
    prevSelectedElement.classList.remove("selected");
    newSelectedElement.classList.add("selected");
    //scrollIntoView API keep window scrolls when using keydown event
    newSelectedElement.scrollIntoView({ block: "nearest" });
  }
}

function setup(customSelect) {
  //1.setup custom selectBox container
  customSelect.selectBox.classList.add("custom-select-container");
  customSelect.selectBox.tabIndex = 0;

  //2.setup custom selectbox label(selected option)
  customSelect.label.classList.add("custom-label");
  customSelect.selectBox.append(customSelect.label);
  //display selected option
  customSelect.label.innerText = customSelect.selectedOption.label;

  //3.setup option list <ul>-<li>-<ul>
  customSelect.optionListWraper.classList.add("custom-option-list-wrapper");
  customSelect.selectBox.append(customSelect.optionListWraper);
  customSelect.options.forEach((option) => {
    const optionListElement = document.createElement("li");
    optionListElement.classList.add("custom-option-list-element");
    //add "selected" class only option is selected
    optionListElement.classList.toggle("selected", option.selected);
    optionListElement.dataset.value = option.value;
    optionListElement.innerText = option.label;
    customSelect.optionListWraper.append(optionListElement);

    //CLICK EVENT of select custom option
    optionListElement.addEventListener("click", () => {
      customSelect.selectCustomOptionList(option.value);
      customSelect.optionListWraper.classList.remove("show");
    });
  });

  //click on label to show or hide option list
  customSelect.label.addEventListener("click", () => {
    customSelect.optionListWraper.classList.toggle("show");
  });

  //hide option list when lose focus by using blur event
  customSelect.selectBox.addEventListener("blur", () => {
    customSelect.optionListWraper.classList.remove("show");
  });

  customSelect.selectBox.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "Space":
        customSelect.optionListWraper.classList.toggle("show");
        break;

      case "ArrowUp":
        const prevOption = customSelect.options[customSelect.optionIndex - 1];
        if (prevOption) {
          customSelect.selectCustomOptionList(prevOption.value);
        }
        break;

      case "ArrowDown":
        const nextOption = customSelect.options[customSelect.optionIndex + 1];

        if (nextOption) {
          customSelect.selectCustomOptionList(nextOption.value);
        }
        break;

      case "Enter":
      case "Escape":
        customSelect.optionListWraper.classList.toggle("show");
        break;
      default:
        break;
    }
  });
}

//gather each option's data and restore them in an object literal
function getOptionData(options) {
  return [...options].map((option) => {
    return {
      value: option.value,
      label: option.label,
      selected: option.selected,
      element: option,
    };
  });
}
