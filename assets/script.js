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
            for(var i=0; i<searchResultsEl.children.length; i++){
              searchResultsEl.children[i].children[0].textContent = data.organizations[i].name
              searchResultsEl.children[i].children[1].textContent = data.organizations[i].city
              searchResultsEl.children[i].children[2].textContent = data.organizations[i].state
              searchResultsEl.children[i].children[3].textContent = data.organizations[i].ein
              searchResultsEl.children[i].children[4].textContent = data.organizations[i].sub_name

              orgArr = data.organizations;
              console.log("org array: " + orgArr);

              readEIN(orgArr);
              console.log("EINs: " + EINarr);

            }
            console.log("City searched: " + searchedCity)
            console.log(data);

          
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

function readEIN(arr) {
  for (var i = 0; i < arr.length; i++) {
    EINarr.push(orgArr[i].ein);
  }
}