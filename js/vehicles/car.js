// Regular Car Class
class Car extends Vehicle {
    constructor(scene, position, direction) {
        super(scene, position, direction);
        this.type = 'car';
        this.maxSpeed = SIMULATION_CONFIG.VEHICLE.MAX_SPEED;
        this.acceleration = SIMULATION_CONFIG.VEHICLE.ACCELERATION;
        this.deceleration = SIMULATION_CONFIG.VEHICLE.DECELERATION;
        this.createMesh(0xff6b6b);
    }

    updateBehavior(deltaTime, traffic) {
        super.updateBehavior(deltaTime, traffic);
        this.handleTrafficLights();
        this.avoidCollisions(traffic);
    }

    handleTrafficLights(trafficLights) {
        if (Math.abs(this.position.x) < 50 && Math.abs(this.position.z) < 50) {
            this.intersectionCrossing = true;
        } else {
            this.intersectionCrossing = false;
        }
    }

    avoidCollisions(traffic) {
        const nearby = this.getNearbyVehicles(traffic, 20);
        
        nearby.forEach(vehicle => {
            if (this.checkCollision(vehicle)) {
                this.targetSpeed = 0;
            }
        });
    }
}