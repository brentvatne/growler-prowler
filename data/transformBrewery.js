import days from 'days';

export default function transformBrewery(brewery, currentDate = new Date()) {
  let { hours } = brewery;
  let day = days[currentDate.getDay()];
  let currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:00`;
  let openingTimeToday = hours[`${day.toLowerCase()}_open`];
  let closingTimeToday = hours[`${day.toLowerCase()}_close`];

  let isOpeningLater = currentTime < openingTimeToday;

  let isOpen = (
    (currentTime > openingTimeToday) &&
    (currentTime < closingTimeToday || closingTimeToday === '00:00:00')
  ) || (
    (closingTimeToday < openingTimeToday) &&
    (currentTime > openingTimeToday)
  );

  return {
    accentColor: brewery.accentColor || '#000',
    address: brewery.address,
    city: brewery.city,
    closingTimeToday,
    color: brewery.color || '#fff',
    description: brewery.description,
    hours: brewery.hours,
    id: brewery.id,
    instagram: brewery.social_instagram,
    isOpen,
    isOpeningLater,
    latitude: parseFloat(brewery.latitude),
    logo: brewery.logo,
    longitude: parseFloat(brewery.longitude),
    name: brewery.title,
    openingTimeToday,
    postalCode: brewery.postal_code.split(' ').join('').toUpperCase(),
    smallLogo: brewery.logo_350,
    summary: brewery.summary,
  };
}
