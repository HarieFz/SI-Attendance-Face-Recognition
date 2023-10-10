export const fileReader = (setter, getter) => {
  const reader = new FileReader();
  reader.onload = () => {
    setter(reader.result);
  };
  if (getter) {
    reader.readAsDataURL(getter);
  }
};
