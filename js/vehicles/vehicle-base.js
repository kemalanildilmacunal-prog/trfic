// Vehicle Base Class
class Vehicle {
    constructor(scene, position, direction) {
        this.scene = scene;
        this.position = position.clone();
        this.direction = direction;
        this.velocity = new THREE.Vector3();
        this.speed = 0;
        this.targetSpeed = SIMULATION_CONFIG.VEHICLE.MAX_SPEED;
        this.maxSpeed = SIMULATION_CONFIG.VEHICLE.MAX_SPEED;
        this.acceleration = SIMULATION_CONFIG.VEHICLE.ACCELERATION;
        this.deceleration = SIMULATION_CONFIG.VEHICLE.DECELERATION;
        
        this.length = SIMULATION_CONFIG.VEHICLE.CAR_LENGTH;
        this.width = SIMULATION_CONFIG.VEHICLE.CAR_WIDTH;
        this.height = SIMULATION_CONFIG.VEHICLE.CAR_HEIGHT;
        
        this.mesh = null;
        this.wheels = [];
        this.active = true;
        this.isEmergency = false;
        this.emergencyDetected = false;
        
        this.laneOffset = 0;
        this.laneTarget = 0;
        this.intersectionCrossing = false;
        this.waitingForLight = false;
        this.canPass = false;
        
        this.id = Math.random();
        this.createdTime = Date.now();
    }

    createMesh(color) {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        const material = new THREE.MeshLambertMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData = { vehicle: this };
        this.scene.add(this.mesh);
        
        this.createWheels();
    }

    createWheels() {
        const wheelGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.5, 16);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: COLORS.BLACK });
        
        const wheelOffsets = [
            [-this.width / 2 - 0.3, 0.3, -this.length / 3],
            [this.width / 2 + 0.3, 0.3, -this.length / 3],
            [-this.width / 2 - 0.3, 0.3, this.length / 3],
            [this.width / 2 + 0.3, 0.3, this.length / 3]
        ];
        
        wheelOffsets.forEach(offset => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(offset[0], offset[1], offset[2]);
            wheel.castShadow = true;
            this.mesh.add(wheel);
            this.wheels.push(wheel);
        });
    }

    update(deltaTime, traffic) {
        if (!this.active) return;
        
        this.updateBehavior(deltaTime, traffic);
        this.updatePhysics(deltaTime);
        this.updateRotation();
        this.rotateWheels();
        this.checkBounds();
    }

    updateBehavior(deltaTime, traffic) {
        this.updateSpeed(deltaTime, traffic);
        this.updateLanePosition(deltaTime);
    }

    updateSpeed(deltaTime, traffic) {
        const nearbyVehicles = this.getNearbyVehicles(traffic);
        const vehicleAhead = this.findVehicleAhead(nearbyVehicles);
        
        if (vehicleAhead) {
            const distance = this.getDistanceToVehicle(vehicleAhead);
            const minDistance = SIMULATION_CONFIG.VEHICLE.MIN_DISTANCE;
            
            if (distance < minDistance) {
                this.targetSpeed = Math.max(0, vehicleAhead.speed - 2);
            } else {
                this.targetSpeed = this.maxSpeed;
            }
        } else {
            this.targetSpeed = this.maxSpeed;
        }
        
        if (this.speed < this.targetSpeed) {
            this.speed = Math.min(this.speed + this.acceleration * deltaTime, this.targetSpeed);
        } else {
            this.speed = Math.max(this.speed - this.deceleration * deltaTime, this.targetSpeed);
        }
    }

    updateLanePosition(deltaTime) {
        const laneSpeed = 2;
        if (Math.abs(this.laneOffset - this.laneTarget) > 0.1) {
            this.laneOffset += (this.laneTarget - this.laneOffset) * laneSpeed * deltaTime;
        } else {
            this.laneOffset = this.laneTarget;
        }
    }

    updatePhysics(deltaTime) {
        const dirVec = MathUtils.getDirectionVector(this.direction);
        this.velocity = dirVec.multiplyScalar(this.speed);
        this.position.addScaledVector(this.velocity, deltaTime);
        this.mesh.position.copy(this.position);
    }

    updateRotation() {
        const angles = {
            'north': Math.PI / 2,
            'south': -Math.PI / 2,
            'east': 0,
            'west': Math.PI
        };
        this.mesh.rotation.y = angles[this.direction] || 0;
    }

    rotateWheels() {
        const wheelRotation = (this.speed * 0.05) % (Math.PI * 2);
        this.wheels.forEach(wheel => {
            wheel.rotation.x += wheelRotation * 0.016;
        });
    }

    checkBounds() {
        const boundaryDistance = 500;
        if (Math.abs(this.position.x) > boundaryDistance || 
            Math.abs(this.position.z) > boundaryDistance) {
            this.active = false;
            this.scene.remove(this.mesh);
        }
    }

    getNearbyVehicles(traffic, range = 50) {
        return traffic.filter(v => 
            v.id !== this.id &&
            MathUtils.distance2D(this.position, v.position) < range
        );
    }

    findVehicleAhead(nearby) {
        const forward = MathUtils.getDirectionVector(this.direction);
        let closest = null;
        let minDistance = Infinity;
        
        nearby.forEach(vehicle => {
            const toVehicle = new THREE.Vector3().subVectors(vehicle.position, this.position);
            const distance = toVehicle.length();
            const alignment = toVehicle.dot(forward);
            
            if (alignment > 0 && distance < minDistance && Math.abs(toVehicle.y) < 2) {
                minDistance = distance;
                closest = vehicle;
            }
        });
        
        return closest;
    }

    getDistanceToVehicle(vehicle) {
        return MathUtils.distance2D(this.position, vehicle.position);
    }

    checkCollision(other) {
        const distance = MathUtils.distance2D(this.position, other.position);
        const minDistance = SIMULATION_CONFIG.VEHICLE.COLLISION_RADIUS * 2;
        return distance < minDistance;
    }

    deactivate() {
        this.active = false;
        this.scene.remove(this.mesh);
    }
}