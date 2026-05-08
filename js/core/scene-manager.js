// Scene Manager - Handles Three.js scene setup
class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = null;
        this.renderer = null;
        this.lights = {};
        this.buildings = [];
        this.roads = [];
        this.init();
    }

    init() {
        this.setupRenderer();
        this.setupCamera();
        this.setupLighting();
        this.createEnvironment();
    }

    setupRenderer() {
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: true, 
            alpha: false 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
        this.renderer.setClearColor(0x87ceeb, 1);
    }

    setupCamera() {
        const config = SIMULATION_CONFIG.SCENE;
        this.camera = new THREE.PerspectiveCamera(
            config.FOV,
            config.WIDTH / config.HEIGHT,
            config.NEAR,
            config.FAR
        );
        this.camera.position.set(0, 80, 80);
        this.camera.lookAt(0, 0, 0);
    }

    setupLighting() {
        // Ambient Light
        this.lights.ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(this.lights.ambient);

        // Directional Light (Sun)
        this.lights.directional = new THREE.DirectionalLight(0xffffff, 0.8);
        this.lights.directional.position.set(100, 150, 100);
        this.lights.directional.castShadow = true;
        this.lights.directional.shadow.mapSize.width = 2048;
        this.lights.directional.shadow.mapSize.height = 2048;
        this.lights.directional.shadow.camera.left = -300;
        this.lights.directional.shadow.camera.right = 300;
        this.lights.directional.shadow.camera.top = 300;
        this.lights.directional.shadow.camera.bottom = -300;
        this.lights.directional.shadow.camera.far = 500;
        this.scene.add(this.lights.directional);
    }

    createEnvironment() {
        // Create roads
        this.createRoads();
        
        // Create buildings and scenery
        this.createBuildings();
        
        // Create sidewalks
        this.createSidewalks();
    }

    createRoads() {
        const size = SIMULATION_CONFIG.INTERSECTION.SIZE;
        const laneWidth = SIMULATION_CONFIG.INTERSECTION.LANE_WIDTH;
        const lanesPerDir = SIMULATION_CONFIG.INTERSECTION.LANES_PER_DIRECTION;
        const roadWidth = laneWidth * lanesPerDir;

        // Horizontal road
        const hGeometry = new THREE.PlaneGeometry(size * 2, roadWidth);
        const hMaterial = new THREE.MeshLambertMaterial({ color: COLORS.ASPHALT });
        const hRoad = new THREE.Mesh(hGeometry, hMaterial);
        hRoad.receiveShadow = true;
        hRoad.position.y = 0.01;
        this.scene.add(hRoad);
        this.roads.push(hRoad);

        // Vertical road
        const vGeometry = new THREE.PlaneGeometry(roadWidth, size * 2);
        const vMaterial = new THREE.MeshLambertMaterial({ color: COLORS.ASPHALT });
        const vRoad = new THREE.Mesh(vGeometry, vMaterial);
        vRoad.receiveShadow = true;
        vRoad.position.y = 0.01;
        this.scene.add(vRoad);
        this.roads.push(vRoad);

        // Road markings
        this.createRoadMarkings();
    }

    createRoadMarkings() {
        const size = SIMULATION_CONFIG.INTERSECTION.SIZE;
        const laneWidth = SIMULATION_CONFIG.INTERSECTION.LANE_WIDTH;
        const lanesPerDir = SIMULATION_CONFIG.INTERSECTION.LANES_PER_DIRECTION;
        const roadWidth = laneWidth * lanesPerDir;

        // Create lane markings
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#444444';
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        
        for (let i = 1; i < lanesPerDir; i++) {
            const y = (256 / lanesPerDir) * i;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(256, y);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.repeat.set(size * 2 / roadWidth, 1);
        texture.wrapS = THREE.RepeatWrapping;

        // Apply to roads
        this.roads.forEach(road => {
            road.material.map = texture;
        });
    }

    createBuildings() {
        const buildingPositions = [
            { x: -100, z: -150, w: 80, h: 60, name: 'Kuzey Binası' },
            { x: 100, z: -150, w: 60, h: 80, name: 'Kuzey-Doğu' },
            { x: -100, z: 150, w: 70, h: 70, name: 'Güney-Batı' },
            { x: 100, z: 150, w: 90, h: 50, name: 'Güney-Doğu' },
            { x: 150, z: -80, w: 50, h: 70, name: 'Doğu-Kuzey' },
            { x: 150, z: 80, w: 60, h: 60, name: 'Doğu-Güney' },
            { x: -150, z: -80, w: 70, h: 50, name: 'Batı-Kuzey' },
            { x: -150, z: 80, w: 60, h: 80, name: 'Batı-Güney' }
        ];

        buildingPositions.forEach(pos => {
            const building = new THREE.Mesh(
                new THREE.BoxGeometry(pos.w, pos.h * 1.5, pos.w),
                new THREE.MeshLambertMaterial({ color: COLORS.BUILDING })
            );
            building.position.set(pos.x, pos.h * 0.75, pos.z);
            building.castShadow = true;
            building.receiveShadow = true;
            this.scene.add(building);
            this.buildings.push(building);
        });
    }

    createSidewalks() {
        const size = SIMULATION_CONFIG.INTERSECTION.SIZE;
        const laneWidth = SIMULATION_CONFIG.INTERSECTION.LANE_WIDTH;
        const lanesPerDir = SIMULATION_CONFIG.INTERSECTION.LANES_PER_DIRECTION;
        const roadWidth = laneWidth * lanesPerDir;
        const sidewalkWidth = 8;

        const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0xbbbbbb });

        const sidewalkConfigs = [
            { pos: [0, roadWidth/2 + sidewalkWidth/2, -size/2], scale: [size, sidewalkWidth, sidewalkWidth] },
            { pos: [0, roadWidth/2 + sidewalkWidth/2, size/2], scale: [size, sidewalkWidth, sidewalkWidth] },
            { pos: [size/2, roadWidth/2 + sidewalkWidth/2, 0], scale: [sidewalkWidth, sidewalkWidth, size] },
            { pos: [-size/2, roadWidth/2 + sidewalkWidth/2, 0], scale: [sidewalkWidth, sidewalkWidth, size] }
        ];

        sidewalkConfigs.forEach(config => {
            const sidewalk = new THREE.Mesh(
                new THREE.BoxGeometry(config.scale[0], 0.1, config.scale[2]),
                sidewalkMaterial
            );
            sidewalk.position.set(config.pos[0], 0.05, config.pos[2]);
            sidewalk.receiveShadow = true;
            this.scene.add(sidewalk);
        });
    }

    getScene() {
        return this.scene;
    }

    getRenderer() {
        return this.renderer;
    }

    getCamera() {
        return this.camera;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}