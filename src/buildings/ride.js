import { Vehicle } from "../vehicles/vehicle.js";
import { City } from "../city.js";
import config from "../config.js";
import { Zone } from "./zone.js";

export class Ride extends Zone {
  constructor(x, y, subType) {
    super(x, y);
    this.name = "ride";
    this.type = "ride";

    this.subType = subType;

    if (this.subType === '') {
      const rideSubTypes = Object.keys(thrillLevelMapping);
      const i = Math.floor(rideSubTypes.length * Math.random());
      this.subType = rideSubTypes[i];
    }

    this.accumulatedRevenue = 0;
    this.thrillLevel = config.ride.thrillLevel[this.subType];
    this.installationCost = config.ride.costInstallation[this.subType];
    this.ticketPrice = config.ride.ticketPrice[this.subType];
    this.rideDuration = config.ride.rideDuration[this.subType];
    this.rideCapacity = config.ride.rideCapacity[this.subType];

    this.lastRunTime = 0;
    
    /**
     * The current state of the Ride
     * @type {'idle' | 'in operation'}
     */
    this.state = 'idle';
    

    /**
     * The visitors in the waiting area
     * @type {Vehicle[]}
     */
    this.waitingVisitors = [];

    /**
     * The visitors currently on the ride
     * @type {Vehicle[]}
     */
    this.loadedVisitors = [];

  }

  /**
   * Steps the state of the zone forward in time by one simulation step
   * @param {City} city
   */
  step(city) {
    super.step(city);

    // If the ride is idle
    if (this.state === "idle") {
      if (this.waitingVisitors.length > 0) {
        // If the ride is idle and have visitors in the waiting area
        const numberToLoad = Math.min(this.waitingVisitors.length, this.rideCapacity);

        // Move visitors from waiting area to loaded area
        const visitorsToLoad = this.waitingVisitors.slice(0,numberToLoad);
        this.loadedVisitors = visitorsToLoad;

        for (let i = 0; i < numberToLoad; i++) {
          this.waitingVisitors.shift();
        }

        // Update the lastRunTime & ride State
        this.lastRunTime = city.currentSimulationTime;
        this.state = 'in operation';

        // Update mesh status
        // TODO: in asset manager, set the material color to indicate it's busy
        this.isMeshOutOfDate = true;
      }
    }

    // If the ride is in operation
    if (this.state === 'in operation') {
      
      if (city.currentSimulationTime >= this.lastRunTime + this.rideDuration) {
        // if the last run has done

        // 1. Record the revenue
        this.accumulatedRevenue += this.ticketPrice * this.loadedVisitors.length;

        // Release the visitors **TODO** (reset the visitor starting and destination)
        // 2. reset the visitor starting & destination
        this.#releaseVisitors(this.loadedVisitors);
        // 3. Update the state
        this.state = 'idle';

        //Update mesh status
        this.isMeshOutOfDate = true;
      }
    }
  }

  /**
   * Handles any clean up needed before a building is removed
   */
  dispose() {
    super.dispose();
  }


  /**
   * When the ride run is finished, release the currently loaded visitors.
   * @param {Vehicle[]} loadedVisitors 
   */
  #releaseVisitors(loadedVisitors) {    
    // set a new destination for visitor when released.
    loadedVisitors.forEach(visitor => {

      // update the rides
      visitor.visitedRides.push(this);

      // try finding the next ride destination for the visitor
      const nextRideTarget = visitor.findNextRidePath(visitor.origin, visitor.rideTiles);

      if (nextRideTarget == null) {
      // set the destination to entrance (exit) if no such rides & change the isLeaving state
        visitor.isLeaving = true;
        // find the path to exit
        const exitTarget = visitor.findExitPath(visitor.origin, visitor.entranceTile);
        if (exitTarget == null) {
          console.log("could not find path to exit, exit tile: ", visitor.entranceTile);
          visitor.destination = null; // it will get disposed during the next update cycle
        }
        else {
          console.log(`Sending ${visitor.name} to exit`, exitTarget);
          visitor.finalDestinationRideNode = exitTarget.destinationNode;
          visitor.finalDestinationRidceTile = exitTarget.entranceTile;
          visitor.pathToDestinationRideNode = exitTarget.pathToDestination;
          visitor.destination = visitor.pathToDestinationRideNode[1];
        }
      } else {
        // set the new destination 
        console.log("next ride target", nextRideTarget.nextRideTile.building.subType);
        visitor.finalDestinationRideNode = nextRideTarget.destinationNode;
        visitor.finalDestinationRideTile = nextRideTarget.nextRideTile;
        visitor.pathToDestinationRideNode = nextRideTarget.pathToDestination;
        visitor.destination = visitor.pathToDestinationRideNode[1];
      }

      // update the position and cycle time & reset isPaused
      visitor.updateWorldPositions();
      visitor.cycleStartTime = Date.now();
      visitor.isPaused = false;

      // revert the mesh style (opacity = 1, visibility = true )
      visitor.children[0].visible = true;
    })


    // set the loadedVisitors to empty. 
    this.loadedVisitors = [];
  }
  


  /**
   * Returns an HTML representation of this object
   * @returns {string}
   */
  toHTML() {
    let html = super.toHTML();
    html += `
    <span class="info-label">Thrill Level </span>
    <span class="info-value">${this.thrillLevel}</span>
    <br>
    <span class="info-label">Installation Cost </span>
    <span class="info-value">$ ${this.installationCost}</span>
    <br>
    <span class="info-label">Ticket Price per Visitor </span>
    <span class="info-value">$ ${this.ticketPrice}</span>
    <br>
    <span class="info-label">Ride Duration </span>
    <span class="info-value">${this.rideDuration} mins</span>
    <br>
    <span class="info-label">Ride Capacity </span>
    <span class="info-value">${this.rideCapacity} pax</span>
    <br>
    <span class="info-label">Number of Waiting Visitors </span>
    <span class="info-value">${this.waitingVisitors.length} pax</span>
    <br>
    <span class="info-label">Number of Loaded Visitors </span>
    <span class="info-value">${this.loadedVisitors.length} pax</span>
    <br>
    <span class="info-label">Ride Status </span>
    <span class="info-value">${this.state}</span>
    <br>
    <span class="info-label">Revenue </span>
    <span class="info-value">$ ${this.accumulatedRevenue}</span>
    <br>
    `;
    html += '<ul class="info-citizen-list">';
    for (const waitingVisitor of this.waitingVisitors) {
      html += waitingVisitor.toHTML();
    }
    html += '</ul>';
    html += '<ul class="info-citizen-list">';
    for (const loadedVisitor of this.loadedVisitors) {
      html += loadedVisitor.toHTML();
    }
    html += '</ul>';
    return html;
  }
}
