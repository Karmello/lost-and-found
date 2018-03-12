module.exports = {
  email: {
    length: { max: 254 }
  },
  username: {
    length: { min: 3, max: 20 }
  },
  password: {
    length: { min: 8, max: 25 }
  },
  firstname: {
    length: { max: 25 }
  },
  lastname: {
    length: { max: 50 }
  },
  reportsRecentlyViewed: {
    length: { max: 5 }
  }
};