import days from 'days';

export default function transformBrewery(brewery) {
  let { hours } = brewery;
  let currentDate = new Date();
  let day = days[currentDate.getDay()];
  let currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:00`;
  let openingTimeToday = hours[`${day.toLowerCase()}_open`];
  let closingTimeToday = hours[`${day.toLowerCase()}_close`];

  let isOpeningLater = currentTime < openingTimeToday;

  let isOpen = (
    (currentTime > openingTimeToday) &&
    (currentTime < closingTimeToday || closingTimeToday === '00:00:00')
  );

  return {
    accentColor: brewery.accentColor || '#000',
    address: brewery.address,
    city: brewery.city,
    closingTimeToday,
    color: brewery.color || '#fff',
    hours: brewery.hours,
    isOpen,
    isOpeningLater,
    latitude: parseFloat(brewery.latitude),
    logo: brewery.logo,
    smallLogo: brewery.logo_350,
    longitude: parseFloat(brewery.longitude),
    name: brewery.title,
    openingTimeToday,
    postalCode: brewery.postal_code.split(' ').join('').toUpperCase(),
    statusBarStyle: brewery.statusBarStyle,
    summary: brewery.summary,
    description: brewery.description,
    instagram: brewery.social_instagram,
  };
}
