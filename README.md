This project is a data visualization dashboard built using Flask, featuring interactive charts and graphs, a dark mode option, and a user login page for authentication.

## Features

- Interactive data visualization using Chart.js
- Dark mode support
- User authentication with login page

## Requirements

- Python
- MySQL
- Flask
- Flask-Login
- Flask-Bcrypt
- Flask-SQLAlchemy

## Usage

- DATABASE_URL = 'mysql+mysqlconnector://root:vivek@localhost/flask1' in both app.py and db_setup.py you have to make changes according to your sysytem in this line.
- First run db_setup.py for storing the json data in MySQL
- Then run app.py

### Login

1. Open the login page at `http://127.0.0.1:5000`.
2. Enter your username:'admin' and password:'password'.

## File Descriptions

- `app.py`: The main application file that sets up the Flask server and routes.
- `templates/index.html`: The main dashboard page with data visualizations.
- `templates/login.html`: The login page for user authentication.
- `static/app.css`: The stylesheet for the application.
- `static/images/logo.png`: The logo image displayed on the login page.

## Acknowledgements

- Flask documentation: https://flask.palletsprojects.com/
- Chart.js documentation: https://www.chartjs.org/docs/latest/
- Bootstrap documentation: https://getbootstrap.com/docs/4.6/getting-started/introduction/