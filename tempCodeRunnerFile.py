
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:vivek@localhost/flask1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    intensity = db.Column(db.Integer)
    likelihood = db.Column(db.Integer)
    relevance = db.Column(db.Integer)
    year = db.Column(db.Integer)
    country = db.Column(db.String(100))
    topics = db.Column(db.String(100))
    region = db.Column(db.String(100))
    eyear = db.Column(db.Integer)
    sector = db.Column(db.String(100))
    pestle = db.Column(db.String(100))
    source = db.Column(db.String(100))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    data = Data.query.all()
    data_list = [
        {
            'intensity': d.intensity,
            'likelihood': d.likelihood,
            'relevance': d.relevance,
            'year': d.year,
            'country': d.country,
            'topics': d.topics,
            'region': d.region,
            'eyear': d.eyear,
            'sector': d.sector,
            'pestle': d.pestle,
            'source': d.source,
        }
        for d in data
    ]
    return jsonify(data_list)

if __name__ == '__main__':
    app.run(debug=True)
