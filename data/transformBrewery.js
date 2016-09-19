import days from 'days';

export default function transformBrewery(brewery) {
  let { hours } = brewery;
  let currentDate = new Date();
  let day = days[currentDate.getDay()];
  let currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:00`;
  let openingTimeToday = hours[`${day.toLowerCase()}_open`];
  let closingTimeToday = hours[`${day.toLowerCase()}_close`];

  let isOpen = (
    (currentTime > openingTimeToday) &&
    (currentTime < closingTimeToday || closingTimeToday === '00:00:00')
  );

  return {
    logo: brewery.logo,
    address: brewery.address,
    closingTimeToday,
    openingTimeToday,
    isOpen,
    hours: brewery.hours,
    name: brewery.title,
    latitude: parseFloat(brewery.latitude),
    longitude: parseFloat(brewery.longitude),
  };
}
