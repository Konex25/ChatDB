from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import text2sql

print("This is TalkToYourData app.")


app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('process')
def handle_process(data):
    try:
        ddl = data.get('ddl', '')
        nlPrompt = data.get('nlPrompt', '')

        if not ddl or not nlPrompt:
            emit('response', {"error": "ddl or nlPrompt missing in the received JSON"})
            return
        
        sqlQuery = text2sql.getQuery(ddl, nlPrompt)
        
        emit('response', {"sqlQuery": sqlQuery})
    except Exception as e:
        emit('response', {"error": str(e)})

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
