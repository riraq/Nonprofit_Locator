var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-search"); //input box
var searchResultsEl = document.getElementById("searchResults")

var proPubUrl = "https://projects.propublica.org/nonprofits/api/v2"

var orgArr = [];
var EINarr = [];

//inital fetch function below

function getOrgs(searchedCity) {
  var searchInput = cityInput.value.toLowerCase();
  console.log("City searched: " + searchInput);
  var proxyUrl = "https://cors-anywhere.herokuapp.com/"
  var proPubUrl = "https://projects.propublica.org/nonprofits/api/v2/search.json?q=" + cityInput.value + "&ntee%5Bid%5D=3";
  //url format is [API base request URL] + [search text entered by user] + [NTEE code for animal and environment orgs]
  //variable names subject to change

  fetch(proxyUrl + proPubUrl)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json()
          .then(function (data) {
            for (var i = 0; i < searchResultsEl.children.length; i++) {
              searchResultsEl.children[i].children[0].textContent = data.organizations[i].name
              searchResultsEl.children[i].children[1].textContent = data.organizations[i].city
              searchResultsEl.children[i].children[2].textContent = data.organizations[i].state
            }
            console.log("City searched: " + searchedCity)
            console.log(data);
            orgArr = data.organizations;
            // console.log("org array: " + orgArr);

            readEIN(orgArr);
            // console.log("EINs: " + EINarr);

            getAddress(EINarr);
          });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to ProPublica Non-Profit Explorer");
    });
};

  
  //button is clicked
  searchBtn.onclick = function () {
    //input field is set to cityInput.value
    var search_query = cityInput.value;
    //array to hold search history
    //output beign over written bc of 62, edit 
    //was history becuase reffered to histry outside of scope (window history)
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory == null) { searchHistory = []} //initialization of empyt array BEFORE user interacts
    //["search_query0", "search_query1", "search_query2"]; //edit for JSO
    /// use array or object then decide how you will add items to the array or object
    //SHIFT adds to beg of array, push to end 
    //history[0] = search_query
    alert("New search for storage? " + search_query + " for storage");
    // console.log(history);
    // console.log(typeof history);
    //cityInput is PUSHED to history array
    searchHistory.push(search_query);
    console.log(searchHistory);
    //history array is saved to loaclStorage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    console.log(typeof searchHistory);

    return search_query
    
  };
  var storedSearches = JSON.parse(localStorage.getItem("searchHistory")); 




searchBtn.addEventListener("click", getOrgs);

// Reads EIN from each returned org and pushes those numbers into a new array
// Set to only loop 1 time currently, as too many fetch requests at once are triggering a 403 error from the server

function readEIN(arr) {
  for (var i = 0; i < 1; i++) {
    EINarr.push(arr[i].ein);
  }
}


// Uses EINs to pull address and ZIP code for each org
// Set to only loop 1 time currently, as too many fetch requests at once are triggering a 403 error from the server

function getAddress(arr) {
  for (var i = 0; i < 1; i++) {

    // console.log("EIN to feed: " + arr[i].toString());  
    // console.log("Unconverted EIN: " + arr[i]);

    //console.log("Unconverted EIN: " + arr[i] + " / / " + "EIN to feed: " + arr[i].toString());

    var EINsAsString = EINarr[i].toString();

    var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    var searchByEIN = "https://projects.propublica.org/nonprofits/api/v2/organizations/" + EINsAsString + ".json";

    console.log("Type of first EIN: " + typeof (arr[0]));
    // console.log(EINarr);
    console.log("second fetch url: " + proxyUrl + searchByEIN);

    fetch(proxyUrl + searchByEIN)
      .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json()
            .then(function (addressData) {

              var addr = addressData.organization.address;
              console.log("Address: " + addr);

              var zip = addressData.organization.zipcode;
              console.log("Zip code: " + zip);

            });
        } else {
          console.log("Error: " + response.statusText);
        }
      })
      .catch(function (error) {
        console.log("Unable to connect to ProPublica Non-Profit Explorer");
      });
  }
}


// this code is from the propublica api
// $ curl https://projects.propublica.org/nonprofits/api/v2/search.json?q=propublica



// {
//   "total_results":1,
//   "organizations":[{
//     "ein":142007220,
//     "strein":"14-2007220",
//     "name":"PRO PUBLICA INC",
//     "sub_name":"PRO PUBLICA INC",
//     "city":"NEW YORK",
//     "state":"NY",
//     "ntee_code":"A20",
//     "raw_ntee_code":"A20",
//     "subseccd":3,
//     "has_subseccd":true,
//     "have_filings":null,
//     "have_extracts":null,
//     "have_pdfs":null,
//     "score":11612.384
//   }],
//   "num_pages":1,
//   "cur_page":0,
//   "page_offset":0,
//   "per_page":100,
//   "search_query":"propublica",
//   "selected_state":null,
//   "selected_ntee":null,
//   "selected_code":null,
//   "data_source":"ProPublica Nonprofit Explorer API: https://projects.propublica.org/nonprofits/api/\nIRS Exempt Organizations Business Master File Extract (EO BMF): https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf\nIRS Annual Extract of Tax-Exempt Organization Financial Data: https://www.irs.gov/uac/soi-tax-stats-annual-extract-of-tax-exempt-organization-financial-data",
//   "api_version":2
// }
// ____________________________________________________________________________________________
// function to save prior searches
    // array to save city searches
    //function to move searches into array 
    //function to store the array
    //var citySearch = []
// function recordCity(params) {
//     var input = "city-search";
        //input.citySearches.push[]
// };




// access token for retrieving map
mapboxgl.accessToken = 'pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg';

// creates and styles map, sets location view to USA at an appropriate zoom level
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-95, 37],
  zoom: 2,
});

// adds map controls
map.addControl(new mapboxgl.NavigationControl());

var geocoder = new MapboxGeocoder({ // Initialize the geocoder
  accessToken: mapboxgl.accessToken, // Set the access token
  mapboxgl: mapboxgl, // Set the mapbox-gl instance
  marker: false, // Do not use the default marker style
});

var practiceData = []

// fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/Los%20Angeles.json?access_token=pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg")
// .then(function(response){
//   console.log(response)
//   return response.json()
// })
// .then(function(data){
//   console.log(data)
// })

var geojson = {
  type: 'FeatureCollection',
  features: [{
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-77.032, 38.913]
    },
    properties: {
      title: 'Mapbox',
      description: 'Washington, D.C.'
    }
  },
  {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-122.414, 37.776]
    },
    properties: {
      title: 'Mapbox',
      description: 'San Francisco, California'
    }
  }]
};

geojson.features.forEach(function(marker) {

  // create a HTML element for each feature
  var el = document.createElement('div');
  el.className = 'marker';

  // make a marker for each feature and add to the map
  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);

  new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML('<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>'))
    .addTo(map);
});

// { type: "FeatureCollection", query: Array(2), features: Array(5), attribution: "NOTICE: © 2021 Mapbox and its suppliers. All right…y not be retained. POI(s) provided by Foursquare." }
// attribution: "NOTICE: © 2021 Mapbox and its suppliers. All rights reserved. Use of this data is subject to the Mapbox Terms of Service (https://www.mapbox.com/about/maps/). This response and the information it contains may not be retained. POI(s) provided by Foursquare."
// features: Array(5)
// 0:
// bbox: (4)[-118.521456965901, 33.9018913203336, -118.121305008073, 34.161440999758]
// center: Array(2)
// 0: -118.2439
// 1: 34.0544
// length: 2
// __proto__: Array(0)
// context: (2)[{ … }, { … }]
// geometry: { type: "Point", coordinates: Array(2) }
// id: "place.7397503093427640"
// place_name: "Los Angeles, California, United States"
// place_type: ["place"]
// properties: { wikidata: "Q65" }
// relevance: 1
// text: "Los Angeles"
// type: "Feature"
// __proto__: Object
// 1: { id: "place.10952642230180310", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// 2: { id: "poi.300647807514", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// 3: { id: "locality.9858218050180310", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// 4: { id: "neighborhood.2104633", type: "Feature", place_type: Array(1), relevance: 1, properties: { … }, … }
// length: 5
// __proto__: Array(0)
// query: (2)["los", "angeles"]
// type: "FeatureCollection"
// __proto__: Object
