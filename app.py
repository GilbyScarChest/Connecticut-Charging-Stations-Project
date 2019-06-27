# Import Dependencies
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func
from sqlalchemy import Column, Integer, String, Float

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)

from flask_sqlalchemy import SQLAlchemy
import csv
import pandas as pd

#################################################
# Database Setup
#################################################
# Create an engine for the data.sqlite database
engine = create_engine("sqlite:///db/data.sqlite", echo=False)

# reflect an existing database into a new model
Base = automap_base()
#print(Base)
# reflect the tables
Base.prepare(engine, reflect=True)

# This is where we create our tables in the database
Base.metadata.create_all(engine)

# Create our session (link) from Python to the DB
session = Session(engine)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

db = SQLAlchemy(app)

#################################################
# Class Setup
#################################################
class Station():
    __tablename__ = 'stations'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    address = db.Column(db.String(100))
    hours = db.Column(db.String(100))
    level = db.Column(db.String(10))
    region = db.Column(db.Float)
    county = db.Column(db.Integer)
    zipcode = db.Column(db.Integer)
    town_index = db.Column(db.Float)
    coordinates = db.Column(db.String(50))

    def __init__(self, name, address, hours, level, region, county, zipcode, town_index, coordinates):
        self.name = name
        self.address = address
        self.hours = hours
        self.level = level
        self.region = region
        self.county = county
        self.zipcode = zipcode
        self.town_index = town_index
        self.coordinates = coordinates


#################################################
# Load data from CSV to SQLalchemy db using Pandas
#################################################
file_name = 'Resources/Charging_Stations_Clean_2.csv'
df = pd.read_csv(file_name)
df.to_sql(con=engine, index_label='id', name=Station.__tablename__, if_exists='replace')


#################################################
# Routes
#################################################
# create route that loads the home page
@app.route("/")
def welcome():
    return render_template("index.html")


# create route that loads the api data
@app.route("/api/data")
def api():
    # results = db.session.query(
    #         stations.name, 
    #         Station.coordinates,
    #         Station.address,
    #         Station.hours,
    #         Station.level,
    #         Station.region,
    #         Station.county,
    #         Station.zipcode,
    #         Station.town_index).all()

    results = engine.execute('SELECT * FROM stations').fetchall()

    name = [result['Location Name'] for result in results]
    address = [result['Street Address'] for result in results]
    hours = [result['Hours Open'] for result in results]
    level = [result['Level'] for result in results]
    region = [result['Planning Regions'] for result in results]
    county = [result['Counties'] for result in results]
    zipcode = [result['Zip Code'] for result in results]
    town_index = [result['Town Index'] for result in results]
    coordinates = [result['Coordinates'] for result in results]

    # Converting coordinates from string to Float values
    lon = []
    lat = []
    for result in coordinates:
        # split string into lat and lon
        lon1, lat1 = result.split(",")
        # append Floats to lat and lon lists
        lon.append(float(lon1[1:]))
        lat.append(float(lat1[:-1]))

    trace = {
        "Location Name": name,
        "Address": address,
        "Hours": hours,
        "Level": level,
        "Region": region,
        "County": county,
        "Zip Code": zipcode,
        "Town Index": town_index,
        "Lat": lat,
        "Lon": lon
    }

    data = jsonify(trace)

    return data



# Run Server
if __name__ == "__main__":
    app.run()