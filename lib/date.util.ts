export function localeDateStringFormatter(dateString: string) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [month, day, year] = dateString.split("/");

  const newDateString = `${months[Number(month) - 1]} ${day}, ${year}`;

  return newDateString;
}
