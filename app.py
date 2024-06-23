import eventlet
eventlet.monkey_patch()

from flask import Flask, jsonify, render_template
from flask_socketio import SocketIO, emit
import pandas as pd
import numpy as np
import os

app = Flask(__name__, template_folder='.')
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode='eventlet')

# 채팅 메시지를 저장할 리스트
chat_messages = []

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

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('send_message')
def handle_send_message(data):
    message = data['message']
    username = data['username']
    
    # 메시지를 채팅 리스트에 추가
    chat_messages.append({'username': username, 'message': message})
    
    # 모든 클라이언트에게 메시지 전송
    emit('receive_message', {'username': username, 'message': message}, broadcast=True)

@socketio.on('get_messages')
def handle_get_messages():
    # 채팅 메시지 리스트 전송
    emit('chat_messages', chat_messages)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
