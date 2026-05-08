// Ambulance Class
class Ambulance extends Vehicle {
    constructor(scene, position, direction) {
        super(scene, position, direction);
        this.type = 'ambulance';
        this.isEmergency = true;
        this.sirenActive = false;
        this.lights = [];
        this.sirenSound = null;
        this.maxSpeed = 40;
        this.acceleration = 3;
        this.deceleration = 2.5;
        
        this.createMesh();
        this.createSiren();
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(this.width, this.height, this.length);
        const material = new THREE.MeshLambertMaterial({ color: COLORS.AMBULANCE });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.mesh.userData = { vehicle: this };
        this.scene.add(this.mesh);
        
        const stripeGeometry = new THREE.BoxGeometry(this.width - 0.2, 0.3, this.length * 0.3);
        const stripeMaterial = new THREE.MeshLambertMaterial({ color: COLORS.AMBULANCE_SECONDARY });
        const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
        stripe.position.z = -this.length * 0.2;
        stripe.position.y = 0.5;
        this.mesh.add(stripe);
        
        this.createWheels();
    }

    createSiren() {
        const redLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshBasicMaterial({ color: COLORS.RED })
        );
        redLight.position.set(-this.width / 3, this.height / 2 + 0.5, 0);
        this.mesh.add(redLight);
        this.lights.push(redLight);
        
        const blueLight = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0x0066ff })
        );
        blueLight.position.set(this.width / 3, this.height / 2 + 0.5, 0);
        this.mesh.add(blueLight);
        this.lights.push(blueLight);
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
            this.speed = Math.min(this.speed + this.acceleration * deltaTime * 1.5, this.targetSpeed);
        } else {
            super.updateBehavior(deltaTime, traffic);
        }
        
        this.updateSirenLights();
    }

    updateSirenLights() {
        if (!this.sirenActive) return;
        
        const time = Date.now() * 0.003;
        const blink = Math.sin(time) > 0;
        
        this.lights.forEach(light => {
            light.material.intensity = blink ? 2 : 0.3;
        });
    }

    playSiren() {
        if (!this.sirenSound) {
            this.createSirenSound();
        }
    }

    createSirenSound() {
        // Placeholder - would implement Web Audio API
    }
}