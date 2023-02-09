export default function allOptionsSelected(options) {
  return options
    .filter((option) => !option.disabled)
    .every((option) => {
      return option.selected;
    });
}
