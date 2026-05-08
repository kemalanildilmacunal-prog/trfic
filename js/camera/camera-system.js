// Camera System - Multiple camera modes
class CameraSystem {
    constructor(camera, container) {
        this.camera = camera;
        this.container = container;
        this.mode = SIMULATION_CONFIG.CAMERA.FREE;
        this.targetPos = new THREE.Vector3();
        this.targetLookAt = new THREE.Vector3(0, 0, 0);
        
        this.mouseDown = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetRotationX = 0;
        this.targetRotationY = 0;
        
        this.cinemaAngle = 0;
        this.orbitRadius = 150;
        this.orbitHeight = 60;
        
        this.setupControls();
    }

    setupControls() {
        this.container.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.container.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('wheel', (e) => this.onMouseWheel(e));
    }

    onMouseDown(e) {
        if (this.mode !== SIMULATION_CONFIG.CAMERA.FREE) return;
        
        this.mouseDown = true;
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    onMouseUp(e) {
        this.mouseDown = false;
    }

    onMouseMove(e) {
        if (!this.mouseDown || this.mode !== SIMULATION_CONFIG.CAMERA.FREE) return;
        
        const deltaX = e.clientX - this.mouseX;
        const deltaY = e.clientY - this.mouseY;
        
        this.targetRotationY += deltaX * 0.005;
        this.targetRotationX += deltaY * 0.005;
        this.targetRotationX = MathUtils.clamp(this.targetRotationX, -Math.PI/2, Math.PI/2);
        
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }

    onMouseWheel(e) {
        e.preventDefault();
        
        if (this.mode === SIMULATION_CONFIG.CAMERA.FREE) {
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            const zoomSpeed = 5;
            
            if (e.deltaY > 0) {
                this.camera.position.addScaledVector(direction, zoomSpeed);
            } else {
                this.camera.position.addScaledVector(direction, -zoomSpeed);
            }
        }
    }

    setMode(mode) {
        this.mode = mode;
    }

    update(deltaTime, ambulancePos, firetruckPos) {
        switch (this.mode) {
            case SIMULATION_CONFIG.CAMERA.FREE:
                this.updateFreeCamera();
                break;
            case SIMULATION_CONFIG.CAMERA.TOP:
                this.updateTopCamera();
                break;
            case SIMULATION_CONFIG.CAMERA.CLOSE:
                this.updateCloseCamera();
                break;
            case SIMULATION_CONFIG.CAMERA.AMBULANCE:
                this.updateAmbulanceFollowCamera(ambulancePos);
                break;
            case SIMULATION_CONFIG.CAMERA.CINEMATIC:
                this.updateCinematicCamera(deltaTime);
                break;
        }
    }

    updateFreeCamera() {
        const rotSpeed = 0.1;
        this.camera.rotation.order = 'YXZ';
        this.camera.rotation.y += (this.targetRotationY - this.camera.rotation.y) * rotSpeed;
        this.camera.rotation.x += (this.targetRotationX - this.camera.rotation.x) * rotSpeed;
    }

    updateTopCamera() {
        this.camera.position.set(0, 200, 0);
        this.camera.lookAt(0, 0, 0);
    }

    updateCloseCamera() {
        this.camera.position.set(30, 20, 30);
        this.camera.lookAt(0, 5, 0);
    }

    updateAmbulanceFollowCamera(ambulancePos) {
        if (!ambulancePos) return;
        
        const offset = new THREE.Vector3(0, 10, -20);
        const targetPos = ambulancePos.clone().add(offset);
        
        this.camera.position.lerp(targetPos, 0.1);
        
        const lookTarget = ambulancePos.clone();
        lookTarget.y += 2;
        this.camera.lookAt(lookTarget);
    }

    updateCinematicCamera(deltaTime) {
        this.cinemaAngle += deltaTime * 0.5;
        
        const radius = this.orbitRadius;
        const height = this.orbitHeight;
        
        this.camera.position.x = Math.cos(this.cinemaAngle) * radius;
        this.camera.position.y = height + Math.sin(this.cinemaAngle * 0.5) * 20;
        this.camera.position.z = Math.sin(this.cinemaAngle) * radius;
        
        this.camera.lookAt(0, 5, 0);
    }

    getModeString() {
        const modeNames = {
            [SIMULATION_CONFIG.CAMERA.FREE]: 'Serbest Kamera',
            [SIMULATION_CONFIG.CAMERA.TOP]: 'Üstten Görünüm',
            [SIMULATION_CONFIG.CAMERA.CLOSE]: 'Yakın Görünüm',
            [SIMULATION_CONFIG.CAMERA.AMBULANCE]: 'Ambulans İzle',
            [SIMULATION_CONFIG.CAMERA.CINEMATIC]: 'Sinematik'
        };
        return modeNames[this.mode] || 'Bilinmiyor';
    }
}