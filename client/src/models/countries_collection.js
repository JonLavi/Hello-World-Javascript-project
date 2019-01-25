// Path 1
// Datababase request to MongoDB
// Return an array of country/hello objects
// Save into local constant

// Path 2
// Use dummy data to request to request all of those countries API objects

const RequestHelper = require('../helpers/request_helper.js');
const PubSub = require('../helpers/pub_sub.js');
const sample_data = require('../data/dummy.js')


const Countries = function () {
  this.apiCountries = [];
};

Countries.prototype.getCountriesAPIData = function () {
  const requestHelper = new RequestHelper('https://restcountries.eu/rest/v2/all');
  const myPromise = requestHelper.get()
  myPromise.then((data) => {
    this.apiCountries = data
    // console.log(this.apiCountries);
    const filteredCountries =this.filterData(this.apiCountries, sample_data)
    console.log('filtered countries',filteredCountries);
  })


};



Countries.prototype.filterData = function (apiData, sampleData) {

  let filteredObjectArray = []
  sampleData.forEach((country) => {
    apiData.forEach((apiCountry) => {
      if (apiCountry.name === country.name) {
        filteredObjectArray.push(apiCountry)
      }
    }
  )
  })
  return filteredObjectArray
};




module.exports = Countries
