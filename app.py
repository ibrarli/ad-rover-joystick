import eventlet
eventlet.monkey_patch()

from flask import Flask, render_template
from flask_socketio import SocketIO

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("move")
def handle_move(data):
    left = data.get("left", 0)
    right = data.get("right", 0)
    print(f"[MOTOR] Left: {left}, Right: {right}")

if __name__ == "__main__":
    print("[✅] Flask + SocketIO server is running!")
    print("👉 Open: http://192.168.16.112:500")
    socketio.run(app, host="0.0.0.0", port=500)
