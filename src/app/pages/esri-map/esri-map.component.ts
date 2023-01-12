import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { setDefaultOptions, loadModules } from 'esri-loader';
import * as View from "esri/views/View";
import { Subscription } from "rxjs";
// import { FirebaseService, ITestItem } from "src/app/services/database/firebase";
// import { FirebaseMockService } from "src/app/services/database/firebase-mock";
import esri = __esri; // Esri TypeScript Types

@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  // The <div> where we will place the map
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

  // register Dojo AMD dependencies
  _Map;
  _MapView;
  _FeatureLayer;
  _Graphic;
  _GraphicsLayer;
  _Route;
  _RouteParameters;
  _FeatureSet;
  _Point;
  _locator;

  // Instances
  map: esri.Map;
  view: esri.MapView;
  pointGraphic: esri.Graphic;
  graphicsLayer: esri.GraphicsLayer;

  // Attributes
  zoom = 10;
  center: Array<number> = [12.4964, 41.9028];
  basemap = "streets-vector";
  loaded = false;
  pointCoords: number[] = [12.4964, 41.9028];
  dir: number = 0;
  count: number = 0;
  timeoutHandler = null;

  // // firebase sync
  // isConnected: boolean = false;
  // subscriptionList: Subscription;
  // subscriptionObj: Subscription;

  constructor(
    //private fbs: FirebaseService
    // private fbs: FirebaseMockService
  ) { }

  async initializeMap() {
    try {
      // configure esri-loader to use version x from the ArcGIS CDN
      // setDefaultOptions({ version: '3.3.0', css: true });
      setDefaultOptions({ css: true });

      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, route, RouteParameters, FeatureSet, SearchFunction, locator, geometryEngine, reactiveUtils] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet",
        "esri/widgets/Search",
        "esri/rest/locator",
        "esri/geometry/geometryEngine",
        "esri/core/reactiveUtils"
      ]);

      esriConfig.apiKey = "AAPKc51195b9373b4eeaa68102ca10b8020762XGYkRwQajtskp7Op3PU7z5kUArWiVzWKrrYVQ8vB76ulZmPpy-It8k96b5SIfD";

      this._Map = Map;
      this._MapView = MapView;
      this._FeatureLayer = FeatureLayer;
      this._Graphic = Graphic;
      this._GraphicsLayer = GraphicsLayer;
      this._Route = route;
      this._RouteParameters = RouteParameters;
      this._FeatureSet = FeatureSet;
      this._Point = Point;

      // Configure the Map
      const mapProperties = {
        basemap: this.basemap
      };

      this.map = new Map(mapProperties);

      this.addFeatureLayers();
      this.addGraphicLayers();

  //    this.addPoint(this.pointCoords[1], this.pointCoords[0], true);

      // Initialize the MapView
      const mapViewProperties = {
        container: this.mapViewEl.nativeElement,
        center: this.center,
        zoom: this.zoom,
        map: this.map
      };

      this.view = new MapView(mapViewProperties);

      // Fires `pointer-move` event when user clicks on "Shift"
      // key and moves the pointer on the view.
      this.view.on('pointer-move', ["Shift"], (event) => {
        let point = this.view.toMap({ x: event.x, y: event.y });
        console.log("map moved: ", point.longitude, point.latitude);
        
      });

      // search function
      const search = new SearchFunction({  //Add Search widget
        view: this.view
      });
      this.view.ui.add(search, "top-right");

      //search by categories
      const places = ["Choose a destination type...", "Museum", "Plaza", "Church", "Hill", "Others"];
      const select = document.createElement('select');
      select.setAttribute("class", "esri-widget esri-select");
      select.setAttribute("style", "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em");
      places.forEach(function(p){
        const option = document.createElement("option");
        option.value = p;
        option.innerHTML = p;
        select.appendChild(option);
      });
      this.view.ui.add(select, "top-right");
      const locatorUrl = "http://geocode-api.arcgis.com/arcgis/rest/services/World/GeocodeServer";
      // Find places and add them to the map
   function findPlaces(category, pt) {
    locator.addressToLocations(locatorUrl, {
      location: pt,
      categories: [category],
      maxLocations: 25,
      outFields: ["Place_addr", "PlaceName"]
    })
    .then(function(results) {
      this.view.popup.close();
      this.view.graphics.removeAll();

    });
    this.results.forEach(function(result){
      this.view.graphics.add(
        new Graphic({
          attributes: result.attributes,  // Data attributes returned
          geometry: result.location, // Point returned
          symbol: {
           type: "simple-marker",
           color: "#000000",
           size: "12px",
           outline: {
             color: "#ffffff",
             width: "2px"
           }
          },

          popupTemplate: {
            title: "{PlaceName}", // Data attribute names
            content: "{Place_addr}"
          }
       }));
    });
  }
    // Search for places in center of map
    // this.view.watch("stationary", function(val) {
    //   if (val) {
    //      findPlaces(select.value, this.view.center);
    //   }
    // });
    // findPlaces(select.value, this.view.center);
    // Listen for category changes and find places
    const myView = this.view;
    select.addEventListener('change', function (event) {
      console.log("Filter event");
      findPlaces((event.target as HTMLTextAreaElement).value, myView.center);
    });

    

    // Routing
    this.addRouter();
    // const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
    //   if (this.view == undefined) {
    //     console.log("mrara");
    //   }
    //   if (this.view.graphics == undefined) {
    //     console.log("mrara2");
    //   }
    //   if (this.view.graphics.length == undefined) {
    //     console.log("mrara3");
    //   }
    //   this.view.on("click", function(event){
    //     // if (this.view === undefined) {
    //     //   console.log("undefined");
    //     // } else {
    //     if (this.view.graphics.length === 0) {
    //       console.log("0");
    //       addGraphic("origin", event.mapPoint);
    //     } else if (this.view.graphics.length === 1) {
    //       console.log("1");
    //       addGraphic("destination", event.mapPoint);
    //       console.log("2");
    //       getRoute(); // Call the route service
    //       console.log("3");
    //     } else {
    //       console.log("4");
    //       this.view.graphics.removeAll();
    //       addGraphic("origin",event.mapPoint);
    //     }
    //     console.log("meow");
    //   // }
    // });

    // function addGraphic(type, point) {
    //   const graphic = new Graphic({
    //     symbol: {
    //       type: "simple-marker",
    //       color: (type === "origin") ? "white" : "black",
    //       size: "8px"
    //     },
    //     geometry: point
    //   });
    //   this.view.graphics.add(graphic);
    // }
    // function getRoute() {
    //   const routeParams = new RouteParameters({
    //     stops: new FeatureSet({
    //       features: this.view.graphics.toArray()
    //     }),
    //     returnDirections: true
    //   });
    //   route.solve(routeUrl, routeParams)
    //     .then(function(data) {
    //       data.routeResults.forEach(function(result) {
    //         result.route.symbol = {
    //           type: "simple-line",
    //           color: [5, 150, 255],
    //           width: 3
    //         };
    //         this.view.graphics.add(result.route);
    //       });
    //       // Display directions
    //       if (data.routeResults.length > 0) {
    //         const directions = document.createElement("ol");
    //         directions.classList.add("esri-widget esri-widget--panel esri-directions__scroller");
    //         directions.style.marginTop = "0";
    //         directions.style.padding = "15px 15px 15px 30px";
    //         const features = data.routeResults[0].directions.features;
    //         // Show each direction
    //         features.forEach(function(result,i){
    //         const direction = document.createElement("li");
    //         direction.innerHTML = result.attributes.text + " (" + result.attributes.length.toFixed(2) + " miles)";
    //         directions.appendChild(direction);
    //       });
    //       this.view.ui.add(directions, "top-right");
    //       }
          
    //     })
    //     .catch(function(error){
    //       console.log(error);
    //   })
    // }


      await this.view.when(); // wait for map to load
      console.log("ArcGIS map loaded");
      console.log("Map center: " + this.view.center.latitude + ", " + this.view.center.longitude);
      return this.view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  addGraphicLayers() {
    this.graphicsLayer = new this._GraphicsLayer();
    this.map.add(this.graphicsLayer);
  }

   touristAttractionsRenderer = {
    "type": "simple",
    "symbol": {
      "type": "picture-marker",
      "url": "https://cdn4.iconfinder.com/data/icons/country-landmarks-and-destinations/91/Vietnam-512.png",
      "width": "20px",
      "height": "20px"
    }
    
 }

 museumsRenderer = {
  "type": "simple",
  "symbol": {
    "type": "picture-marker",
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Map_symbol_museum.svg",
    "width": "20px",
    "height": "20px"
  }
  
}

churchesRenderer = {
  "type": "simple",
  "symbol": {
    "type": "picture-marker",
    "url": "https://cdn-icons-png.flaticon.com/512/3891/3891873.png",
    "width": "20px",
    "height": "20px"
  }
  
}


squaresRenderer = {
  "type": "simple",
  "symbol": {
    "type": "picture-marker",
    "url": "https://cdn4.iconfinder.com/data/icons/buildings-places-3/24/city_park_square_urban_water_fountain_public_pond-512.png",
    "width": "20px",
    "height": "20px"
  }
  
}


  popupTrailheads = {
    "title": "{NAME}",
    "content": " <img src={Image} width=200 height=150 class=center /> <br><b>Website:</b> <a href={Website}>{Website} </a> <br><b>Cost:</b> {Cost}<br><b>Address:</b> {Address}<br><b>Latitude:</b> {Latitude}<br><b>Longitude:</b> {Longitude}"
  }

  addFeatureLayers() {
    // Trailheads feature layer (points)
    var touristAttractionLayer: __esri.FeatureLayer = new this._FeatureLayer({
      url:
        "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_tourist_attractions/FeatureServer/0",
      popupTemplate: this.popupTrailheads,
      renderer: this.touristAttractionsRenderer
    });
    var museumsLayer: __esri.FeatureLayer = new this._FeatureLayer({
      url:
        "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_museums/FeatureServer/0",
      popupTemplate: this.popupTrailheads,
      renderer: this.museumsRenderer
    });
    var churchesLayer: __esri.FeatureLayer = new this._FeatureLayer({
      url:
      "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_churches/FeatureServer/0",
      popupTemplate: this.popupTrailheads,
      renderer: this.churchesRenderer
    });
    var squaresLayer: __esri.FeatureLayer = new this._FeatureLayer({
      url:
        "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_squares/FeatureServer/0",
      popupTemplate: this.popupTrailheads,
      renderer: this.squaresRenderer
    });
    this.map.add(touristAttractionLayer);
    this.map.add(museumsLayer);
    this.map.add(churchesLayer);
    this.map.add(squaresLayer);

    console.log("feature layers added");
  }
  addRouter() {
    const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

    this.view.on("click", (event) => {
      console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
      if (this.view.graphics.length === 0) {
        addGraphic("origin", event.mapPoint);
      } else if (this.view.graphics.length === 1) {
        addGraphic("destination", event.mapPoint);
        getRoute(); // Call the route service
      } else {
        this.view.graphics.removeAll();
        addGraphic("origin", event.mapPoint);
      }
    });

    var addGraphic = (type: any, point: any) => {
      const graphic = new this._Graphic({
        symbol: {
          type: "simple-marker",
          color: (type === "origin") ? "white" : "black",
          size: "8px"
        } as any,
        geometry: point
      });
      this.view.graphics.add(graphic);
    }

    var getRoute = () => {
      const routeParams = new this._RouteParameters({
        stops: new this._FeatureSet({
          features: this.view.graphics.toArray()
        }),
        returnDirections: true
      });

      this._Route.solve(routeUrl, routeParams).then((data: any) => {
        for (let result of data.routeResults) {
          result.route.symbol = {
            type: "simple-line",
            color: [5, 150, 255],
            width: 3
          };
          this.view.graphics.add(result.route);
        }

        // Display directions
        if (data.routeResults.length > 0) {
          const directions: any = document.createElement("ol");
          directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
          directions.style.marginTop = "0";
          directions.style.padding = "15px 15px 15px 30px";
          const features = data.routeResults[0].directions.features;

          let sum = 0;
          // Show each direction
          features.forEach((result: any, i: any) => {
            var nr = parseFloat(result.attributes.length) * 1.609344;
            sum += nr
            const direction = document.createElement("li");
            nr = nr * 1000;
            direction.innerHTML = result.attributes.text + " (" + nr.toFixed(0) + " m)";
            directions.appendChild(direction);
          });

          var direction = document.createElement("header");
          direction.innerHTML = "Expected Taxi Price: " + (sum * 1.60).toFixed(2) + "€";
          directions.insertBefore(direction, directions.firstChild);
          direction = document.createElement("header");
          direction.innerHTML = "Total Distance: " + sum.toFixed(2) + "km";
          directions.insertBefore(direction, directions.firstChild);
          console.log('dist (km) = ', sum);
          //this.view.ui.empty("top-right");
          this.view.ui.add(directions, "bottom-left");

        }

      }).catch((error: any) => {
        console.log(error);
      });
    }
  }

  addSearchDemographicData() {

  }
  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    console.log("initializing map");
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log("mapView ready: ", this.view.ready);
      this.loaded = this.view.ready;
    });
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
  }
}