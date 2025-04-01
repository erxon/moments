export default function captilizeFirstLetter(value: string) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}
