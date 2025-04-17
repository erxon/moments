export function captilizeFirstLetter(value: string) {
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export function avatarFallbackString(first_name: string, last_name: string) {
  return first_name.charAt(0).concat(last_name.charAt(0)).toUpperCase();
}
