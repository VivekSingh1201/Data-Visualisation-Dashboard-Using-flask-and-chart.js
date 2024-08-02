
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String
import json

DATABASE_URL = 'mysql+mysqlconnector://root:vivek@localhost/flask1'

engine = create_engine(DATABASE_URL)
metadata = MetaData()

data_table = Table(
    'data', metadata,
    Column('id', Integer, primary_key=True, autoincrement=True),
    Column('intensity', Integer),
    Column('likelihood', Integer),
    Column('relevance', Integer),
    Column('start_year', Integer),
    Column('end_year', Integer),
    Column('country', String(100)),
    Column('topics', String(100)),
    Column('region', String(100)),
    Column('sector', String(100)),
    Column('pestle', String(100)),
    Column('source', String(255)),
)

metadata.drop_all(engine, [data_table])
metadata.create_all(engine)

def convert_to_int(value):
    try:
        return int(value) if value != '' else None
    except (ValueError, TypeError):
        return None

def convert_to_str(value):
    return value if value != '' else None

with engine.begin() as connection:
    try:
        with open('jsondata.json', encoding='utf-8') as f:
            data = json.load(f)
            for entry in data:
                insert_statement = data_table.insert().values(
                    intensity=convert_to_int(entry.get('intensity')),
                    likelihood=convert_to_int(entry.get('likelihood')),
                    relevance=convert_to_int(entry.get('relevance')),
                    start_year=convert_to_int(entry.get('start_year')),
                    end_year=convert_to_int(entry.get('end_year')),
                    country=convert_to_str(entry.get('country')),
                    topics=convert_to_str(entry.get('topic')),
                    region=convert_to_str(entry.get('region')),
                    sector=convert_to_str(entry.get('sector')),
                    pestle=convert_to_str(entry.get('pestle')),
                    source=convert_to_str(entry.get('source')),
                )
                connection.execute(insert_statement)
                print(f"Inserted entry: {entry}")
    except Exception as e:
        print(f"An error occurred: {e}")

with engine.connect() as connection:
    result = connection.execute(data_table.select()).fetchall()
    for row in result:
        print(row)
