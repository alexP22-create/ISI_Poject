import { ThisReceiver } from "@angular/compiler";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { user } from "@angular/fire/auth";
import { setDefaultOptions, loadModules } from 'esri-loader';
import * as Point from "esri/geometry/Point";
import * as View from "esri/views/View";

import { Subscription } from "rxjs";
import { ProfileUser } from "src/app/models/user";
import { FirebaseService, ITestItem } from "src/app/services/database/firebase";
// import { FirebaseMockService } from "src/app/services/database/firebase-mock";
import { UsersService } from 'src/app/services/users.service';
import esri = __esri; // Esri TypeScript Types
let profileUser;
@Component({
  selector: "app-esri-map",
  templateUrl: "./esri-map.component.html",
  styleUrls: ["./esri-map.component.scss"]
})
export class EsriMapComponent implements OnInit, OnDestroy {
  user$ = this.usersService.currentUserProfile$;

  @Output() mapLoadedEvent = new EventEmitter<boolean>();
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
  _Search;
  _ServiceArea;
  _ServiceAreaParameters;

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
  destinationAdded: boolean = false;
  locationAdded: boolean = false;
  start: any;
  end: any;

  getStart: boolean = false;
  getEnd: boolean = false;
  startMessage = "Choose start point"
  endMessage = "Choose destination"
  endRouteMessage=""

  // firebase sync
  isConnected: boolean = false;
  subscriptionList: Subscription;
  subscriptionObj: Subscription;
  addPointMode: boolean = false;
  message = "Enter Add Tourist Attraction Mode";  
  searchStart;
  searchEnd;
  directions;
  // layers
touristAttractionLayer;
museumsLayer;
churchesLayer;
squaresLayer;
  constructor(
    private fbs: FirebaseService,
    public usersService: UsersService,
    // private fbs: FirebaseMockService
  ) { }
  
  async initializeMap() {
    try {
      // configure esri-loader to use version x from the ArcGIS CDN
      // setDefaultOptions({ version: '3.3.0', css: true });
      setDefaultOptions({ css: true });

      // Load the modules for the ArcGIS API for JavaScript
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, route, RouteParameters, FeatureSet, SearchFunction, locator, serviceArea, ServiceAreaParameters] = await loadModules([
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
        "esri/rest/serviceArea",
        "esri/rest/support/ServiceAreaParameters"
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
      this._Search = SearchFunction;
      this._locator = locator;
      this._ServiceArea = serviceArea;
      this._ServiceAreaParameters = ServiceAreaParameters;
      this.destinationAdded = false;
      this.locationAdded = false;
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
      

      // Routing
      //caseta punct de plecare
      const searchStart = new SearchFunction({  //Add Search widget
        view: this.view
      });
      
      //caseta destinatie
      const searchEnd = new SearchFunction({  //Add Search widget
        view: this.view
      });

      // search function
      const searchSimple = new SearchFunction({  //Add Search widget
        view: this.view
      });
      this.view.ui.add(searchSimple, "top-right");

      // console.log("aaa"+this.view.graphics.length);
      var addGraphicRoute = (type: any, point: any, where:any) => {
        console.log("Intra in addGraphicRoute");
        const graphic = new Graphic({
          symbol: {
            type: "simple-marker",
            color: (type === "origin") ? "white" : "black",
            size: "8px"
          } as any,
          geometry: point
        });
        // console.log("Incearca sa adauge");
        if (where == "start") {
          this.start=graphic;
          this.view.ui.remove(this.searchStart);
        }
        else if (where == "end") {
          this.end = graphic;
          this.view.ui.remove(this.searchEnd);
        }
        // this.view.graphics.add(graphic);
        // console.log("A adaugat");
      }
      var getRoute = () => {
        console.log("Intra in get Route");
        console.log(this.view.graphics.toArray());
        const routeParams = new RouteParameters({
          stops: new FeatureSet({
            features: this.view.graphics.toArray()
          }),
          returnDirections: true
        });
        const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";
        // console.log("Inainte de solve");

        route.solve(routeUrl, routeParams).then((data: any) => {
        // console.log("Inainte de for");

          for (let result of data.routeResults) {
            result.route.symbol = {
              type: "simple-line",
              color: [5, 150, 255],
              width: 3
            };
            this.view.graphics.add(result.route);
          }
          // console.log("Dupa for");
          
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
            // console.log('dist (km) = ', sum);
            //this.view.ui.empty("top-right");
            this.directions = directions
            this.view.ui.empty("bottom-left");
            this.view.ui.add(this.directions, "bottom-left");
  
          }
          // console.log("A terminat rutarea");
        }).catch((error: any) => {
          console.log(error);
        });
      }
      
      this.searchStart = searchStart;
      searchStart.on('search-complete', (result) => {
        const mp = result.results[0].results[0].feature.geometry;
        let lat = mp.latitude;
			  let longt = mp.longitude;
        let pointVar = new Point({
          latitude:lat,
          longitude:longt
      });
        // this.view.graphics.removeAll();
        this.locationAdded = true;
        addGraphicRoute("origin", pointVar,"start");
        // console.log("A adaugat punct de plecare");
        console.log(this.view.graphics.toArray());
        console.log(this.locationAdded);
        console.log(this.destinationAdded);

        // check if routing is possible
        if (this.locationAdded && this.destinationAdded) {
          this.view.graphics.removeAll();
          this.view.graphics.add(this.start);
          this.view.graphics.add(this.end);
          getRoute();
        }
      });
      this.searchEnd = searchEnd;
      searchEnd.on('search-complete', (result) => {
        const mp = result.results[0].results[0].feature.geometry;
        let lat = mp.latitude;
			  let longt = mp.longitude;
        let pointVar = new Point({
          latitude:lat,
          longitude:longt
      });
        // this.view.graphics.removeAll();
        addGraphicRoute("destination", pointVar,"end");
        this.destinationAdded = true;
        // console.log("A adaugat destinatie");
        console.log(this.view.graphics.toArray());
        console.log(this.locationAdded);
        console.log(this.destinationAdded);

        // to do
        if (this.locationAdded && this.destinationAdded) {
          this.view.graphics.removeAll();
          this.view.graphics.add(this.start);
          this.view.graphics.add(this.end);
          getRoute();
        }
      });
      
      // search by categories
      const places = ["Choose a destination type...", "Museum", "Square", "Church", "Others", "Recommended by users", "All"];
      const select = document.createElement('select');
      select.setAttribute("class", "esri-widget esri-select");
      select.setAttribute("style", "width: 175px; font-family: 'Avenir Next W00'; font-size: 1em");
      places.forEach(function(p){
        const option = document.createElement("option");
        option.value = p;
        option.innerHTML = p;
        select.appendChild(option);
      });
      select.addEventListener('change', (event) => {
        // console.log("heeeey");
        const result = (event.target as HTMLTextAreaElement).value;
        // console.log("=====" + result);
        if (result == "Choose a destination type...") {
          this.map.removeAll();
          this.map.add(this.graphicsLayer);
          this.map.add(this.museumsLayer);
          this.map.add(this.churchesLayer);
          this.map.add(this.touristAttractionLayer);
          this.map.add(this.squaresLayer);
        }
        if (result == "Museum") {
          this.map.removeAll();
          this.map.add(this.museumsLayer);
        }
        if (result == "Square") {
          this.map.removeAll();
          this.map.add(this.squaresLayer);
        }
        if (result == "Church") {
          this.map.removeAll();
          this.map.add(this.churchesLayer);
        }
        if (result == "Others") {
          this.map.removeAll();
          this.map.add(this.touristAttractionLayer);
        }
        if (result == "All") {
          this.map.removeAll();
          this.map.add(this.graphicsLayer);
          this.map.add(this.museumsLayer);
          this.map.add(this.churchesLayer);
          this.map.add(this.touristAttractionLayer);
          this.map.add(this.squaresLayer);
        }
        if (result == "Recommended by users") {
          this.map.removeAll();
          this.map.add(this.graphicsLayer);
        }
      });
      this.view.ui.add(select, "top-right");
      

      await this.view.when(); // wait for map to load
      this.addPointItem();
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
    this.touristAttractionLayer = touristAttractionLayer;
    this.museumsLayer = museumsLayer;
    this.churchesLayer = churchesLayer;
    this.squaresLayer = squaresLayer;
    this.map.add(touristAttractionLayer);
    this.map.add(museumsLayer);
    this.map.add(churchesLayer);
    this.map.add(squaresLayer);

    console.log("feature layers added");
  }
  
  addServiceArea() {
    const serviceAreaUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea";

      this.view.on("click", function(event){
        console.log("meowwww");
        const locationGraphic = addGraphic("origin", event.mapPoint);

        const driveTimeCutoffs = [5,10,15]; // Minutes
        const serviceAreaParams = createServiceAreaParams(locationGraphic, driveTimeCutoffs);

        solveServiceArea(serviceAreaUrl, serviceAreaParams);

      });

      // Create the location graphic
      var addGraphic = (type: any, point: any) => {
        const graphic = new this._Graphic({
          geometry: point,
          symbol: {
            type: "simple-marker",
            color: "white",
            size: 8
          }
        });

        this.view.graphics.add(graphic);
        return graphic;
      }
      var createServiceAreaParams = (locationGraphic: any, driveTimeCutoffs: any) => {

        // Create one or more locations (facilities) to solve for
        const featureSet = new this._FeatureSet({
          features: [locationGraphic]
        });
        
        // // Set all of the input parameters for the service
        const taskParameters = new this._ServiceAreaParameters({
          facilities: featureSet,
          defaultBreaks: driveTimeCutoffs,
          trimOuterPolygon: true,
          outSpatialReference: this._MapView.outSpatialReference
        });
        return taskParameters;
      }

      var solveServiceArea = (url: any, serviceAreaParams: any) => {
        
        return this._ServiceArea.solve(url, serviceAreaParams)
          .then(function(result){
            if (result.serviceAreaPolygons.features.length) {
              // Draw each service area polygon
              result.serviceAreaPolygons.features.forEach(function(graphic){
                graphic.symbol = {
                  type: "simple-fill",
                  color: "rgba(255,50,50,.25)"
                }
                this.view.graphics.add(graphic,0);
              });
            }
          }).catch((error: any) => {
            console.log(error);
          });

      }
  }



    addPoint(lat: number, lng: number, register: boolean, name: string) {   
    const point = { //Create a point
      type: "point",
      longitude: lng,
      latitude: lat
    };
    
    const simpleMarkerSymbol = {
      type: "simple-marker",
      color: [255, 0, 0],  // Red
      outline: {
        color: [255, 255, 255], // White
        width: 1
      },
      text: "point"
    };
    
    const template = {
      "title": "Suggested location by " + name,
      "content": "<b>Latitude: </b>" + lat + "lat <br><b>Longitude: </b>" + lng,
    }

    let pointGraphic: esri.Graphic = new this._Graphic({
      geometry: point,
      symbol: simpleMarkerSymbol,
      popupTemplate: template
    });

    this.graphicsLayer.add(pointGraphic);
    if (register) {
      this.pointGraphic = pointGraphic;
    }
  }

  
  connectFirebase() {
    if (this.isConnected) {
      return;
    }
    this.isConnected = true;
    this.fbs.connectToDatabase();
    this.subscriptionList = this.fbs.getChangeFeedList().subscribe((items: ITestItem[]) => {
      console.log("got new items from list: ", items);
      this.graphicsLayer.removeAll();
      for (let item of items) {
        this.addPoint(item.lat, item.lng, false, item.name);
      }
    });
    this.subscriptionObj = this.fbs.getChangeFeedObj().subscribe((stat: ITestItem[]) => {
      console.log("item updated from object: ", stat);
    });
  }

    disconnectFirebase() {
    if (this.subscriptionList != null) {
      this.subscriptionList.unsubscribe();
    }
    if (this.subscriptionObj != null) {
      this.subscriptionObj.unsubscribe();
    }
  }

  

  addPointItem() {
      this.view.on("click", (event) => {
        console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
        if (this.addPointMode == true) {
          this.user$.subscribe(event => profileUser = event);
          this.fbs.addPointItem(event.mapPoint.latitude, event.mapPoint.longitude, profileUser.displayName);
        }
      });
  }

  changeAddPointMode() {
    this.addPointMode = !this.addPointMode;
    if (this.addPointMode == true) {
      this.message = "Exit Add Tourist Attraction Mode";
    } else {
      this.message = "Enter Add Tourist Attraction Mode";
    }
  }

  changeGetStart() {
      this.view.ui.add(this.searchStart, "manual");
  }

  changeGetEnd() {
      this.view.ui.add(this.searchEnd, "manual");
  }

  endRoute() {
    if(this.locationAdded == false && this.destinationAdded == true) {
      this.endRouteMessage = "Please choose start point first!"
    } else if (this.locationAdded == true && this.destinationAdded == false) {
      this.endRouteMessage = "Please choose destination first!"
    } else if (this.locationAdded == false && this.destinationAdded == false) {
      this.endRouteMessage = "Please choose start point and destination first!"
    } else {
      this.endRouteMessage = ""
      this.view.graphics.removeAll();
      this.view.ui.remove(this.directions);
      this.locationAdded = false;
      this.destinationAdded = false;
    }
  }

  ngOnInit() {
    // Initialize MapView and return an instance of MapView
    console.log("initializing map");
    this.initializeMap().then(() => {
      // The map has been initialized
      console.log("mapView ready: ", this.view.ready);
      this.loaded = this.view.ready;
    });
    this.connectFirebase();
  }

  ngOnDestroy() {
    if (this.view) {
      // destroy the map view
      this.view.container = null;
    }
    this.disconnectFirebase()
  }
}