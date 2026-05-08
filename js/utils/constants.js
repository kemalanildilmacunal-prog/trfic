// Traffic Simulation Constants
const SIMULATION_CONFIG = {
    SCENE: {
        WIDTH: window.innerWidth,
        HEIGHT: window.innerHeight,
        FOV: 75,
        NEAR: 0.1,
        FAR: 10000,
        BACKGROUND: 0x87ceeb
    },
    INTERSECTION: {
        SIZE: 200,
        LANE_WIDTH: 15,
        LANES_PER_DIRECTION: 3,
        CENTER_X: 0,
        CENTER_Y: 0
    },
    TRAFFIC_LIGHT: {
        LIGHT_SIZE: 3,
        POLE_HEIGHT: 15,
        CYCLE_TIME: 30,
        GREEN_DURATION: 15,
        YELLOW_DURATION: 3,
        RED_DURATION: 12,
        BLINK_SPEED: 0.1
    },
    VEHICLE: {
        CAR_LENGTH: 5,
        CAR_WIDTH: 2.5,
        CAR_HEIGHT: 2,
        AMBULANCE_LENGTH: 6,
        AMBULANCE_WIDTH: 2.5,
        AMBULANCE_HEIGHT: 2.5,
        FIRE_TRUCK_LENGTH: 8,
        FIRE_TRUCK_WIDTH: 3,
        FIRE_TRUCK_HEIGHT: 3.5,
        MAX_SPEED: 30,
        ACCELERATION: 2,
        DECELERATION: 3,
        MIN_DISTANCE: 8,
        SAFE_DISTANCE: 5,
        COLLISION_RADIUS: 3
    },
    TRAFFIC_FLOW: {
        SPAWN_RATE: 0.3,
        MAX_VEHICLES: 150,
        DIRECTIONS: ['north', 'south', 'east', 'west']
    },
    DETECTION: {
        VISION_RANGE: 200,
        AUDIO_RANGE: 150,
        DETECTION_THRESHOLD: 0.7
    },
    CAMERA: {
        FREE: 'free',
        TOP: 'top',
        CLOSE: 'close',
        AMBULANCE: 'ambulance',
        CINEMATIC: 'cinematic'
    },
    TEST_MODES: {
        NORMAL: 'normal',
        SMART: 'smart',
        PRIORITY: 'priority'
    }
};

const DIRECTIONS = {
    NORTH: { x: 0, z: -1, angle: Math.PI / 2, name: 'Kuzey' },
    SOUTH: { x: 0, z: 1, angle: -Math.PI / 2, name: 'Güney' },
    EAST: { x: 1, z: 0, angle: 0, name: 'Doğu' },
    WEST: { x: -1, z: 0, angle: Math.PI, name: 'Batı' }
};

const LIGHT_STATES = {
    RED: 'red',
    YELLOW: 'yellow',
    GREEN: 'green'
};

const COLORS = {
    RED: 0xff0000,
    GREEN: 0x00ff00,
    YELLOW: 0xffff00,
    WHITE: 0xffffff,
    BLACK: 0x000000,
    GRAY: 0x888888,
    ASPHALT: 0x333333,
    LANE_MARKING: 0xffff00,
    AMBULANCE: 0xff4444,
    AMBULANCE_SECONDARY: 0xffffff,
    FIRE_TRUCK: 0xff6600,
    BUILDING: 0xcccccc,
    ROAD: 0x444444
};