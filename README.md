# Nonprofit Locator

## Value Add Proposal

Application allows users to look up environmental and animal focused nonprofit organizations by city and view their address, as well as their location on a map.


## Tech stack

The application demonstrates the ability to use the CSS framework Bulma as well as interacting with server side APIs including the ProPublica Nonprofit Explorer and Mapbox.


## Roles

- Rony: Added map API. JavaScript functions. HTML structure. Managed repo.
- Daniel: Creating and debugging fetch requests to ProPublica Nonprofit Explorer API. Added quick search feature to reload previously searched city with one click. Added color scheme.
- Kayleigh: Adding error message to modal. Setting up function to save search history in local storage. Presentation director.
- Angelica: Using bulma documentation to style css and html. Adding modal and finding javascript to work with Bulma.


## MVP

### Phase 1

Add explanatory text and search bar in which users can enter the name of desired city. Clicking the search button after entering a valid city name, a chain of two fetch requests are made to the ProPublica Nonprofit Explorer API and the name and address of the first 5 resulting nonprofit organizations are pulled. These 5 organizations' names and addresses are then displayed in the search results area.


### Phase 2

Add function to store past searches in local storage. Also added quicksearch feature so returning user can click on an anchor of the last searched city in local storage to search that city again with a single click. Added option to view map instead of listed addresses.


### Phase 3

Add color scheme to page and additional styling to search results to aid readability. Map now generates markers based on the location of the organizations found by the search. Markers can be clicked to show a popup with information. Modal popup has been added to advise user if an invalid city name is entered.


### Demo

![Screencap of application](./assets/ScreenCap.jpg)

Nonprofit Locator is deployed via gitHub pages. Click [here](https://riraq.github.io/Nonprofit_Locator/).

The application is hosted on Github. Click [here](https://github.com/riraq/Nonprofit_Locator).