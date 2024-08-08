let car;
let walls = [];
let lidar;
let carImage;

function setup() {
    createCanvas(windowWidth, windowHeight);
    preload();  // Load the car image before setting up the canvas

    // Create the car in the center of the canvas
    car = new Car(width / 16, height / 2, 40, 40, carImage);
    car.setRotation(-PI / 2);
    // Create a loop-like map that scales with the screen size
    createLoopMap();

    // LiDAR
    lidar = new LiDAR(car, 300, 20);
}

function preload() {
    // Load the car image before setting up the canvas
    carImage = loadImage('car.png'); // Make sure the image is in the correct path
}

function draw() {
    background(220);

    // Display the walls
    for (let wall of walls) {
        wall.show();
    }

    // Update and display the car
    car.update();
    car.show();

    // Update and display LiDAR
    lidar.update(walls);
    lidar.show();

    // Run the wall-following algorithm
    wallFollowingAlgorithm();
}

function createLoopMap() {
    let margin = 50;
    let loopWidth = width - 2 * margin;
    let loopHeight = height - 2 * margin;

    // Outer loop
    walls.push(new Boundary(margin, margin, width - margin, margin));
    walls.push(new Boundary(width - margin, margin, width - margin, height - margin));
    walls.push(new Boundary(width - margin, height - margin, margin, height - margin));
    walls.push(new Boundary(margin, height - margin, margin, margin));

    // Inner loop (smaller square inside)
    let innerMargin = 200;
    walls.push(new Boundary(innerMargin, innerMargin, width - innerMargin, innerMargin));
    walls.push(new Boundary(width - innerMargin, innerMargin, width - innerMargin, height - innerMargin));
    walls.push(new Boundary(width - innerMargin, height - innerMargin, innerMargin, height - innerMargin));
    walls.push(new Boundary(innerMargin, height - innerMargin, innerMargin, innerMargin));

    // Connect inner and outer loops
    // walls.push(new Boundary(margin, height / 2, innerMargin, height / 2));
    // walls.push(new Boundary(width - margin, height / 2, width - innerMargin, height / 2));
}

function wallFollowingAlgorithm() {
    let distances = lidar.getDistances();

    // Adjust the turning speed based on proximity to the walls
    let turnSpeed = 0.03; // Base turn speed

    // Turn faster if the car is closer to the wall
    if (distances.left < 75) {
        car.turn(turnSpeed * (75 / distances.left));  // Turn right more sharply
    } else if (distances.right < 75) {
        car.turn(-turnSpeed * (75 / distances.right));  // Turn left more sharply
    }

    car.move(2);
}


// Car class
class Car {
    constructor(x, y, width, height, img) {
        this.pos = createVector(x, y);
        this.width = width;
        this.height = height;
        this.heading = 0; // Direction in radians
        this.img = img; // Car image
        this.imageRotationOffset = PI / 2;
    }

    update() {
        // Add any movement or physics here
    }

    turn(angle) {
        this.heading += angle;
    }

    setRotation(angle) {
        this.heading = angle;
    }

    move(speed) {
        this.pos.x += cos(this.heading) * speed;
        this.pos.y += sin(this.heading) * speed;
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.heading + this.imageRotationOffset); // Add the offset to the heading
        imageMode(CENTER);
        image(this.img, 0, 0, this.width, this.height); // Draw the car image
        pop();
    }
}

// Boundary class for walls
class Boundary {
    constructor(x1, y1, x2, y2) {
        this.a = createVector(x1, y1);
        this.b = createVector(x2, y2);
    }

    show() {
        stroke(0);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}

// LiDAR class
class LiDAR {
    constructor(car, range, resolution) {
        this.car = car;
        this.range = range;
        this.resolution = resolution;  // Number of rays
        this.rays = [];
        this.distances = {};
    }

    update(walls) {
        this.rays = [];
        this.distances = { left: Infinity, right: Infinity };

        // Define a wider angle range for more readings
        let angleRange = PI * 3 / 4; // 90 degrees in total (45 degrees to the left and right)

        // Adjust for finer resolution and wider angle range
        for (let i = -angleRange / 2; i <= angleRange / 2; i += angleRange / this.resolution) {
            let rayAngle = this.car.heading + i;
            let ray = this.castRay(rayAngle, walls);
            this.rays.push(ray);

            // Update the closest distances for left and right
            if (i < 0) this.distances.left = min(this.distances.left, ray.dist);
            else if (i > 0) this.distances.right = min(this.distances.right, ray.dist);
        }
    }

    castRay(angle, walls) {
        let ray = { x: this.car.pos.x, y: this.car.pos.y, angle: angle, dist: this.range };
        let end = p5.Vector.fromAngle(angle).setMag(this.range).add(this.car.pos);
        for (let wall of walls) {
            let pt = this.cast(wall.a, wall.b, this.car.pos, end);
            if (pt) {
                let d = dist(this.car.pos.x, this.car.pos.y, pt.x, pt.y);
                if (d < ray.dist) {
                    ray.dist = d;
                    ray.x = pt.x;
                    ray.y = pt.y;
                }
            }
        }
        return ray;
    }

    cast(a, b, c, d) {
        const den = (a.x - b.x) * (c.y - d.y) - (a.y - b.y) * (c.x - d.x);
        if (den == 0) return;
        const t = ((a.x - c.x) * (c.y - d.y) - (a.y - c.y) * (c.x - d.x)) / den;
        const u = -((a.x - b.x) * (a.y - c.y) - (a.y - b.y) * (a.x - c.x)) / den;
        if (t > 0 && t < 1 && u > 0) {
            return createVector(
                a.x + t * (b.x - a.x),
                a.y + t * (b.y - a.y)
            );
        }
        return null;
    }

    show() {
        stroke(255, 0, 0, 100);
        for (let ray of this.rays) {
            line(this.car.pos.x, this.car.pos.y, ray.x, ray.y);
        }
    }

    getDistances() {
        return this.distances;
    }
}
