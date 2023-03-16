"""adding users to test and """

import os # operating system - establishes interaction between the user and the operating system


import crud
import model
from random import choice
from datetime import date

from server import app

os.system("dropdb frolfers")
os.system("createdb frolfers")


# model.connect_to_db(server.app) #connecting to server.py flask
# model.db.create_all() #creating all tables

# i just want to add users!
#adding test users below:
mario_test_users = ["Wario", "Luigi", "Yoshi", "Princess", "Goomba", "Bowser", "Birdo", "Toad", "Mario", "Hammerbro"]

def add_test_users():
    for user in mario_test_users:
        email = f"{user}@testing.com".lower()
        password = "testing"
        fname = f"{user}"
        pronouns = choice(["(she/her)", "(he/him)", "(they/them)", "(he/they)", "(she/they)"])
        gender = choice(["man", "woman", "non-binary", "other"])
        birthday = choice(["12/25/1989", "1/2/2000", "3/6/1975"])
        member_since = date.today()


        user = crud.create_user(email, password, fname, pronouns, gender, birthday, member_since)
    #     model.db.session.add(user)

    # model.db.session.commit()

# with app.app_context():

def add_profile_specifics():
    """adding specifics to the users profile"""
    for user in mario_test_users:
        user = crud.get_user_by_email(f"{user.lower()}@testing.com")
        user.photo_link = f"/static/images/{user.fname.lower()}.jpeg"
        user.intro_text = f"Hi, I'm {user.fname}! Let's Play!"
        user.calendar = "nothing for now"
        user.location = choice(["Sacramento", "San Francisco", "Chicago", "San Diego", "Oakland", "Roseville"])
        user.skill_level = choice(["Beginner", "Intermediate", "Advanced"])
        user.age_range = choice(["18-25", "26-30", "31-35", "36-40", "41-50", "51+"])
        user.frequented_courses = choice(["Hooker Oak", "Peregrine Point", "Golden Gate Park", "Oyster Bay", "John Mackey", "Bijou", "Lagoon Valley", "Anderson Valley", "Your mom"])
        user.gender_preference = choice(["men", "women", "all genders"])
        user.kids_okay = choice([True, False])
        user.dogs_okay = choice([True, False])
        user.friendly_or_stakes_game = choice(["Friendly game", "Stakes game", "Friendly and Stakes"])
        user.type_of_game = choice(["Full Course", "Front 9", "Back 9", "No preference"])
        user.alcohol_okay = choice([True, False])
        user.tobacco_okay = choice([True, False])
        user.smoke_420_okay = choice([True, False])

        model.db.session.commit()

def seed_city_data(filename):
    # city_data = {}
    with open (filename) as file:
        for line in file:
            city_details = line.strip().split(",")
            city = f"{city_details[0]}, {city_details[1]}"
            state_id = city_details[1]
            state_name = city_details[2]
            county_fips = city_details[3]
            county_name = f"{city_details[4]}, {city_details[1]}"
            lat = city_details[5]
            lng = city_details[6]
            timezone = city_details[7]
            zips = city_details[8].strip().split(" ")
        
            city = crud.create_city(
                city,
                state_id,
                state_name,
                county_fips,
                county_name,
                lat,
                lng,
                timezone,
                zips
            )
            model.db.session.add(city)

    model.db.session.commit()
    

with app.app_context():
    model.connect_to_db(app)
    model.db.create_all()
    add_test_users()
    add_profile_specifics()
    seed_city_data("static/data/usa_city_data.txt")
    


# # is __name__ == .... needed here?
# if __name__ == "__main__":#importing app from server.py (flask)
#     from server import app
#     with app.app_context():
#         model.connect_to_db(app)
#         model.db.create_all() #creating all tables