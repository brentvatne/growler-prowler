import days from 'days';

type BreweryHours = {
  monday_open: string,
  monday_close: string,
  tuesday_open: string,
  tuesday_close: string,
  wednesday_open: string,
  wednesday_close: string,
  thursday_open: string,
  thursday_close: string,
  friday_open: string,
  friday_close: string,
  saturday_open: string,
  saturday_close: string,
  sunday_open: string,
  sunday_close: string,
}

type BreweryData = {
  accentColor?: string,
  address: string,
  city: string,
  color?: string,
  description: string,
  hours: BreweryHours,
  id: number,
  latitude: string,
  logo: string,
  logo_small: string,
  longitude: string,
  postal_code: string,
  social_instagram: string,
  summary?: ?string,
  title: string,
}

export default function transformBrewery(brewery: BreweryData, currentDate = new Date()): any {
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
    smallLogo: brewery.logo_small,
    summary: brewery.summary,
  };
}
