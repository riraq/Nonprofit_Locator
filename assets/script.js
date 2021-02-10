var searchBtn = document.getElementById("search-btn");
var cityInput = document.getElementById("city-search"); //input box
var searchResultsEl = document.getElementById("searchResults")
var showList = document.getElementById("showList");
var showMap = document.getElementById("showMap");
var mapEl = document.getElementById("map");
var listEl = document.getElementsByClassName("list")

var proxyUrl = "https://api.codetabs.com/v1/proxy?quest="

var storedSearches = JSON.parse(localStorage.getItem("searchHistory")); 

var orgArr = [];
var EINarr = [];
var organizations = [];
var finalOrganizations = [];

var priorSearch;

var priorCity = document.getElementById("prior");

//inital fetch function below

function getOrgs() {
  
  if (searchBtn.innerHTML !== "Search"){
    return
  }
  searchResultsEl.style.backgroundColor = "rgb(9, 131, 84)"
  searchBtn.textContent = "Clear Results"
  showList.style.display = ""
  showMap.style.display = ""
  
  var searchInput = cityInput.value.toLowerCase();
  
  if (priorSearch !== searchInput) {
    finalOrganizations = [];
    EINarr = [];


  }
  priorSearch = searchInput;

  var proPubUrl = "https://projects.propublica.org/nonprofits/api/v2/search.json?q=" + cityInput.value + "&ntee%5Bid%5D=3";
  //url format is [API base request URL] + [search text entered by user] + [NTEE code for animal and environment orgs]
  
  fetch(proxyUrl + proPubUrl)

  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
    else {
      throw response;
    }
  })

  .then(function (data) {
    console.log(data)
    for (var i = 0; i < 5; i++) {
      EINarr.push(data.organizations[i].ein)
    }
  })

  .then(function () {
    for (var j = 0; j < EINarr.length; j++) {
      var searchByEIN = "https://projects.propublica.org/nonprofits/api/v2/organizations/" + EINarr[j] + ".json";
      fetch(proxyUrl + searchByEIN)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
        else {
          throw response;
        }
      })

      .then(function (addressData) {
        console.log(addressData)
        var finalOrgObj = {
          name: "",
          address: "",
          city: "",
          state: "",
          zipCode: ""
        }

        finalOrgObj.name = addressData.organization.name;
        finalOrgObj.city = addressData.organization.city;
        finalOrgObj.state = addressData.organization.state;
        finalOrgObj.address = addressData.organization.address;
        finalOrgObj.zipCode = addressData.organization.zipcode;
        finalOrganizations.push(finalOrgObj);

        if (finalOrganizations.length === EINarr.length){
          for(var k=0; k<EINarr.length; k++){
            searchResultsEl.children[k].children[0].innerHTML = finalOrganizations[k].name
            geojson.features[k].properties.title = finalOrganizations[k].name            
            searchResultsEl.children[k].children[1].innerHTML = finalOrganizations[k].address
            geojson.features[k].properties.description = finalOrganizations[k].address
            searchResultsEl.children[k].children[2].innerHTML = finalOrganizations[k].city
            searchResultsEl.children[k].children[3].innerHTML = finalOrganizations[k].state
            searchResultsEl.children[k].children[4].innerHTML = finalOrganizations[k].zipCode
            searchResultsEl.children[k].classList.remove("hidden");
          }

        }
      })
    }
  })

  .catch(function (error) {
    console.log("Unable to connect to ProPublica Non-Profit Explorer");
  });
};


// clears search results
searchBtn.addEventListener("click", function(){
  if (searchBtn.textContent !== "Clear Results"){
    return
  }
  orgArr = [];
  EINarr = [];
  organizations = [];
  finalOrganizations = [];
  mapEl.textContent = ""
  showList.style.display = "none"
  showMap.style.display = "none"
  searchResultsEl.removeAttribute("style");
  showList.disabled = true;
  showMap.disabled = false;
  mapEl.style.display = "none"
  for(var q=0; q<5; q++){
    searchResultsEl.children[q].classList.add("hidden")
  }
  for(var p=0; p<25; p++){
    listEl[p].textContent = ""
    console.log(listEl)
  }
})



// switches to list display for results
showList.addEventListener("click", function(){
  searchResultsEl.removeAttribute("style");
  searchResultsEl.style.backgroundColor = "rgb(9, 131, 84)"
  showList.disabled = true;
  showMap.disabled = false;
  mapEl.style.display = "none"
})

var coordinatesArr = []

// switches to map display for search results
showMap.addEventListener("click", function () {
  showMap.disabled = true;
  showList.disabled = false;
  searchResultsEl.style.display = "none"
  mapEl.style.display = ""
  console.log(geojson)

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

  var urlMap1 = "https://api.mapbox.com/geocoding/v5/mapbox.places/"
  var urlMap2 = ".json?access_token=pk.eyJ1IjoicmlyYXEiLCJhIjoiY2trcTdkOW91MDE2dzJ5bms1eG4xcG83byJ9.LhDGv60vuX4Xu1SrIL5Aeg"

  var citySearch = finalOrganizations[0].city
  var stateSearch = finalOrganizations[0].state
    fetch(urlMap1 + geojson.features[0].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          console.log(response)
          return response.json();
        }
        // else {
        //   console.log(response)
        //   throw response;
        // }
      })

      .then(function (data) {
        geojson.features[0].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[0].geometry.coordinates.push(data.features[0].center[1])
      })
      
      fetch(urlMap1 + geojson.features[1].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          console.log(response)
          return response.json();
        }
        // else {
        //   console.log(response)
        //   throw response;
        // }
      })

      .then(function (data) {
        geojson.features[1].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[1].geometry.coordinates.push(data.features[0].center[1])
      })
      
      fetch(urlMap1 + geojson.features[2].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          console.log(response)
          return response.json();
        }
        // else {
        //   console.log(response)
        //   throw response;
        // }
      })

      .then(function (data) {
        geojson.features[2].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[2].geometry.coordinates.push(data.features[0].center[1])
      })
      
      fetch(urlMap1 + geojson.features[3].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          console.log(response)
          return response.json();
        }
        // else {
        //   console.log(response)
        //   throw response;
        // }
      })

      .then(function (data) {
        geojson.features[3].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[3].geometry.coordinates.push(data.features[0].center[1])
      })

      fetch(urlMap1 + geojson.features[4].properties.description.split("#") + " " + citySearch + " " + stateSearch + urlMap2)
      .then(function (response) {
        if (response.ok) {
          console.log(response)
          return response.json();
        }
        // else {
        //   console.log(response)
        //   throw response;
        // }
      })

      .then(function (data) {
        geojson.features[4].geometry.coordinates.push(data.features[0].center[0])
        geojson.features[4].geometry.coordinates.push(data.features[0].center[1])
        console.log(geojson)
      })

      .then(
        map.on('load', function (e) {
          /* Add the data to your map as a layer */
          map.addLayer({
            "id": "locations",
            "type": "circle",
            /* Add a GeoJSON source containing place coordinates and information. */
            "source": {
              "type": "geojson",
              "data": geojson
            }
          });
        })
      )
})


var geojson = {
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  },
  {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: []
    },
    properties: {
      title: "",
      description: ""
    }
  }]
};


function showLastSearch() {
    var finalIndex;
    if(storedSearches !== null ) {
    finalIndex = storedSearches.length;
    console.log("Search history length:" + finalIndex);
    console.log("Search history: " + storedSearches);
    console.log("Last searched: " + storedSearches[finalIndex - 1]);
    priorCity.textContent = storedSearches[finalIndex - 1];
  }
    else return;
}

function init() {
  showLastSearch();
}

function redoSearch(event) {
  event.preventDefault()
  cityInput.value = priorCity.textContent;
  console.log(priorCity.textContent);
  getOrgs();
}

init();

searchBtn.addEventListener("click", getOrgs);
priorCity.addEventListener("click", redoSearch);

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
  // alert("New search for storage? " + search_query + " for storage");
  // console.log(history);
  // console.log(typeof history);
  //cityInput is PUSHED to history array
  searchHistory.push(search_query);
  //history array is saved to loaclStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  return search_query

  
};

document.addEventListener('DOMContentLoaded', function () {

  // Modals

  var rootEl = document.documentElement;
  var allModals = getAll('.modal');
  var modalButtons = getAll('.modal-button');
  var modalCloses = getAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button');

  if (modalButtons.length > 0) {
      modalButtons.forEach(function (el) {
          el.addEventListener('click', function () {
              var target = document.getElementById(el.dataset.target);
              rootEl.classList.add('is-clipped');
              target.classList.add('is-active');
          });
      });
  }

  if (modalCloses.length > 0) {
      modalCloses.forEach(function (el) {
          el.addEventListener('click', function () {
              closeModals();
          });
      });
  }

  document.addEventListener('keydown', function (event) {
      var e = event || window.event;
      if (e.keyCode === 27) {
          closeModals();
      }
  });

  function closeModals() {
      rootEl.classList.remove('is-clipped');
      allModals.forEach(function (el) {
          el.classList.remove('is-active');
      });
  }

  // Functions

  function getAll(selector) {
      return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
  }
})