import boto3
import json
import requests

from bs4 import BeautifulSoup

SITE_URL = 'https://gamewith.jp/pokemon-sword-shield/article/show/176712'


def handler(event, context):
    data = fetch_data()
    upload_data_to_s3(data)


def fetch_data():
    html = requests.get(SITE_URL)
    soup = BeautifulSoup(html.text, 'html.parser')
    table = soup.find('div', {'class': 'pokemonSS_table_scroll'}).find('table', {'class': 'sorttable'})
    rows = table.find_all('tr')

    pokemon_list = []
    for row in rows:
        tds = row.find_all('td')
        if len(tds) == 0:
            continue

        name = tds[0].find('a').text
        pokemon = {
            'name': name,
            'h': tds[1].text,
            'a': tds[2].text,
            'b': tds[3].text,
            'c': tds[4].text,
            'd': tds[5].text,
            's': tds[6].text,

        }
        pokemon_list.append(json.dumps(pokemon, ensure_ascii=False))

    return pokemon_list


def upload_data_to_s3(data):
    '''渡されたデータをjson形式でS3にアップロードする'''
    bucket_name = 'awslambdas3stack-mysamplebucket7c61ea24-1xxk7wmvvxoo5'
    s3 = boto3.resource('s3')
    key = 'pokemon/shuzokuchi.json'
    bucket = s3.Object(bucket_name, key)

    bucket.put(Body='\n'.join(data))

