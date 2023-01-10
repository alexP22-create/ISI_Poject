// /*
//   Copyright 2019 Esri
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//     http://www.apache.org/licenses/LICENSE-2.0
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.
// */

// import {
//   Component,
//   OnInit,
//   ViewChild,
//   ElementRef,
//   Input,
//   Output,
//   EventEmitter,
//   OnDestroy
// } from "@angular/core";
// import { setDefaultOptions, loadModules } from 'esri-loader';
// import { Subscription } from "rxjs";
// import { FirebaseService, ITestItem } from "src/app/services/database/firebase";
// import { FirebaseMockService } from "src/app/services/database/firebase-mock";
// import * as Graphic from "esri/Graphic";
// import esri = __esri; // Esri TypeScript Types

// @Component({
//   selector: "app-esri-map",
//   templateUrl: "./esri-map.component.html",
//   styleUrls: ["./esri-map.component.scss"]
// })
// export class EsriMapComponent implements OnInit, OnDestroy {
//   @Output() mapLoadedEvent = new EventEmitter<boolean>();

//   // The <div> where we will place the map
//   @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;

//   // register Dojo AMD dependencies
//   _Map;
//   _MapView;
//   _FeatureLayer;
//   _Graphic;
//   _GraphicsLayer;
//   _Route;
//   _RouteParameters;
//   _FeatureSet;
//   _Point;
//   _locator;

//   // Instances
//   map: esri.Map;
//   view: esri.MapView;
//   pointGraphic: esri.Graphic;
//   graphicsLayer: esri.GraphicsLayer;

//   // Attributes
//   zoom = 10;
//   center: Array<number> = [12.4964, 41.9028];
//   basemap = "streets-vector";
//   loaded = false;
//   pointCoords: number[] = [12.4964, 41.9028];
//   dir: number = 0;
//   count: number = 0;
//   timeoutHandler = null;

//     // firebase sync
//     isConnected: boolean = true;
//     subscriptionList: Subscription;
//     subscriptionObj: Subscription;
  
//   constructor(private fbs: FirebaseService) { }

//   async initializeMap() {
//     try {
//       // configure esri-loader to use version x from the ArcGIS CDN
//       // setDefaultOptions({ version: '3.3.0', css: true });
//       setDefaultOptions({ css: true });

//       // Load the modules for the ArcGIS API for JavaScript
//       const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, route, RouteParameters, FeatureSet, locator] = await loadModules([
//         "esri/config",
//         "esri/Map",
//         "esri/views/MapView",
//         "esri/layers/FeatureLayer",
//         "esri/Graphic",
//         "esri/geometry/Point",
//         "esri/layers/GraphicsLayer",
//         "esri/rest/route",
//         "esri/rest/support/RouteParameters",
//         "esri/rest/support/FeatureSet",
//         "esri/rest/locator"
//       ]);

//       esriConfig.apiKey = "AAPKc51195b9373b4eeaa68102ca10b8020762XGYkRwQajtskp7Op3PU7z5kUArWiVzWKrrYVQ8vB76ulZmPpy-It8k96b5SIfD";

//       this._Map = Map;
//       this._MapView = MapView;
//       this._FeatureLayer = FeatureLayer;
//       this._Graphic = Graphic;
//       this._GraphicsLayer = GraphicsLayer;
//       this._Route = route;
//       this._RouteParameters = RouteParameters;
//       this._FeatureSet = FeatureSet;
//       this._Point = Point;
//       this._locator = locator;

//       // Configure the Map
//       const mapProperties = {
//         basemap: this.basemap
//       };

//       this.map = new Map(mapProperties);

//       this.addFeatureLayers();
//       this.addGraphicLayers();

//       this.addPoint(this.pointCoords[1], this.pointCoords[0], true);


//       // Initialize the MapView
//       const mapViewProperties = {
//         container: this.mapViewEl.nativeElement,
//         center: this.center,
//         zoom: this.zoom,
//         map: this.map
//       };

//       this.view = new MapView(mapViewProperties);

     

//       // Fires `pointer-move` event when user clicks on "Shift"
//       // key and moves the pointer on the view.
//       this.view.on('pointer-move', ["Shift"], (event) => {
//         let point = this.view.toMap({ x: event.x, y: event.y });
//         console.log("map moved: ", point.longitude, point.latitude);
//       });

//       await this.view.when(); // wait for map to load
//       console.log("ArcGIS map loaded");
//       // this.addRouter();
//       console.log(this.view.center);
//       return this.view;
//     } catch (error) {
//       console.log("EsriLoader: ", error);
//     }
//   }

  
//   addGraphicLayers() {
//     this.graphicsLayer = new this._GraphicsLayer();
//     this.map.add(this.graphicsLayer);
//   }

//   touristAttractionsRenderer = {
//     "type": "simple",
//     "symbol": {
//       "type": "picture-marker",
//       "url": "https://cdn4.iconfinder.com/data/icons/country-landmarks-and-destinations/91/Vietnam-512.png",
//       "width": "20px",
//       "height": "20px"
//     }
    
//  }

//  museumsRenderer = {
//   "type": "simple",
//   "symbol": {
//     "type": "picture-marker",
//     "url": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Map_symbol_museum.svg",
//     "width": "20px",
//     "height": "20px"
//   }
  
// }

// churchesRenderer = {
//   "type": "simple",
//   "symbol": {
//     "type": "picture-marker",
//     "url": "https://cdn-icons-png.flaticon.com/512/3891/3891873.png",
//     "width": "20px",
//     "height": "20px"
//   }
  
// }


// squaresRenderer = {
//   "type": "simple",
//   "symbol": {
//     "type": "picture-marker",
//     "url": "https://cdn4.iconfinder.com/data/icons/buildings-places-3/24/city_park_square_urban_water_fountain_public_pond-512.png",
//     "width": "20px",
//     "height": "20px"
//   }
  
// }


//   popupTrailheads = {
//     "title": "{NAME}",
//     "content": " <img src={Image} width=200 height=150 class=center /> <br><b>Website:</b> <a href={Website}>{Website} </a> <br><b>Cost:</b> {Cost}<br><b>Address:</b> {Address}<br><b>Latitude:</b> {Latitude}<br><b>Longitude:</b> {Longitude}"
//   }

//   addFeatureLayers() {
//     // Trailheads feature layer (points)
//     var touristAttractionLayer: __esri.FeatureLayer = new this._FeatureLayer({
//       url:
//         "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_tourist_attractions/FeatureServer/0",
//       popupTemplate: this.popupTrailheads,
//       renderer: this.touristAttractionsRenderer
//     });
//     var museumsLayer: __esri.FeatureLayer = new this._FeatureLayer({
//       url:
//         "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_museums/FeatureServer/0",
//       popupTemplate: this.popupTrailheads,
//       renderer: this.museumsRenderer
//     });
//     var churchesLayer: __esri.FeatureLayer = new this._FeatureLayer({
//       url:
//       "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_churches/FeatureServer/0",
//       popupTemplate: this.popupTrailheads,
//       renderer: this.churchesRenderer
//     });
//     var squaresLayer: __esri.FeatureLayer = new this._FeatureLayer({
//       url:
//         "https://services7.arcgis.com/brNnRqgYjnZtNLlC/arcgis/rest/services/rome_tourist_atractions_squares/FeatureServer/0",
//       popupTemplate: this.popupTrailheads,
//       renderer: this.squaresRenderer
//     });
//     this.map.add(touristAttractionLayer);
//     this.map.add(museumsLayer);
//     this.map.add(churchesLayer);
//     this.map.add(squaresLayer);

//     console.log("feature layers added");
//   }


//   // addRouter() {
//   //   const routeUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World";

//   //   this.view.on("click", (event) => {
//   //     console.log("point clicked: ", event.mapPoint.latitude, event.mapPoint.longitude);
//   //     if (this.view.graphics.length === 0) {
//   //       addGraphic("origin", event.mapPoint);
//   //     } else if (this.view.graphics.length === 1) {
//   //       addGraphic("destination", event.mapPoint);
//   //       getRoute(); // Call the route service
//   //     } else {
//   //       this.view.graphics.removeAll();
//   //       addGraphic("origin", event.mapPoint);
//   //     }
//   //   });

//   //   var addGraphic = (type: any, point: any) => {
//   //     const graphic = new this._Graphic({
//   //       symbol: {
//   //         type: "simple-marker",
//   //         color: (type === "origin") ? "white" : "black",
//   //         size: "8px"
//   //       } as any,
//   //       geometry: point
//   //     });
//   //     this.view.graphics.add(graphic);
//   //   }

//   //   var getRoute = () => {
//   //     const routeParams = new this._RouteParameters({
//   //       stops: new this._FeatureSet({
//   //         features: this.view.graphics.toArray()
//   //       }),
//   //       returnDirections: true
//   //     });

//   //     this._Route.solve(routeUrl, routeParams).then((data: any) => {
//   //       for (let result of data.routeResults) {
//   //         result.route.symbol = {
//   //           type: "simple-line",
//   //           color: [5, 150, 255],
//   //           width: 3
//   //         };
//   //         this.view.graphics.add(result.route);
//   //       }

//   //       // Display directions
//   //       if (data.routeResults.length > 0) {
//   //         const directions: any = document.createElement("ol");
//   //         directions.classList = "esri-widget esri-widget--panel esri-directions__scroller";
//   //         directions.style.marginTop = "0";
//   //         directions.style.padding = "15px 15px 15px 30px";
//   //         const features = data.routeResults[0].directions.features;

//   //         let sum = 0;
//   //         // Show each direction
//   //         features.forEach((result: any, i: any) => {
//   //           sum += parseFloat(result.attributes.length);
//   //           const direction = document.createElement("li");
//   //           direction.innerHTML = result.attributes.text + " (" + result.attributes.length + " miles)";
//   //           directions.appendChild(direction);
//   //         });

//   //         sum = sum * 1.609344;
//   //         console.log('dist (km) = ', sum);

//   //         this.view.ui.empty("top-right");
//   //         this.view.ui.add(directions, "top-right");

//   //       }

//   //     }).catch((error: any) => {
//   //       console.log(error);
//   //     });
//   //   }
//   // }
//   addPoint(lat: number, lng: number, register: boolean) {   
//     const point = { //Create a point
//       type: "point",
//       longitude: lng,
//       latitude: lat
//     };
//     const simpleMarkerSymbol = {
//       type: "simple-marker",
//       color: [226, 119, 40],  // Orange
//       outline: {
//         color: [255, 255, 255], // White
//         width: 1
//       }
//     };
//     let pointGraphic: esri.Graphic = new this._Graphic({
//       geometry: point,
//       symbol: simpleMarkerSymbol
//     });

//     this.graphicsLayer.add(pointGraphic);
//     if (register) {
//       this.pointGraphic = pointGraphic;
//     }
//   }

  
//   removePoint() {
//     if (this.pointGraphic != null) {
//       this.graphicsLayer.remove(this.pointGraphic);
//     }
//   }

//   runTimer() {
//     this.timeoutHandler = setTimeout(() => {
//       // code to execute continuously until the view is closed
//       // ...

//       this.animatePointDemo();
//       this.runTimer();
//     }, 200);
//   }

//   animatePointDemo() {
//     this.removePoint();
//     switch (this.dir) {
//       case 0:
//         this.pointCoords[1] += 0.01;
//         break;
//       case 1:
//         this.pointCoords[0] += 0.02;
//         break;
//       case 2:
//         this.pointCoords[1] -= 0.01;
//         break;
//       case 3:
//         this.pointCoords[0] -= 0.02;
//         break;
//     }

//     this.count += 1;
//     if (this.count >= 10) {
//       this.count = 0;
//       this.dir += 1;
//       if (this.dir > 3) {
//         this.dir = 0;
//       }
//     }

//     this.fbs.syncPointItem(this.pointCoords[1], this.pointCoords[0]);
//     this.addPoint(this.pointCoords[1], this.pointCoords[0], true);
//   }

//   stopTimer() {
//     if (this.timeoutHandler != null) {
//       clearTimeout(this.timeoutHandler);
//       this.timeoutHandler = null;
//     }
//   }

//   connectFirebase() {
//     if (this.isConnected) {
//       return;
//     }
//     this.isConnected = true;
//     this.fbs.connectToDatabase();
//     this.subscriptionList = this.fbs.getChangeFeedList().subscribe((items: ITestItem[]) => {
//       console.log("got new items from list: ", items);
//       this.graphicsLayer.removeAll();
//       for (let item of items) {
//         this.addPoint(item.lat, item.lng, false);
//       }
//     });

    
//     this.subscriptionObj = this.fbs.getChangeFeedObj().subscribe((stat: ITestItem[]) => {
//       console.log("item updated from object: ", stat);
//     });
//   }

//   addPointItem() {
//     console.log("Map center: " + this.view.center.latitude + ", " + this.view.center.longitude);
//     this.fbs.addPointItem(this.view.center.latitude, this.view.center.longitude);

//   }

//   syncPointItem() {
//     console.log("Map COORD: " +this.pointCoords[1] + ", " + this.pointCoords[0]);
//     this.fbs.syncPointItem(10, 100);
//     this.fbs.syncPointItem(this.pointCoords[1], this.pointCoords[0]);
//   }

//   disconnectFirebase() {
//     if (this.subscriptionList != null) {
//       this.subscriptionList.unsubscribe();
//     }
//     if (this.subscriptionObj != null) {
//       this.subscriptionObj.unsubscribe();
//     }
//   }

//   ngOnInit() {
//     // Initialize MapView and return an instance of MapView
//     this.initializeMap().then(() => {
//       // The map has been initialized
//       console.log("mapView ready: ", this.view.ready);
//       this.loaded = this.view.ready;
//       this.mapLoadedEvent.emit(true);
//     });
//   }

//   ngOnDestroy() {
//     if (this.view) {
//       // destroy the map view
//       this.view.container = null;
//     }
//     this.disconnectFirebase();
//   }
// }

/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { setDefaultOptions, loadModules } from 'esri-loader';
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
      const [esriConfig, Map, MapView, FeatureLayer, Graphic, Point, GraphicsLayer, route, RouteParameters, FeatureSet] = await loadModules([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
        "esri/Graphic",
        "esri/geometry/Point",
        "esri/layers/GraphicsLayer",
        "esri/rest/route",
        "esri/rest/support/RouteParameters",
        "esri/rest/support/FeatureSet"
      ]);

      esriConfig.apiKey = "AAPKf969cbae8c8148c3937ebf320cc40c901X6A3d70ocPhfE3Sn6YjpP8kc58Skmb9PaQcJ2CQoJvW3DffxeIFpYVhDPoYL_72";

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