import eventlet
eventlet.monkey_patch()

from flask import Flask, jsonify, render_template
from flask_socketio import SocketIO, emit
import pandas as pd
import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_cafes')
def get_cafes():
    # 엑셀 파일 읽기
    df = pd.read_excel('cafe_info.xlsx')
    
    # NaN 값을 빈 문자열로 대체
    df = df.replace({np.nan: ''})
    
    # 데이터프레임을 JSON으로 변환
    cafes = df.to_dict(orient='records')
    
    return jsonify(cafes)

@socketio.on('send_message')
def handle_send_message(data):
    message = data['message']
    emit('receive_message', {'message': message}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
