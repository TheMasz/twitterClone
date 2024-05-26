export const formatDate = (dateString: string | Date) => {
  if (!dateString) return "";
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

  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `Joined ${month} ${year}`;
};

export const removeHashtag = (tag: string): string => {
  const removed = tag.split("#");
  return removed[1];
};
