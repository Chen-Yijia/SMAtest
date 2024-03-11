export default {
  citizen: {
    minWorkingAge: 16,        // Minimum working age for a citizen
    retirementAge: 65,        // Age when citizens retire
    maxJobSearchDistance: 4   // Max distance a citizen will search for a job
  },
  vehicle: {
    speed: 0.0005,            // The distance travelled per millisecond
    fadeTime: 1000,           // The start/end time where the vehicle should fade
    maxLifetime: 10000,       // Maximum lifetime of a vehicle
    maxVehicleCount: 10,      // Maximum number of vehicles in scene at any one time
    spawnInterval: 10000,       // How often vehicles are spawned in milliseconds
    probAdult: 0.6,           // probability that the visitor is adult
    probKid: 0.2,             // probability that the visitor is kid
    probElder: 0.2            // probability that the visitor is elder
  },
  zone: {
    abandonmentThreshold: 10, // Number of days before abandonment
    abandonmentChance: 0.25,  // Probability of building abandonment
    developmentChance: 0.25,  // Probability of building development
    maxRoadSearchDistance: 3, // Max distance between buildng and road
    maxResidents: 2,          // Max # of residents in a house
    maxWorkers: 2,            // Max # of workers at a building
    residentMoveInChance: 0.5 // Chance for a resident to move in
  },
  road: {
    costPerTile: 500,     // The construction cost to build a road tile
  },
  ride: {
    costInstallation: {
      "circus-tent": 2000,
      "water-ride": 3000,
      "bumper-car": 2000,
      "ferris-wheel": 3500,
      "roundabout": 2500,
      "carousel": 2000,
      "swing-claw": 3000,
      "space-adventure": 2500,
      "rollercoaster": 3000,
      "arcade": 2000,
    },
    ticketPrice: {
      "circus-tent": 3,
      "water-ride": 5,
      "bumper-car": 5,
      "ferris-wheel": 3,
      "roundabout": 3,
      "carousel": 3,
      "swing-claw": 5,
      "space-adventure": 3,
      "rollercoaster": 5,
      "arcade": 3,
    }
  },
  stand: {
    costInstallation: {
      "hot-dog": 200,
      "burger": 300,
      "cafe": 500,
      "chinese-restaurant": 600,
      "ice-cream": 200,
    },
    arpc: { // Average Revenue Per Customer 
      "hot-dog": 2,
      "burger": 7,
      "cafe": 8,
      "chinese-restaurant": 10,
      "ice-cream": 1,
    }
  }
}
