import json
import boto3
from datetime import datetime


def handler(event, context):
    data = [
        {'id': 1, 'name': 'foo', 'year': '2020', 'month': '02', 'day': '25'},
        {'id': 2, 'name': 'bar', 'year': '2020', 'month': '02', 'day': '25'},
    ]
    upload_data_to_s3(data)

def upload_data_to_s3(data):
    '''渡されたデータをjson形式でS3にアップロードする'''
    bucket_name = 'awslambdas3stack-mysamplebucket7c61ea24-1xxk7wmvvxoo5'
    s3 = boto3.resource('s3')
    now = datetime.now()
    key = 'year={year}/month={month}/day={day}/1.json'.format(
        year=now.strftime('%Y'),
        month=now.strftime('%m'),
        day=now.strftime('%d'),
    )
    bucket = s3.Object(bucket_name, key)
    bucket.put(Body=json.dumps(data, indent=2))

