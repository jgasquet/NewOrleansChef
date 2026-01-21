// New Orleans Restaurant Database
// Organized by cuisine type with signature dishes for recommendation matching

export const restaurants = [
  // CREOLE RESTAURANTS
  {
    id: 'commanders-palace',
    name: "Commander's Palace",
    cuisine: 'Creole',
    neighborhood: 'Garden District',
    address: '1403 Washington Ave, New Orleans, LA 70130',
    coordinates: { lat: 29.9273, lng: -90.0875 },
    priceRange: '$$$$',
    rating: 4.9,
    signatureDishes: [
      'Turtle Soup',
      'Shrimp and Tasso Henican',
      'Pecan-Crusted Gulf Fish',
      'Bread Pudding Soufflé',
      'Creole Gumbo'
    ],
    dishCategories: ['seafood', 'creole', 'fine-dining', 'soup', 'dessert'],
    description: 'Legendary Garden District institution. Jazz brunch, turtle soup, and impeccable service since 1893.',
    phone: '(504) 899-8221',
    website: 'https://www.commanderspalace.com',
    hours: {
      lunch: 'Mon-Fri 11:30am-2pm',
      brunch: 'Sat-Sun 10am-2pm',
      dinner: 'Daily 6pm-10pm'
    },
    amenities: ['reservations-required', 'valet-parking', 'full-bar', 'outdoor-seating', 'dress-code'],
    images: {
      hero: '/images/restaurants/commanders-palace.jpg',
      gallery: ['/images/restaurants/commanders-1.jpg', '/images/restaurants/commanders-2.jpg']
    }
  },
  {
    id: 'dooky-chase',
    name: "Dooky Chase's Restaurant",
    cuisine: 'Creole',
    neighborhood: 'Tremé',
    address: '2301 Orleans Ave, New Orleans, LA 70119',
    coordinates: { lat: 29.9690, lng: -90.0799 },
    priceRange: '$$$',
    rating: 4.8,
    signatureDishes: [
      'Fried Chicken',
      'Gumbo Z\'herbes',
      'Stuffed Shrimp',
      'Red Beans and Rice',
      'Shrimp Clemenceau'
    ],
    dishCategories: ['creole', 'soul-food', 'fried-chicken', 'gumbo', 'seafood'],
    description: 'Civil rights landmark serving iconic fried chicken and gumbo z\'herbes.',
    phone: '(504) 821-0600',
    website: 'https://www.dookychaserestaurant.com',
    hours: {
      lunch: 'Tue-Fri 11am-3pm',
      buffet: 'Thu 11am-3pm'
    },
    amenities: ['reservations-recommended', 'street-parking', 'full-bar', 'historic-venue'],
    images: {
      hero: '/images/restaurants/dooky-chase.jpg',
      gallery: []
    }
  },
  {
    id: 'galatoires',
    name: "Galatoire's",
    cuisine: 'Creole French',
    neighborhood: 'French Quarter',
    address: '209 Bourbon St, New Orleans, LA 70130',
    coordinates: { lat: 29.9555, lng: -90.0695 },
    priceRange: '$$$$',
    rating: 4.8,
    signatureDishes: [
      'Shrimp Remoulade',
      'Crabmeat Maison',
      'Trout Meunière',
      'Oysters en Brochette',
      'Soufflé Potatoes'
    ],
    dishCategories: ['creole', 'french', 'seafood', 'fine-dining', 'classic'],
    description: 'French Quarter classic since 1905. Friday lunch is a New Orleans tradition. Jacket required.',
    phone: '(504) 525-2021',
    website: 'https://www.galatoires.com',
    hours: {
      lunch: 'Tue-Sat 11:30am-3pm',
      dinner: 'Tue-Sat 5:30pm-10pm'
    },
    amenities: ['reservations-recommended', 'dress-code', 'full-bar', 'historic-venue', 'valet-parking'],
    images: {
      hero: '/images/restaurants/galatoires.jpg',
      gallery: []
    }
  },

  // CAJUN RESTAURANTS
  {
    id: 'cochon',
    name: 'Cochon',
    cuisine: 'Contemporary Cajun',
    neighborhood: 'Warehouse District',
    address: '930 Tchoupitoulas St, New Orleans, LA 70130',
    coordinates: { lat: 29.9409, lng: -90.0716 },
    priceRange: '$$$',
    rating: 4.7,
    signatureDishes: [
      'Boudin',
      'Cochon de Lait',
      'Wood-Fired Oysters',
      'Rabbit & Dumplings',
      'Louisiana Cochon'
    ],
    dishCategories: ['cajun', 'pork', 'seafood', 'wood-fired', 'rustic'],
    description: 'Donald Link\'s love letter to Cajun country. Boudin, cochon de lait, and wood-fired everything.',
    phone: '(504) 588-2123',
    website: 'https://www.cochonrestaurant.com',
    hours: {
      lunch: 'Mon-Fri 11am-2pm',
      dinner: 'Mon-Sat 5:30pm-10pm'
    },
    amenities: ['reservations-recommended', 'full-bar', 'outdoor-seating', 'groups-welcome'],
    images: {
      hero: '/images/restaurants/cochon.jpg',
      gallery: []
    }
  },
  {
    id: 'toups-meatery',
    name: "Toups' Meatery",
    cuisine: 'Cajun',
    neighborhood: 'Mid-City',
    address: '845 N Carrollton Ave, New Orleans, LA 70119',
    coordinates: { lat: 29.9772, lng: -90.0945 },
    priceRange: '$$$',
    rating: 4.7,
    signatureDishes: [
      'Cracklins',
      'Double-Cut Pork Chop',
      'Meatball Gumbo',
      'Smoked Pork Debris',
      'Charcuterie Board'
    ],
    dishCategories: ['cajun', 'meat', 'gumbo', 'charcuterie', 'bold-flavors'],
    description: 'Chef Isaac Toups\' bold Cajun cooking. Cracklins, double-cut pork chops, and meatball gumbo.',
    phone: '(504) 252-4999',
    website: 'https://toupsmeatery.com',
    hours: {
      dinner: 'Mon-Sat 5:30pm-10pm',
      brunch: 'Sat-Sun 10am-3pm'
    },
    amenities: ['reservations-recommended', 'full-bar', 'groups-welcome', 'casual'],
    images: {
      hero: '/images/restaurants/toups.jpg',
      gallery: []
    }
  },

  // SOUL FOOD RESTAURANTS
  {
    id: 'willie-maes',
    name: "Willie Mae's Scotch House",
    cuisine: 'Soul Food',
    neighborhood: 'Tremé',
    address: '2401 St Ann St, New Orleans, LA 70119',
    coordinates: { lat: 29.9695, lng: -90.0805 },
    priceRange: '$$',
    rating: 4.9,
    signatureDishes: [
      'Fried Chicken',
      'Butter Beans',
      'Fried Okra',
      'Sweet Potato Pie',
      'Mac and Cheese'
    ],
    dishCategories: ['soul-food', 'fried-chicken', 'comfort-food', 'southern', 'classic'],
    description: 'James Beard America\'s Classic. Possibly the best fried chicken on the planet. Worth any wait.',
    phone: '(504) 822-9503',
    website: 'https://williemaesscotchhouse.com',
    hours: {
      lunch: 'Mon-Sat 10am-5pm'
    },
    amenities: ['cash-only', 'casual', 'historic-venue', 'no-reservations'],
    images: {
      hero: '/images/restaurants/willie-maes.jpg',
      gallery: []
    }
  },

  // SEAFOOD RESTAURANTS
  {
    id: 'casamentos',
    name: "Casamento's",
    cuisine: 'Oyster Bar',
    neighborhood: 'Uptown',
    address: '4330 Magazine St, New Orleans, LA 70115',
    coordinates: { lat: 29.9210, lng: -90.0980 },
    priceRange: '$$',
    rating: 4.7,
    signatureDishes: [
      'Raw Oysters',
      'Fried Oysters',
      'Oyster Loaf',
      'Oyster Stew',
      'Shrimp Platter'
    ],
    dishCategories: ['seafood', 'oysters', 'fried-seafood', 'casual', 'classic'],
    description: 'Tile-walled oyster house since 1919. Raw oysters, oyster loaf, and fresh shucked perfection.',
    phone: '(504) 895-9761',
    website: null,
    hours: {
      lunch: 'Tue-Sat 11am-2pm',
      dinner: 'Tue-Sat 5:30pm-9pm',
      closed: 'Seasonal (June-August)'
    },
    amenities: ['cash-only', 'casual', 'counter-seating', 'no-reservations'],
    images: {
      hero: '/images/restaurants/casamentos.jpg',
      gallery: []
    }
  },
  {
    id: 'peche',
    name: 'Peche Seafood Grill',
    cuisine: 'Gulf Seafood',
    neighborhood: 'Warehouse District',
    address: '800 Magazine St, New Orleans, LA 70130',
    coordinates: { lat: 29.9409, lng: -90.0716 },
    priceRange: '$$$',
    rating: 4.7,
    signatureDishes: [
      'Whole Grilled Fish',
      'Shrimp Roll',
      'Smoked Tuna Dip',
      'Catfish with Shrimp',
      'Raw Bar Selection'
    ],
    dishCategories: ['seafood', 'grilled', 'raw-bar', 'contemporary', 'james-beard'],
    description: 'James Beard Best New Restaurant winner. Whole grilled fish, raw bar, and Gulf Coast flavors.',
    phone: '(504) 522-1744',
    website: 'https://www.pecherestaurant.com',
    hours: {
      lunch: 'Mon-Fri 11am-2pm',
      dinner: 'Daily 5:30pm-10pm'
    },
    amenities: ['reservations-recommended', 'full-bar', 'groups-welcome', 'counter-seating'],
    images: {
      hero: '/images/restaurants/peche.jpg',
      gallery: []
    }
  },

  // PO-BOYS
  {
    id: 'parkway',
    name: 'Parkway Bakery & Tavern',
    cuisine: 'Po-Boys',
    neighborhood: 'Mid-City',
    address: '538 Hagan Ave, New Orleans, LA 70119',
    coordinates: { lat: 29.9772, lng: -90.0945 },
    priceRange: '$',
    rating: 4.8,
    signatureDishes: [
      'Roast Beef Po-Boy',
      'Fried Shrimp Po-Boy',
      'Oyster Po-Boy',
      'Surf & Turf Po-Boy',
      'Debris Po-Boy'
    ],
    dishCategories: ['po-boys', 'sandwiches', 'casual', 'roast-beef', 'fried-seafood'],
    description: 'Best roast beef debris in the city. Gravy-soaked perfection on Leidenheimer bread since 1911.',
    phone: '(504) 482-3047',
    website: 'https://www.parkwaypoorboys.com',
    hours: {
      lunch: 'Wed-Mon 11am-10pm'
    },
    amenities: ['cash-preferred', 'outdoor-seating', 'casual', 'family-friendly', 'no-reservations'],
    images: {
      hero: '/images/restaurants/parkway.jpg',
      gallery: []
    }
  },
  {
    id: 'domilises',
    name: "Domilise's Po-Boy & Bar",
    cuisine: 'Po-Boys',
    neighborhood: 'Uptown',
    address: '5240 Annunciation St, New Orleans, LA 70115',
    coordinates: { lat: 29.9210, lng: -90.0980 },
    priceRange: '$',
    rating: 4.7,
    signatureDishes: [
      'Shrimp Po-Boy',
      'Oyster Po-Boy',
      'Catfish Po-Boy',
      'Roast Beef Po-Boy',
      'Half & Half Po-Boy'
    ],
    dishCategories: ['po-boys', 'seafood', 'fried', 'casual', 'neighborhood'],
    description: 'Uptown institution. Shrimp and oyster po-boys in a no-frills neighborhood bar setting.',
    phone: '(504) 899-9126',
    website: null,
    hours: {
      lunch: 'Mon-Sat 10am-7pm'
    },
    amenities: ['cash-only', 'casual', 'bar-seating', 'no-reservations', 'neighborhood-gem'],
    images: {
      hero: '/images/restaurants/domilises.jpg',
      gallery: []
    }
  }
];

// Dish-based recommendation engine
export const dishIndex = {
  'gumbo': ['dooky-chase', 'toups-meatery', 'commanders-palace'],
  'fried-chicken': ['willie-maes', 'dooky-chase'],
  'oysters': ['casamentos', 'peche', 'galatoires', 'cochon'],
  'po-boys': ['parkway', 'domilises'],
  'seafood': ['casamentos', 'peche', 'galatoires', 'cochon'],
  'turtle-soup': ['commanders-palace'],
  'creole': ['commanders-palace', 'dooky-chase', 'galatoires'],
  'cajun': ['cochon', 'toups-meatery'],
  'fine-dining': ['commanders-palace', 'galatoires', 'peche'],
  'casual': ['parkway', 'domilises', 'willie-maes', 'casamentos'],
};

// Cuisine categories for filtering
export const cuisineCategories = [
  { id: 'creole', name: 'Creole', icon: '🍲', count: 3 },
  { id: 'cajun', name: 'Cajun', icon: '🦐', count: 2 },
  { id: 'soul-food', name: 'Soul Food', icon: '🍗', count: 2 },
  { id: 'seafood', name: 'Gulf Seafood', icon: '🦪', count: 3 },
  { id: 'po-boys', name: 'Po-Boys', icon: '🥖', count: 2 },
  { id: 'fine-dining', name: 'Fine Dining', icon: '✨', count: 3 },
];

// Neighborhood data
export const neighborhoods = [
  { id: 'french-quarter', name: 'French Quarter', coordinates: { lat: 29.9584, lng: -90.0644 } },
  { id: 'garden-district', name: 'Garden District', coordinates: { lat: 29.9273, lng: -90.0875 } },
  { id: 'warehouse', name: 'Warehouse District', coordinates: { lat: 29.9409, lng: -90.0716 } },
  { id: 'cbd', name: 'CBD', coordinates: { lat: 29.9465, lng: -90.0770 } },
  { id: 'uptown', name: 'Uptown', coordinates: { lat: 29.9327, lng: -90.1158 } },
  { id: 'mid-city', name: 'Mid-City', coordinates: { lat: 29.9772, lng: -90.0945 } },
  { id: 'treme', name: 'Tremé', coordinates: { lat: 29.9690, lng: -90.0799 } },
];

export default restaurants;
