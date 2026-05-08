// Fire Truck Class
class FireTruck extends Vehicle {
    constructor(scene, position, direction) {
        super(scene, position, direction);
        this.type = 'fire-truck';
        this.isEmergency = true;
        this.sirenActive = false;
        this.lights = [];
        this.length = SIMULATION_CONFIG.VEHICLE.FIRE_TRUCK_LENGTH;
        this.width = SIMULATION_CONFIG.VEHICLE.FIRE_TRUCK_WIDTH;
        this.height = SIMULATION_CONFIG.VEHICLE.FIRE_TRUCK_HEIGHT;
        this.maxSpeed = 35;
        this.acceleration = 2.5;
        this.deceleration = 2;
        
        this.createMesh();
        this.createSiren();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        const material = new THREE.MeshLambertMaterial({ color: COLORS.FIRE_TRUCK });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData = { vehicle: this };
        this.scene.add(this.mesh);
        
        const stripeGeometry = new THREE.BoxGeometry(0.3, this.height - 0.2, this.length * 0.4);
        const stripeMaterial = new THREE.MeshLambertMaterial({ color: COLORS.YELLOW });
        
        const stripe1 = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe1.position.set(-this.width / 2 + 0.3, 0, -this.length * 0.15);
        this.mesh.add(stripe1);
        
        const stripe2 = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe2.position.set(this.width / 2 - 0.3, 0, -this.length * 0.15);
        this.mesh.add(stripe2);
        
        this.createWheels();
    }

    createSiren() {
        const lightCount = 4;
        const lightSpacing = this.width / (lightCount + 1);
        
        for (let i = 0; i < lightCount; i++) {
            const light = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 16, 16),
                new THREE.MeshBasicMaterial({ color: COLORS.RED })
            );
            light.position.set(
                -this.width / 2 + lightSpacing * (i + 1),
                this.height / 2 + 0.3,
                0
            );
            this.mesh.add(light);
            this.lights.push(light);
        }
    }

    activateSiren() {
        this.sirenActive = true;
        this.emergencyDetected = true;
    }

    deactivateSiren() {
        this.sirenActive = false;
    }

    updateBehavior(deltaTime, traffic) {
        if (this.isEmergency) {
            this.targetSpeed = this.maxSpeed;
            this.speed = Math.min(this.speed + this.acceleration * deltaTime * 1.3, this.targetSpeed);
        } else {
            super.updateBehavior(deltaTime, traffic);
        }
        
        this.updateSirenLights();
    }

    updateSirenLights() {
        if (!this.sirenActive) return;
        
        const time = Date.now() * 0.004;
        const blink = Math.sin(time) > 0;
        
        this.lights.forEach(light => {
            light.material.intensity = blink ? 2.5 : 0.2;
        });
    }
}