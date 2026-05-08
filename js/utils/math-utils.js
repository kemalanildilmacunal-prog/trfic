// Math Utilities
class MathUtils {
    static distance(v1, v2) {
        return Math.sqrt(
            Math.pow(v1.x - v2.x, 2) +
            Math.pow(v1.y - v2.y, 2) +
            Math.pow(v1.z - v2.z, 2)
        );
    }

    static distance2D(p1, p2) {
        return Math.sqrt(
            Math.pow(p1.x - p2.x, 2) +
            Math.pow(p1.z - p2.z, 2)
        );
    }

    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static randomRange(min, max) {
        return min + Math.random() * (max - min);
    }

    static randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    static getDirectionVector(direction) {
        switch (direction) {
            case 'north': return new THREE.Vector3(0, 0, -1);
            case 'south': return new THREE.Vector3(0, 0, 1);
            case 'east': return new THREE.Vector3(1, 0, 0);
            case 'west': return new THREE.Vector3(-1, 0, 0);
            default: return new THREE.Vector3(0, 0, -1);
        }
    }

    static isIntersecting(box1, box2) {
        return (
            box1.min.x < box2.max.x && box1.max.x > box2.min.x &&
            box1.min.y < box2.max.y && box1.max.y > box2.min.y &&
            box1.min.z < box2.max.z && box1.max.z > box2.min.z
        );
    }

    static raycastIntersection(rayOrigin, rayDirection, box) {
        const tMin = new THREE.Vector3();
        const tMax = new THREE.Vector3();

        for (let i = 0; i < 3; i++) {
            const axis = ['x', 'y', 'z'][i];
            const invDir = 1 / rayDirection[axis];
            let t0 = (box.min[axis] - rayOrigin[axis]) * invDir;
            let t1 = (box.max[axis] - rayOrigin[axis]) * invDir;

            if (invDir < 0) [t0, t1] = [t1, t0];

            tMin[axis] = t0;
            tMax[axis] = t1;
        }

        const tEnter = Math.max(tMin.x, tMin.y, tMin.z);
        const tExit = Math.min(tMax.x, tMax.y, tMax.z);

        return tEnter <= tExit && tExit >= 0;
    }

    static normalizeAngle(angle) {
        while (angle > Math.PI) angle -= 2 * Math.PI;
        while (angle < -Math.PI) angle += 2 * Math.PI;
        return angle;
    }
}