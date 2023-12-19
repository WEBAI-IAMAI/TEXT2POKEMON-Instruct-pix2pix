from flask import Flask, request, jsonify, render_template, send_from_directory
import re
import os
import logging
from model import generate_image

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)


app = Flask(__name__, static_url_path='/static')



@app.route('/', methods=['GET'])
def home():
    logging.debug("Home route accessed")  # 로깅
    message = "Hello from Flask!"
    return send_from_directory('templates', 'index.html')
    
   

# 상태 관리를 위한 간단한 변수 (실제 구현에서는 데이터베이스나 다른 메커니즘을 사용해야 할 수 있음)

image_loading_status = {}

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        logging.debug("Submit route accessed with POST method")
        data = request.json

        if data:
            imageUrl = f"static/image/testA/{data['pokemonId']}.jpg"
            prompt = data['prompt']

            # 이미지 생성 작업 시작
            generate_image(checkpoint_path="./pix2pokemon", 
                           image_path=imageUrl,
                           prompt=prompt,
                           result_path="static/result")

            # 이미지 생성 상태를 'True'로 설정
            image_loading_status[data['pokemonId']] = True
            return jsonify(loading=True)
        else:
            return jsonify(loading=False, message="No data received"), 400

    else:  # GET 요청 처리
        logging.debug("Submit route accessed with GET method")
        pokemonId = request.args.get('pokemonId')

        if pokemonId and pokemonId in image_loading_status:
            # 이미지 생성 상태 반환
            loading = image_loading_status[pokemonId]
            return jsonify(loading=loading)
        else:
            return jsonify(message="Pokemon ID not provided or invalid"), 400

if __name__ == "__main__":
    app.run('0.0.0.0', port=5003, debug=True)




# @app.route('/submit', methods=['GET', 'POST'])
# def submit():
#     logging.debug("Submit route accessed with POST method")  # 로깅
#     data = {
#       "prompt": "",
#       "pokemonId": ""
#     }
#     received_data = request.json # json형태의 딕셔너리 파이썬딕셔너리로 변환

#     if received_data: # None이 아니면
#         data.update(received_data) # 업데이트 
    
#     # JSON 형태로 데이터를 받습니다.
#     #data = request.json
#     #prompt = data.get('prompt')
#     #ImageID = data.get('ImageID')
    
#     print(data)
    
    
#     imageUrl = f"static/image/testA/{data['pokemonId']}.jpg"
#     prompt = data['prompt']

#     generate_image(checkpoint_path = "./pix2pokemon", 
#                                      image_path = imageUrl,  # 이미지 경로
#                                      prompt = prompt,  # 사용자 입력 텍스트
#                                      result_path = "templates/result") # 저장 디렉토리
    
#     return jsonify(loading=False)
    
    
    
#     logging.debug(f"Received data: {data}")  # 로깅x``
#     return jsonify({"message": "제출 성공"}) # 응답 될 경우 json형태로 응답 반환

# # 이미지 생성 라우트
# @app.route('/generate_image', methods=['POST'])
# def generate_image():
#     logging.debug("generate_image route accessed with POST method")  # 로깅
#     data = {
#       "prompt": "",
#       "pokemonId": ""
#     }
#     received_data = request.json # json형태의 딕셔너리 파이썬딕셔너리로 변환

#     if received_data: # None이 아니면
#         data.update(received_data) # 업데이트 
    
#     image_path = 
#     prompt = 
#     # 이미지 생성 함수를 호출하여 이미지를 생성
#     generated_image = generate_image(checkpoint_path = "./pix2pokemon", 
#                                      image_path = imageUrl,  # 이미지 경로
#                                      prompt = prompt,  # 사용자 입력 텍스트
#                                      result_path = "templates/result") # 저장 디렉토리

    

#     return jsonify(success=True)  # 이미지 생성이 성공했음을 클라이언트에게 알림


if __name__ == "__main__": # 직접 실행 (python app.py)해야지 서버 구동 되도록 하는 코드 
    app.run('0.0.0.0', port=5003, debug=True)

########################################################################################################
