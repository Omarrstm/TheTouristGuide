export const OWNER_EMAIL = "omarrestom11@gmail.com";

export type SeedPlace = {
  country: string;
  name: string;
  city: string;
  description: string;
  latitude: number;
  longitude: number;
  photoUrl: string;
};

export const PLACES: SeedPlace[] = [
  // France
  {
    country: "France",
    name: "Eiffel Tower",
    city: "Paris",
    description:
      "The wrought-iron tower that's become the symbol of Paris, with sweeping views of the city from its upper deck.",
    latitude: 48.8584,
    longitude: 2.2945,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg",
  },
  {
    country: "France",
    name: "Louvre Museum",
    city: "Paris",
    description:
      "The world's largest art museum, home to the Mona Lisa and tens of thousands of other works across a former royal palace.",
    latitude: 48.8606,
    longitude: 2.3376,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/28/Cour_Napol%C3%A9on_at_night_-_Louvre.jpg",
  },
  // Italy
  {
    country: "Italy",
    name: "Colosseum",
    city: "Rome",
    description:
      "The largest ancient amphitheater ever built, once host to gladiator contests and public spectacles nearly 2,000 years ago.",
    latitude: 41.8902,
    longitude: 12.4922,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg",
  },
  {
    country: "Italy",
    name: "Leaning Tower of Pisa",
    city: "Pisa",
    description:
      "A freestanding bell tower famous for its unintended tilt, caused by unstable ground during construction.",
    latitude: 43.723,
    longitude: 10.3966,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/The_Duomo_and_Tower_of_Pisa_at_sunrise.jpg",
  },
  // Japan
  {
    country: "Japan",
    name: "Fushimi Inari Taisha",
    city: "Kyoto",
    description:
      "A shrine famous for its thousands of vermillion torii gates winding up the forested slopes of Mount Inari.",
    latitude: 34.9671,
    longitude: 135.7727,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Torii_path_with_lantern_at_Fushimi_Inari_Taisha_Shrine%2C_Kyoto%2C_Japan.jpg",
  },
  {
    country: "Japan",
    name: "Tokyo Tower",
    city: "Tokyo",
    description:
      "A red-and-white communications tower inspired by the Eiffel Tower, offering observation decks over the city.",
    latitude: 35.6586,
    longitude: 139.7454,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Tokyo_Tower%2C_Minato_City.jpg",
  },
  // United States
  {
    country: "United States",
    name: "Statue of Liberty",
    city: "New York City",
    description:
      "A colossal copper statue on Liberty Island, gifted by France and a lasting symbol of freedom and immigration.",
    latitude: 40.6892,
    longitude: -74.0445,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Statue_of_Liberty_frontal_2.jpg",
  },
  {
    country: "United States",
    name: "Golden Gate Bridge",
    city: "San Francisco",
    description:
      "The iconic art deco suspension bridge spanning the entrance to San Francisco Bay.",
    latitude: 37.8199,
    longitude: -122.4783,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Golden_Gate_Bridge_at_sunset_1.jpg",
  },
  // Egypt
  {
    country: "Egypt",
    name: "Great Pyramid of Giza",
    city: "Giza",
    description:
      "The oldest and largest of the Giza pyramids, and the only surviving Wonder of the Ancient World.",
    latitude: 29.9792,
    longitude: 31.1342,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Giza_Great_Pyramid_of_Khufu_%289793898043%29.jpg",
  },
  {
    country: "Egypt",
    name: "Karnak Temple",
    city: "Luxor",
    description:
      "A vast temple complex built over centuries by successive pharaohs, dedicated primarily to the god Amun.",
    latitude: 25.7188,
    longitude: 32.6573,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/43/Templo_de_Karnak%2C_Luxor%2C_Egipto%2C_2022-04-03%2C_DD_144.jpg",
  },
  // United Kingdom
  {
    country: "United Kingdom",
    name: "Big Ben",
    city: "London",
    description:
      "The nickname for the Great Bell inside the clock tower at the north end of the Palace of Westminster.",
    latitude: 51.5007,
    longitude: -0.1246,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/97/Big_Ben_at_sunset_-_2014-10-27_17-30.jpg",
  },
  {
    country: "United Kingdom",
    name: "Stonehenge",
    city: "Amesbury",
    description:
      "A prehistoric monument of massive standing stones arranged in a circle, still not fully understood by archaeologists.",
    latitude: 51.1789,
    longitude: -1.8262,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Stonehenge2007_07_30.jpg",
  },
  // India
  {
    country: "India",
    name: "Taj Mahal",
    city: "Agra",
    description:
      "An ivory-white marble mausoleum built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    latitude: 27.1751,
    longitude: 78.0421,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/74/Taj_Mahal%2C_Agra%2C_India_edit2.jpg",
  },
  {
    country: "India",
    name: "Amber Fort",
    city: "Jaipur",
    description:
      "A hilltop fort of sandstone and marble, known for its elaborate mirrored halls and courtyards.",
    latitude: 26.9855,
    longitude: 75.8513,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Jaipur_03-2016_02_Amber_Fort.jpg",
  },
  // Peru
  {
    country: "Peru",
    name: "Machu Picchu",
    city: "Cusco Region",
    description:
      "A 15th-century Inca citadel set high in the Andes, rediscovered by the outside world in 1911.",
    latitude: -13.1631,
    longitude: -72.545,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/Machu_Picchu%2C_Per%C3%BA%2C_2015-07-30%2C_DD_47.JPG",
  },
  {
    country: "Peru",
    name: "Sacsayhuamán",
    city: "Cusco",
    description:
      "A walled Inca complex on the edge of Cusco, built from massive, precisely fitted stone blocks.",
    latitude: -13.5074,
    longitude: -71.9822,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/d/d1/Sacsayhuam%C3%A1n%2C_Cusco%2C_Per%C3%BA%2C_2015-07-31%2C_DD_05.JPG",
  },
  // Greece
  {
    country: "Greece",
    name: "Acropolis of Athens",
    city: "Athens",
    description:
      "An ancient citadel perched above Athens, crowned by the Parthenon temple dedicated to the goddess Athena.",
    latitude: 37.9715,
    longitude: 23.7267,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c6/Attica_06-13_Athens_50_View_from_Philopappos_-_Acropolis_Hill.jpg",
  },
  {
    country: "Greece",
    name: "Santorini Caldera",
    city: "Santorini",
    description:
      "Whitewashed villages perched on cliffs overlooking the sea-filled caldera left by an ancient volcanic eruption.",
    latitude: 36.3932,
    longitude: 25.4615,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/79/Oia_-_Santorini_-_Greece_-_16.jpg",
  },
  // Turkey
  {
    country: "Turkey",
    name: "Hagia Sophia",
    city: "Istanbul",
    description:
      "A former cathedral and mosque turned museum turned mosque again, famous for its massive dome and centuries of layered history.",
    latitude: 41.0086,
    longitude: 28.9802,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/22/Hagia_Sophia_Mars_2013.jpg",
  },
  {
    country: "Turkey",
    name: "Cappadocia",
    city: "Nevşehir",
    description:
      "A surreal landscape of cave dwellings and rock formations, best known today for its sunrise hot air balloon rides.",
    latitude: 38.6431,
    longitude: 34.8286,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f3/Cappadocia_March_2006.jpg",
  },
  // Spain
  {
    country: "Spain",
    name: "Sagrada Familia",
    city: "Barcelona",
    description:
      "Antoni Gaudí's still-unfinished basilica, a landmark of flowing, organic architecture over a century in the making.",
    latitude: 41.4036,
    longitude: 2.1744,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Sagrada_Familia_03.jpg",
  },
  {
    country: "Spain",
    name: "Alhambra",
    city: "Granada",
    description:
      "A hilltop Moorish palace and fortress complex, celebrated for its intricate Islamic architecture and gardens.",
    latitude: 37.1761,
    longitude: -3.5881,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Pavillon_Cour_des_Lions_Alhambra_Granada_Spain.jpg",
  },
  // Brazil
  {
    country: "Brazil",
    name: "Christ the Redeemer",
    city: "Rio de Janeiro",
    description:
      "A giant Art Deco statue of Jesus atop Corcovado mountain, overlooking the whole of Rio de Janeiro.",
    latitude: -22.9519,
    longitude: -43.2105,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg",
  },
  {
    country: "Brazil",
    name: "Iguazu Falls",
    city: "Foz do Iguaçu",
    description:
      "A sprawling system of hundreds of waterfalls straddling the border of Brazil and Argentina.",
    latitude: -25.6953,
    longitude: -54.4367,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/62/Iguazu_Falls_%28Foz_do_Igua%C3%A7u%2C_Brazil%29.jpg",
  },
  // Australia
  {
    country: "Australia",
    name: "Sydney Opera House",
    city: "Sydney",
    description:
      "The sail-shaped performing arts venue on Sydney Harbour, one of the most recognizable buildings of the 20th century.",
    latitude: -33.8568,
    longitude: 151.2153,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Sydney_Opera_House_-_Dec_2008.jpg",
  },
  {
    country: "Australia",
    name: "Great Barrier Reef",
    city: "Queensland",
    description:
      "The world's largest coral reef system, visible even from space and home to an extraordinary range of marine life.",
    latitude: -18.2871,
    longitude: 147.6992,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/12/Aerial_View_of_Great_Barrier_Reef_%28Ank_Kumar%29_02.jpg",
  },
  // China
  {
    country: "China",
    name: "Great Wall of China (Badaling)",
    city: "Beijing",
    description:
      "The best-preserved and most-visited section of the ancient fortification that stretches thousands of kilometers across northern China.",
    latitude: 40.3584,
    longitude: 116.023,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Badaling_China_Great-Wall-of-China-02.jpg",
  },
  {
    country: "China",
    name: "Forbidden City",
    city: "Beijing",
    description:
      "The former Chinese imperial palace, a vast complex of nearly a thousand buildings at the heart of Beijing.",
    latitude: 39.9163,
    longitude: 116.3972,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/00/Sunset_of_the_Forbidden_City_2006.JPG",
  },
  // United Arab Emirates
  {
    country: "United Arab Emirates",
    name: "Burj Khalifa",
    city: "Dubai",
    description:
      "The tallest building in the world, with an observation deck offering panoramic views over the desert and coastline.",
    latitude: 25.1972,
    longitude: 55.2744,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Burj_dubai_3.11.08.jpg",
  },
  {
    country: "United Arab Emirates",
    name: "Palm Jumeirah",
    city: "Dubai",
    description:
      "An artificial archipelago shaped like a palm tree, lined with resorts and beaches off the Dubai coast.",
    latitude: 25.1124,
    longitude: 55.139,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/71/ISS-47_Palm_Jumeirah%2C_Dubai.jpg",
  },
  // Jordan
  {
    country: "Jordan",
    name: "Petra",
    city: "Ma'an",
    description:
      "An ancient city carved directly into rose-colored rock faces, once the capital of the Nabataean kingdom.",
    latitude: 30.3285,
    longitude: 35.4444,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/87/Petra_Jordan_BW_0.jpg",
  },
  // Cambodia
  {
    country: "Cambodia",
    name: "Angkor Wat",
    city: "Siem Reap",
    description:
      "The largest religious monument in the world, originally built as a Hindu temple before becoming Buddhist.",
    latitude: 13.4125,
    longitude: 103.867,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/eb/2014-Cambodge_Angkor_Wat_%2821%29.jpg",
  },
  // Mexico
  {
    country: "Mexico",
    name: "Chichen Itza",
    city: "Yucatán",
    description:
      "A major Maya city whose stepped pyramid, El Castillo, aligns precisely with the sun on the equinoxes.",
    latitude: 20.6843,
    longitude: -88.5678,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/f/f4/Chichen_Itza_1.jpg",
  },
  {
    country: "Mexico",
    name: "Teotihuacan",
    city: "Mexico State",
    description:
      "The ruins of one of the largest cities in the pre-Columbian Americas, anchored by the Pyramid of the Sun.",
    latitude: 19.6925,
    longitude: -98.8438,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/64/Pyramid_of_the_Sun%2C_Teotihuacan%2C_from_path_to_parking_lot.jpg",
  },
  // Morocco
  {
    country: "Morocco",
    name: "Jemaa el-Fnaa",
    city: "Marrakech",
    description:
      "The bustling main square of Marrakech's medina, filled with food stalls, storytellers, and musicians by night.",
    latitude: 31.6258,
    longitude: -7.9891,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Jemaa_el-Fnaa_Marrakech_at_sunset.jpg",
  },
  {
    country: "Morocco",
    name: "Hassan II Mosque",
    city: "Casablanca",
    description:
      "One of the largest mosques in the world, built partly over the Atlantic Ocean with a minaret over 200 meters tall.",
    latitude: 33.6084,
    longitude: -7.6325,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Sunshine_on_mosque_Hassan_II_in_Casablanca%2C_Morocco_-_Flickr_-_Milamber%27s_portfolio.jpg",
  },
  // Thailand
  {
    country: "Thailand",
    name: "Grand Palace",
    city: "Bangkok",
    description:
      "The former official residence of the Kings of Siam, a dazzling complex of throne halls and royal temples.",
    latitude: 13.75,
    longitude: 100.4913,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/30/A_roof_of_a_building_at_the_Grand_Palace%2C_Bangkok%2C_sunrise%2C_2017.jpg",
  },
  {
    country: "Thailand",
    name: "Wat Arun",
    city: "Bangkok",
    description:
      "The 'Temple of Dawn,' a riverside Buddhist temple famous for its ornate central spire decorated in porcelain.",
    latitude: 13.7437,
    longitude: 100.4889,
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Templo_Wat_Arun%2C_Bangkok%2C_Tailandia%2C_2013-08-22%2C_DD_30.jpg",
  },
];
