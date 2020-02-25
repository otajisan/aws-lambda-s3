import json
import boto3
from datetime import date


def handler(event, context):
    data = [
        {'id': 1, 'name': 'foo'},
        {'id': 2, 'name': 'bar'},
    ]
    upload_data_to_s3(data)

def upload_data_to_s3(data):
    '''渡されたデータをjson形式でS3にアップロードする'''
    bucket_name = 'awslambdas3stack-mysamplebucket7c61ea24-1xxk7wmvvxoo5'
    s3 = boto3.resource('s3')
    today = date.today()
    key = '{year}/{month}/{day}.json'.format(
        year=today.year,
        month=today.month,
        day=today.day,
    )
    bucket = s3.Object(bucket_name, key)
    bucket.put(Body=json.dumps(data, indent=2))

