const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");
const ws = new WebSocket("ws://localhost:8765");

let dragging = false;
const center = 100;
const maxDist = 70;

joystick.addEventListener("mousedown", startDrag);
joystick.addEventListener("touchstart", startDrag);

document.addEventListener("mouseup", stopDrag);
document.addEventListener("touchend", stopDrag);
document.addEventListener("mousemove", moveStick);
document.addEventListener("touchmove", moveStick);

function startDrag(e) {
  dragging = true;
}

function stopDrag(e) {
  dragging = false;
  stick.style.left = "70px";
  stick.style.top = "70px";
  send(0, 0); // Stop
}

function moveStick(e) {
  if (!dragging) return;

  const rect = joystick.getBoundingClientRect();
  const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left - center;
  const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top - center;

  let dist = Math.min(maxDist, Math.sqrt(x * x + y * y));
  let angle = Math.atan2(y, x);

  const moveX = Math.cos(angle) * dist;
  const moveY = Math.sin(angle) * dist;

  stick.style.left = `${center + moveX - 30}px`;
  stick.style.top = `${center + moveY - 30}px`;

  sendDirection(angle, dist / maxDist);
}

function sendDirection(angle, intensity) {
  let left = 0,
    right = 0;
  const power = 255

  if (angle >= -0.75 && angle <= 0.75) {
    left = power;
    right = 127;
  } else if (angle > 0.75 && angle < 2.35) {
    left = -power;
    right = -power;
  } else if (angle >= 2.35) {
    left = -127;
    right = -power;
  } else if (angle <= -2.35) {
    left = 127;
    right = power;
  } else if (angle > -2.35 && angle < -0.75) {
    left = power;
    right = power;
  }

  if (angle > -0.4 && angle < 0.4 && intensity > 0.6) {
    left = power;
    right = -power;
  } else if (angle > 2.6 || angle < -2.6) {
    left = -power;
    right = power;
  }

  send(left, right);
}

function send(left, right) {
  ws.send(JSON.stringify({ left, right }));
}
