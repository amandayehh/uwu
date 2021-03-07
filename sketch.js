let noseX = 0;
let noseY = 0;
let nosesX = [];
let nosesY = [];


let leftEyeX = 0;
let leftEyeY = 0;

let rightEyeX = 0;
let rightEyeY = 0;

let fAngle = 0;

let textS = 50;

let lerpV = 0.4;

let gotPose = false;



function setup() {
  createCanvas(windowHeight * 1.4, windowHeight);
  video = createCapture(VIDEO);
  video.size(height * 1.4, height);
  video.hide();

  const poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses)
}

function modelLoaded() {
}

function gotPoses(poses) {
  if (poses.length > 0) {
    let newNoseX = poses[0].pose.keypoints[0].position.x;
    let newNoseY = poses[0].pose.keypoints[0].position.y;
    noseX = lerp(noseX, newNoseX, lerpV);
    noseY = lerp(noseY, newNoseY, lerpV);
    nosesX.push(noseX);
    nosesY.push(noseY);


    let newLeftEyeX = poses[0].pose.keypoints[1].position.x;
    let newLeftEyeY = poses[0].pose.keypoints[1].position.y;
    leftEyeX = lerp(leftEyeX, newLeftEyeX, lerpV);
    leftEyeY = lerp(leftEyeY, newLeftEyeY, lerpV);

    let newRightEyeX = poses[0].pose.keypoints[2].position.x;
    let newRightEyeY = poses[0].pose.keypoints[2].position.y;
    rightEyeX = lerp(rightEyeX, newRightEyeX, lerpV);
    rightEyeY = lerp(rightEyeY, newRightEyeY, lerpV);

    if (rightEyeY > leftEyeY) {
      newAngle = ((asin((rightEyeY - leftEyeY) / dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY))) * 57.2958);
    } else if (rightEyeY < leftEyeY) {
      newAngle = asin((leftEyeY - rightEyeY) / dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY)) * -57.2958;
    }

    fAngle = lerp(fAngle, newAngle, 0.1);

    textS = map(dist(leftEyeX, leftEyeY, rightEyeX, rightEyeY), 0, width * 0.7, 0, 500);
    gotPose = true;


  } else {
    gotPose = false;
  }


}

function draw(poses) {

  push();
  translate(video.width, 0);
  scale(-1.0, 1.0);
  image(video, 0, 0, width, height);

  fill(255);
  noStroke();



  if (gotPose == true) {
    textSize(textS);

    push();
    translate(video.width, 0);
    scale(-1.0, 1.0);
    push();
    translate((width - noseX - textS / 2) - (fAngle), noseY - ((rightEyeX - leftEyeX) * map(abs(fAngle), 0, 50, 0.7, 1)));
    rotate(radians(fAngle));
    text("W", 0, 0);
    pop();


    push();
    translate(width - leftEyeX - textS / 2, leftEyeY + textS / 2);
    rotate(radians(fAngle));
    text("U", 0, 0);
    pop();

    push();
    translate(width - rightEyeX - textS / 2, rightEyeY + textS / 2);
    rotate(radians(fAngle));
    text("U", 0, 0);
    pop();



    pop();


  }

}
