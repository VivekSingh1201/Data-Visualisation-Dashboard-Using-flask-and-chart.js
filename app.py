
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:vivek@localhost/flask1'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
users = {'admin': generate_password_hash('password')}

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

@app.route('/index')
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


@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username in users and check_password_hash(users[username], password):
            session['username'] = username
            flash('Login successful!', 'success')
            return redirect(url_for('index'))
        else:
            flash('Invalid username or password', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)
