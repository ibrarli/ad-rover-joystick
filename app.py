import eventlet
import serial
from flask_socketio import SocketIO
from flask import Flask, render_template

eventlet.monkey_patch()

port = '/dev/ttyACM0'
baud = 115200

opencr = serial.Serial(port=port, baudrate=baud)

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("move")
def handle_move(data):
    left = data.get("left", 0)
    right = data.get("right", 0)
    opencr.write(f'o {left} {right}\r\n'.encode())

if __name__ == "__main__":
    print("[✅] Flask + SocketIO server is running!")
    print("👉 Open: http://192.168.16.112:6000")
    socketio.run(app, host="0.0.0.0", port=5000)
