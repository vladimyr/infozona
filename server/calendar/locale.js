const hr = {
  dateFormat: 'DD/MM/YYYY',
  fields: {
    location: 'Lokacija',
    date: 'Datum',
    price: 'Ulaznica',
    category: 'Kategorija'
  },
  categories: {
    other: 'Ostalo',
    sport: 'Sport',
    music: 'Mjuzza',
    exhibition: 'Izložba',
    education: 'Edukacija',
    cinema: 'Film',
    theatre: 'Predstava'
  }
};

const en = {
  dateFormat: 'DD/M/YYYY',
  fields: {
    location: 'Location',
    date: 'Date',
    price: 'Price',
    category: 'Category'
  },
  categories: {
    other: 'Other',
    sport: 'Sports',
    music: 'Music',
    exhibition: 'Exhibitions',
    education: 'Education',
    cinema: 'Cinema',
    theatre: 'Theatre'
  }
};

module.exports = { hr, en };
