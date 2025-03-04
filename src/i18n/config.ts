
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';

const resources = {
  fr: {
    translation: fr
  },
  en: {
    translation: {
      "seo": {
        "title": "Title",
        "description": "Description",
        "keywords": "Keywords",
        "structure": "Structure",
        "content": "Content",
        "wordCount": "Word count",
        "internalLinks": "Internal links",
        "externalLinks": "External links",
        "noKeywords": "No keywords defined",
        "mainTags": "Main tags",
        "notDefined": "Not defined",
        "notDefined_female": "Not defined",
        "imageCount": "Image count"
      },
      "map": {
        "title": "Interactive SEO Map",
        "description": "Search for an address and add markers to create a custom map",
        "interactiveMap": "Interactive Map",
        "addMarker": "Add marker",
        "moveMap": "Move map",
        "view": "View",
        "search": "Search",
        "searching": "Searching...",
        "addressPlaceholder": "Enter an address, city or country...",
        "enterAddress": "Please enter an address",
        "searchingFor": "Searching for",
        "locationFound": "Location found",
        "noResults": "No results found for",
        "tryMorePrecise": "Try to be more precise by including the city or country",
        "searchError": "Search error. Please try again with another address",
        "markerPositionSet": "Marker position set. Please enter a label",
        "marker": "Marker",
        "markerName": "Marker name...",
        "markerAdded": "Marker",
        "added": "added",
        "markerDeleted": "Marker deleted!",
        "markers": "Markers",
        "noMarkers": "No markers added",
        "add": "Add",
        "cancel": "Cancel",
        "north": "North",
        "south": "South",
        "east": "East",
        "west": "West",
        "embedCode": "Embed code",
        "show": "Show",
        "hide": "Hide",
        "copy": "Copy",
        "codeCopied": "Embed code copied!",
        "openSuccess": "Interactive map opened. You can add markers and customize your map.",
        "openError": "Unable to open the map. Please try again.",
        "clickToAddMarker": "Click on the map to add a marker",
        "chooseMarkerColor": "Choose marker color",
        "legend": "Legend",
        "showLegend": "Show legend",
        "hideLegend": "Hide legend",
        "color": {
          "red": "Red",
          "blue": "Blue",
          "green": "Green",
          "yellow": "Yellow",
          "purple": "Purple"
        },
        "legend": {
          "importantPlaces": "Important places",
          "clientLocation": "Client location",
          "competitors": "Competitors",
          "pointsOfInterest": "Points of interest",
          "targetAreas": "Target areas"
        }
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
