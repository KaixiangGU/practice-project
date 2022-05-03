import Select from "./select.js";

const selectMenu = document.querySelectorAll("[data-custom]");
//querySelector returns a non-live nodelist, it's not an Array but it's possible to iterate it with forEach().
//NOTE: we basically create a Node list select element.
//It looks like selectMenu[[options]].

selectMenu.forEach((element) => {
  //element represents each option in select
  const selectElement = new Select(element);
  console.log(selectElement);
});
