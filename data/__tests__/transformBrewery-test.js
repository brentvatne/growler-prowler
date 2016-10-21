import transformBrewery from '../transformBrewery';

describe('hours', () => {
  it('correctly calculates when open', () => {
    const openDateTime = new Date("Fri Oct 21 2016 15:55:00 GMT-0700 (PDT)");
    const brewery = transformBrewery(exampleBrewery, openDateTime);
    expect(brewery.isOpen).toBe(true);
  });

  it('correctly calculates when closed', () => {
    const closedDateTime = new Date("Fri Oct 21 2016 23:55:00 GMT-0700 (PDT)");
    const brewery = transformBrewery(exampleBrewery, closedDateTime);
    expect(brewery.isOpen).toBe(false);
  });
});

const exampleBrewery = {
  "id": 3,
  "type":"brewery",
  "title":"33 Acres",
  "address":"15 W 8th Ave",
  "city":"Vancouver",
  "province":"BC",
  "postal_code":"V5Y 1M8",
  "country":"Canada",
  "latitude":"49.26379240",
  "longitude":"-123.10535280",
  "summary": "Small place so it can be tough to find a seat on a busy night, but definitely worth at least one visit. Some of the best beer in town.",
  "description":"Our vision was born out of enjoyment for the binding elements of life. The spirit of community sharing; Drink, food, conversation, space, and ideas. We carry a strong appreciation for the boundless limits created by hard work. We’re influenced by the natural elements of our surroundings, fueled by creative thinking, and driven to make the highest quality product. Our space is located in Vancouver near a synthesis of forest and the Pacific. Itʼs here weʼve carved out a space to foster collectivity and fine craft beer. We hold that quality product exists in solidarity with working among friends, family, and community. This is an inclusive space; we value innovation in both our craft and design. Our common area was created to align these fundamentals with the simple aesthetics of our surrounding environment.",
  "phone":16046204589,
  "email":"hello@33acresbrewing.com",
  "website":"http://33acresbrewing.com",
  "social_instagram":"33acresbrewing",
  "social_facebook":"33AcresBrewing",
  "social_twitter":"33acres",
  "social_untappd":"71017",
  "logo":"http://storage.growlerfill.ca/1/33acres.png",
  "banner":"http://storage.growlerfill.ca/147/1.jpg",
  "cost_average_64":"10.00",
  "cost_average_32":"7.00",
  "instagram_location_id":null,
  "contact_email":"dustin@33acresbrewing.com",
  "contact_lastname":"Sepkowski",
  "contact_firstname":"Dustin",
  "created_at":"-0001-11-30 00:00:00",
  "updated_at":"-0001-11-30 00:00:00",
  "logo_full":"http://storage.growlerfill.ca/1/33acres.png",
  "logo_150":"http://storage.growlerfill.ca/1/conversions/thumb.png",
  "logo_350":"http://storage.growlerfill.ca/1/conversions/medium.png",
  "banner_thumb":"http://storage.growlerfill.ca/147/conversions/thumb.png",
  "banner_medium":"http://storage.growlerfill.ca/147/conversions/medium.png",
  "hours":{
    "timezone":"America/Vancouver",
    "brewery_id":1,
    "monday_open":"11:00:00",
    "monday_close":"23:00:00",
    "tuesday_open":"11:00:00",
    "tuesday_close":"23:00:00",
    "wednesday_open":"11:00:00",
    "wednesday_close":"23:00:00",
    "thursday_open":"11:00:00",
    "thursday_close":"23:00:00",
    "friday_open":"11:00:00",
    "friday_close":"23:00:00",
    "saturday_open":"11:00:00",
    "saturday_close":"23:00:00",
    "sunday_open":"11:00:00",
    "sunday_close":"23:00:00",
    "created_at":"-0001-11-30 00:00:00",
    "updated_at":"-0001-11-30 00:00:00",
    "status":"open"
  },
  "beers":[

  ],
  "rating":"?"
}
