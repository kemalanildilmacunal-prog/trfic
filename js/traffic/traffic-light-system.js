// Traffic Light System
class TrafficLightSystem {
    constructor(scene) {
        this.scene = scene;
        this.lights = {};
        this.lightObjects = {};
        this.states = {
            north: LIGHT_STATES.RED,
            south: LIGHT_STATES.RED,
            east: LIGHT_STATES.RED,
            west: LIGHT_STATES.RED
        };
        this.cycleTime = 0;
        this.blinkTime = 0;
        this.config = SIMULATION_CONFIG.TRAFFIC_LIGHT;
        this.createTrafficLights();
    }

    createTrafficLights() {
        const directions = ['north', 'south', 'east', 'west'];
        const positions = {
            north: [0, -100, -15],
            south: [0, 100, 15],
            east: [100, 0, 0],
            west: [-100, 0, 0]
        };

        directions.forEach(dir => {
            this.createTrafficLightForDirection(dir, positions[dir]);
        });
    }

    createTrafficLightForDirection(direction, position) {
        const group = new THREE.Group();
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.5, 0.5, this.config.POLE_HEIGHT, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: COLORS.BLACK });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = this.config.POLE_HEIGHT / 2;
        pole.castShadow = true;
        group.add(pole);

        // Light box
        const boxGeometry = new THREE.BoxGeometry(this.config.LIGHT_SIZE, this.config.LIGHT_SIZE * 3.5, this.config.LIGHT_SIZE);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: COLORS.BLACK });
        const lightBox = new THREE.Mesh(boxGeometry, boxMaterial);
        lightBox.position.y = this.config.POLE_HEIGHT - 2;
        lightBox.castShadow = true;
        group.add(lightBox);

        // Red light
        const redGeometry = new THREE.SphereGeometry(this.config.LIGHT_SIZE * 0.4, 32, 32);
        const redMaterial = new THREE.MeshBasicMaterial({ color: COLORS.RED });
        const redLight = new THREE.Mesh(redGeometry, redMaterial);
        redLight.position.set(
            position[0],
            this.config.POLE_HEIGHT - 1.5,
            position[2]
        );
        redLight.userData.direction = direction;
        redLight.userData.state = LIGHT_STATES.RED;
        this.scene.add(redLight);

        // Yellow light
        const yellowGeometry = new THREE.SphereGeometry(this.config.LIGHT_SIZE * 0.4, 32, 32);
        const yellowMaterial = new THREE.MeshBasicMaterial({ color: COLORS.YELLOW });
        const yellowLight = new THREE.Mesh(yellowGeometry, yellowMaterial);
        yellowLight.position.set(
            position[0],
            this.config.POLE_HEIGHT - 0.5,
            position[2]
        );
        yellowLight.userData.direction = direction;
        yellowLight.userData.state = LIGHT_STATES.YELLOW;
        this.scene.add(yellowLight);

        // Green light
        const greenGeometry = new THREE.SphereGeometry(this.config.LIGHT_SIZE * 0.4, 32, 32);
        const greenMaterial = new THREE.MeshBasicMaterial({ color: COLORS.GREEN });
        const greenLight = new THREE.Mesh(greenGeometry, greenMaterial);
        greenLight.position.set(
            position[0],
            this.config.POLE_HEIGHT + 0.5,
            position[2]
        );
        greenLight.userData.direction = direction;
        greenLight.userData.state = LIGHT_STATES.GREEN;
        this.scene.add(greenLight);

        group.position.set(position[0], 0, position[2]);
        this.scene.add(group);

        this.lightObjects[direction] = {
            group: group,
            lights: { red: redLight, yellow: yellowLight, green: greenLight },
            materials: {
                red: redMaterial,
                yellow: yellowMaterial,
                green: greenMaterial
            }
        };
    }

    setState(direction, state) {
        if (!this.lightObjects[direction]) return;

        this.states[direction] = state;
        const lights = this.lightObjects[direction].lights;
        
        lights.red.material.intensity = state === LIGHT_STATES.RED ? 1.5 : 0.3;
        lights.yellow.material.intensity = state === LIGHT_STATES.YELLOW ? 1.5 : 0.3;
        lights.green.material.intensity = state === LIGHT_STATES.GREEN ? 1.5 : 0.3;
    }

    setAllRed() {
        ['north', 'south', 'east', 'west'].forEach(dir => {
            this.setState(dir, LIGHT_STATES.RED);
        });
    }

    setDirectionGreen(direction) {
        this.setAllRed();
        this.setState(direction, LIGHT_STATES.GREEN);
    }

    update(deltaTime) {
        this.cycleTime += deltaTime;
        this.blinkTime += deltaTime;

        this.updateLightIntensities();
    }

    updateLightIntensities() {
        ['north', 'south', 'east', 'west'].forEach(dir => {
            const lights = this.lightObjects[dir].lights;
            const state = this.states[dir];
            
            const blink = Math.sin(this.blinkTime * Math.PI / this.config.BLINK_SPEED) > 0 ? 1 : 0.3;
            
            lights.red.material.intensity = state === LIGHT_STATES.RED ? 1.5 * blink : 0.1;
            lights.yellow.material.intensity = state === LIGHT_STATES.YELLOW ? 1.5 * blink : 0.1;
            lights.green.material.intensity = state === LIGHT_STATES.GREEN ? 1.5 * blink : 0.1;
        });
    }

    getState(direction) {
        return this.states[direction];
    }

    getLightEmoji(direction) {
        const state = this.states[direction];
        switch (state) {
            case LIGHT_STATES.RED: return '🔴';
            case LIGHT_STATES.YELLOW: return '🟡';
            case LIGHT_STATES.GREEN: return '🟢';
            default: return '❓';
        }
    }
}