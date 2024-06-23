import pandas as pd
import json

# xlsx 파일 읽기
df = pd.read_excel('cafe_info.xlsx')

# JSON 형식으로 변환
json_data = df.to_json(orient='records', force_ascii=False)

# JSON 파일로 저장
with open('cafe_info.json', 'w', encoding='utf-8') as file:
    file.write(json_data)