"""Server for FrolfBuddy"""

from flask import (Flask, render_template, request, flash, session, redirect, jsonify, url_for) 
import json
#adding functions for page view
from model import connect_to_db, db
import crud
from datetime import datetime, date
import cloudinary.uploader
import os
from passlib.hash import argon2
# from imagekitio import ImageKit <---- maybe I want to use this later
# imagekit = ImageKit(
#     private_key = 'private_b7/fsyEee8F0XLNLFCnOm/zNbdQ=',
#     public_key = 'public_jLBEeXjMrlyKKT6+lzSfuI8TgzI=',
#     url_endpoint= 'https://ik.imagekit.io/ysh9swsa6'
# )

app = Flask(__name__) 
app.secret_key = os.environ['secret_key']
# app.jinja_env.undefined = StrictUndefined ---??
CLOUDINARY_KEY = os.environ['CLOUDINARY_KEY']
CLOUDINARY_SECRET = os.environ['CLOUDINARY_SECRET']
CLOUD_NAME = "dt9gdwmnb"

#CHECK******************
@app.route("/")
def homepage():
    """main intro page for Brolfr"""
    return render_template('homepage.html')

#CHECK******************
@app.route("/home") # user user_id here
def welcome_page():
    """shows user home page if logged in"""
    if crud.user_logged_in():
        name = session["name"]
        return render_template("welcome.html", name=name)
    else:
         return redirect("/")


# ========================================
# ---- LOGIN ---
# ========================================
#CHECK******************
@app.route("/process-login", methods=["POST"])
def user_login():
    email = request.form.get('email').lower().strip()
    attempt = request.form.get('password')
    user = crud.get_user_by_email(email)
    if not user or not argon2.verify(attempt, user.password):
        flash("Haha, oops: wrong email or password entered. Try again dude.")
        return redirect("/login")
    else:
        session["user_id"] = user.user_id
        session["name"] = user.fname
        flash(f"Hey, {user.fname}!")
        return redirect(f"/home")

#CHECK******************
@app.route("/login")
def show_login():
    if crud.user_logged_in():
       return redirect("/home")
    else:
        return render_template('login.html') 


# ========================================
# --- CREATE ACCOUNT --- 
# ========================================
#CHECK******************
@app.route("/new-account")
def show_new_account_form():
    if crud.user_logged_in():
       flash("Error. User already logged in.")
       return redirect("/")
    else:
        today = date.today()
        return render_template('new-account.html', today=today)

#CHECK******************
@app.route("/create-new-account", methods=["POST"])
def create_new_account():
    fname = request.json.get("fname").strip()
    pronouns = request.json.get("pronouns")
    gender = request.json.get("gender")
    birthday = request.json.get("birthday")
    email = request.json.get("email").lower().strip()
    # process and hash password: 
    password = request.json.get("password")
    hashed_pass = argon2.hash(password)
    date_today  = datetime.now()
    member_since = date_today.strftime("%b %d, %Y")
    photo_link = "https://res.cloudinary.com/dt9gdwmnb/image/upload/v1679869060/squirrel_pciars.png"
    check_email = crud.get_user_by_email(email)
    if not check_email:
        crud.create_user(email, hashed_pass, fname, pronouns, gender, birthday, member_since, photo_link)
        return f"Hey there {fname.title()}, thanks for joining! Please log in!"
    else:
        return f"Error. User email {email} already exists."

# @app.route("/login-help")
# def forgot_password(): #will write later maybe


# ========================================
# --- USER FUNCTIONS --- All functions for seeing session user profile, editing profile, uploading photo, setting location
# ========================================
#------------complete-----------------
@app.route("/profile") #<user_id>
def user_profile():
    if crud.user_logged_in():
        user_info = crud.get_user_by_id(session['user_id'])
        user = crud.turn_one_profile_to_dict(user_info)
        return render_template("user-profile.html", user=user)
    else:
        return redirect("/")
#-----------------------------
#-----------complete------------------
@app.route("/edit-profile")
def edit_profile():
    user = crud.get_user_by_id(session['user_id'])
    return render_template("edit-profile.html", user=user)
#-----------------------------
#----------complete-------------------                        
@app.route("/load-user")
def load_user_details():
    """returns a dictionary of all specifics from session users profile"""
    user_details = crud.get_user_by_id(session['user_id'])
    user = crud.turn_one_profile_to_dict(user_details)
    return jsonify(user)
#-----------------------------

@app.route("/get-states")
def load_states():
    """Loads all US State names for dropdown list"""
    state_list = crud.get_states()
    return jsonify(state_list)

@app.route("/load-cities", methods=["POST"])
def load_cities():
    """returns a list of Cities according to the state user has set"""
    state = request.json.get("user-state")
    city_list = crud.get_all_cities_by_state(state)
    return jsonify(city_list)


#-----------------------------
#CHECK******************
# @app.route("/process-edit", methods=["POST"])
# def process_edit():
#     user = crud.get_user_by_id(session['user_id'])
#     location = request.form.get("user-location") 
#     city_list = crud.get_all_cities()
#     if location not in city_list:
#         flash("Please use autocompleted city only.")
#         return redirect("/edit-profile")
#     crud.edit_profile(user, location)
#     flash("success")
#     return "Successfully Edited Profile!"
@app.route("/get-user-state", methods=["POST"])
def get_user_state():
    """ used for edit profile and profiles search - returns the session users saved state"""
    user = crud.get_user_by_id(session['user_id'])
    return user.state

@app.route("/get-user-city", methods=["POST"])
def get_user_location():
    """ used for edit profile and profiles search - returns the session users saved city"""
    user = crud.get_user_by_id(session['user_id'])
    return user.location

@app.route("/process-city-state", methods=["POST"])
def process_state():
    """ updates user loaction into DB from crud function"""
    user = crud.get_user_by_id(session['user_id'])
    state = request.json.get("user-state").title() 
    check_city_list = crud.get_all_cities_by_state(state)
    location = request.json.get("user-location") 
    if location not in check_city_list:
        return ("error - please only select city from drop down")
    else:
        crud.update_user_location(user, state, location)
        return "Successfully edited your location!!"

@app.route("/process-edit", methods=["POST"])
def process_edit():
    """ processes edit input for profile and updates DB"""
    user = crud.get_user_by_id(session['user_id'])
    age_range_input = request.json.get("age-range") 
    age_range = json.dumps(age_range_input)
    calendar_input = request.json.get("calendar")
    calendar = json.dumps(calendar_input) 
    # calendar = request.json.get("calendar")
    intro_text =  request.json.get("intro-text") 
    skill_level = request.json.get("skill-level") 
    # age_range = request.json.get("age-range") 
    frequented_courses = request.json.get("frequented-courses")
    gender_preference = request.json.get("gender-pref") 
    kids_okay = request.json.get("kids-ok")
    dogs_okay = request.json.get("dogs-ok") 
    friendly_or_stakes_game = request.json.get("friendly-stakes")
    type_of_game = request.json.get("game-type")
    alcohol_okay = request.json.get("alcohol-ok")
    tobacco_okay = request.json.get("tobacco-ok")
    smoke_420_okay = request.json.get("smoke-420-ok")
    crud.update_user_info(user, intro_text, calendar, skill_level, age_range, frequented_courses, gender_preference, kids_okay, dogs_okay, friendly_or_stakes_game, type_of_game, alcohol_okay, tobacco_okay, smoke_420_okay)

    return 'successfully updated profile'

@app.route("/edit-account")
def edit_account():
    """ opens edit account page for account specific edits"""
    user = crud.get_user_by_id(session["user_id"])
    today = date.today()
    return render_template("edit-account.html", user=user, today=today) # today so the calendar does not load in the future

@app.route("/process-edit-account", methods=["POST"])
def process_edit_account():
    """ processes account edit and updates USER db"""
    user = crud.get_user_by_id(session["user_id"])
    fname = request.json.get("fname").strip()
    pronouns = request.json.get("pronouns")
    gender = request.json.get("gender")
    birthday = request.json.get("birthday")
    crud.update_user_account(user,fname, pronouns, gender, birthday)
    flash("success")
    return "success"
        

#CHECK****************** to delete existing photo in cloudinary?
@app.route("/process-photo", methods=["POST"])
def process_photo():
    """ processes user photo to new upload using cloudinary and returns success message - if no photo submitted returns error"""
    user = crud.get_user_by_id(session['user_id'])
    #---- checking if old photo is squirrel default before deleting from cloud-----
    old_photo = user.public_photo_id
    if old_photo != "nc1ekzvocezydot0aa2b":
        cloudinary.uploader.destroy(old_photo, 
            api_key=CLOUDINARY_KEY,
            api_secret=CLOUDINARY_SECRET,
            cloud_name=CLOUD_NAME)
    photo_upload = request.files["form-file"] #grabbing whole file from upload in form
    result = cloudinary.uploader.upload(photo_upload,
        api_key=CLOUDINARY_KEY,
        api_secret=CLOUDINARY_SECRET,
        cloud_name=CLOUD_NAME)
    user.photo_link = result['secure_url']
    user.public_photo_id = result["public_id"]

    if not photo_upload:
        return "photo not uploaded"
    db.session.commit()
    return "successfully uploaded photo"

# ========================================
# ---PROFILE SEARCH--- All functions for searching user profiles and sending a buddy request
# ========================================
#------------complete-----------------
@app.route("/brolfrs")
def show_profiles():
    if crud.user_logged_in():
        return render_template('profiles.html')
    else:
        return redirect("/")
#-----------------------------
#-------------complete----------------
@app.route("/load-profiles")
def load_profiles():
    all_users = crud.get_all_profiles(session['user_id'])
    return jsonify(all_users)

@app.route("/load-users-by-state", methods=["POST"])
def load_users_by_state():
    state = request.json.get("user-state")
    all_users = crud.get_all_profiles_by_state(session['user_id'], state)
    return jsonify(all_users)

@app.route("/load-users-by-city", methods=["POST"])
def load_users_by_city():
    city = request.json.get("user-location").title()
    state = request.json.get("user-state")
    check_city_list = crud.get_all_cities_by_state(state)
    if city not in check_city_list:
        return jsonify(["Error"])
    else:
        all_users = crud.get_all_profiles_by_city_state(session['user_id'], city, state)
        return jsonify(all_users)
    
@app.route("/load-users-by-calendar-match", methods=["POST"])
def load_users_by_calendar_match():
    city = request.json.get("user-location").title()
    state = request.json.get("user-state")
    check_city_list = crud.get_all_cities_by_state(state)
    if city not in check_city_list:
        return jsonify(["Error"])
    else:
        calendar_input = request.json.get("calendar")
        all_users = crud.get_all_profiles_by_calendar(session['user_id'], city, state, calendar_input)
        return jsonify(all_users)



#----------complete-------------------
@app.route("/send-buddy-request", methods=["POST"])
def request_buddy():
    user_id_1 = session["user_id"]
    user_id_2 = request.json.get("user-request-id")
    user_id_2 = int(user_id_2)
    user_2 = crud.get_user_by_id(user_id_2)
    create_match = crud.create_buddy_request(user_id_1, user_id_2)
    if create_match:
        return  f"request sent to {user_2.fname}!"
    else:
        return  f"cannot request {user_2.fname}!"
#-----------------------------


# ========================================
# --- BUDDY MATCHES --- All functions for seeing current buddies, denying the buddy after match, , viewing denied buddy page, and opening chat
# ========================================
#------------complete-----------------

@app.route("/buddies")
def show_user_matches():
    if crud.user_logged_in():
        return render_template("show-buddies.html")
    else:
        return redirect("/")
#-----------------------------
#-------------complete----------------
@app.route("/get-buddies")
def show_buddies():
   all_buddies = crud.get_accepted_buddies(session['user_id'])
   return jsonify(all_buddies)
#-----------------------------
#-------------complete----------------
@app.route("/deny-buddy-again", methods=["POST"])
def deny_buddy_again():
    user_id_1 = session["user_id"]
    user_id_2 = request.json.get("buddy-deny-again-id")
    user_id_2 = int(user_id_2)
    user_2 = crud.get_user_by_id(user_id_2)
    buddy_id = crud.get_buddy_id_from_user_ids(user_id_2, user_id_1)
    crud.deny_buddy_again(buddy_id, user_id_1)
    # committing in the crud file ^
    return  f"No longer buds {user_2.fname}!"
#-----------------------------


# ========================================
# - REQUESTS-- All functions for seeing current buddy requests, denying the buddy after match, , viewing denied buddy page, and opening chat
# ========================================
#-------------complete----------------
@app.route("/requests")
def show_buddy_requests():
    if crud.user_logged_in():
        return render_template('requests.html')
    else:
        return redirect("/")
 #-----------------------------
#------------complete-----------------   
@app.route('/get-requests')
def get_requests():
    """function for retrieving all pending buddy requests for session user"""
    pending_buddies = crud.get_all_pending_buddies(session['user_id'])
    return jsonify(pending_buddies)
#-----------------------------

# ========================================
# All functions for re-adding/ re-accepting previously denied buddies
# ========================================
#------------complete-----------------
@app.route("/denied-buddies")
def open_denied_buddies():
    if crud.user_logged_in():
        return render_template('rejections.html')
    else:
        return redirect("/")
#-----------------------------
#-------------complete----------------    
@app.route("/show-denied-buddies")
def show_denied_buddies():
    denied_buddies = crud.get_all_rejected_buddies(session['user_id'])
    return jsonify(denied_buddies)
#-----------------------------
#------------complete-----------------
@app.route("/accept-buddy", methods=["POST"])
def accept_buddy():
    user_id_1 = session["user_id"]
    user_id_2 = request.json.get("buddy-accept-id")
    user_id_2 = int(user_id_2)
    user_2 = crud.get_user_by_id(user_id_2) #for the confirmation message
    buddy_id = crud.get_buddy_id_from_user_ids(user_id_2, user_id_1)
    crud.accept_buddy_request(buddy_id)
    # committing in the crud file ^
    
    return  f"Now buds with {user_2.fname}!"
#-----------------------------

# ========================================
# All functions for seeing current buddies, denying the buddy after match, and opening chat
# ========================================

#-------------complete----------------
@app.route("/accept-buddy-again", methods=["POST"])
def accept_buddy_again():
    user_id_1 = session["user_id"]
    user_id_2 = request.json.get("buddy-accept-again-id")
    user_id_2 = int(user_id_2)
    user_2 = crud.get_user_by_id(user_id_2) #for the confirmation message
    buddy_id = crud.get_buddy_id_from_user_ids(user_id_2, user_id_1)
    crud.accept_buddy_again(buddy_id, user_id_1)
    
    return  f"Now buds again with {user_2.fname}!"
#-----------------------------
#------------complete-----------------
@app.route("/deny-buddy", methods=["POST"])
def deny_buddy():
    user_id_1 = session["user_id"]
    user_id_2 = request.json.get("buddy-deny-id")
    user_id_2 = int(user_id_2)
    user_2 = crud.get_user_by_id(user_id_2)
    buddy_id = crud.get_buddy_id_from_user_ids(user_id_2, user_id_1)
    crud.deny_buddy_request(buddy_id)
    # committing in the crud file ^
    return  f"Rejected {user_2.fname}!"
#-----------------------------

# @app.route("/chat", methods = ["POST"]) #no js
# def open_buddy_chat():
#     user_id_1 = session["user_id"]
#     user_id_2 = request.json.get("chat-buddy-id")
#     user_id_2 = int(user_id_2)
#     # user_2 = crud.get_user_by_id(user_id_2)
#     buddy_id = crud.get_buddy_id_from_user_ids(user_id_2, user_id_1)
#     # return redirect (f"/chat/{buddy_id}")
#     return f"/chat/{buddy_id}"
    
#--------------complete---------------
@app.route("/chats") 
def show_open_chats():
    if crud.user_logged_in():
        return render_template('all-chats.html')
    else:
        return redirect("/")
#-----------------------------

# @app.route("/load-chats") 
# def load_chats():
#     chat_list = crud.get_chat_by_user_id(session["user_id"])
#     return jsonify(chat_list)

#CHECK******************  
# @app.route("/chat/<buddy_id>")
# def show_buddy_chat(buddy_id):
#     user_1 = crud.get_user_by_id(session["user_id"])
#     buddy = crud.get_buddy_from_id(buddy_id)
#     user_2 = crud.get_other_user_id_from_buddy(buddy, user_1.user_id)
#     chat_messages = crud.get_chats_by_buddy(buddy)
#     return render_template('chat.html', user_1 = user_1, user_2 = user_2, chat_messages=chat_messages, buddy_id=buddy_id)

@app.route("/chat/<buddy_id>")
def show_buddy_chat(buddy_id):
    user_1 = crud.get_user_by_id(session["user_id"])
    buddy = crud.get_buddy_from_id(buddy_id)
    user_2_id = crud.get_other_user_id_from_buddy(buddy, user_1.user_id)
    user_2 = crud.get_user_by_id(user_2_id)
    return render_template('chat-2.html', buddy_id=buddy_id, user_1 = user_1.user_id, user_2 = user_2.user_id, user_2name = user_2.fname)

@app.route("/load-buddy-chats", methods = ["POST"])
def load_buddy_chats():
    buddy_input = request.json.get("buddy-id")
    buddy = crud.get_buddy_from_id(buddy_input)
    chat_messages = crud.get_chats_by_buddy(buddy)
    return jsonify(chat_messages)

#CHECK******************
@app.route("/send-message", methods=["POST"])
def send_message():
    sender_id = session["user_id"]
    user = crud.get_user_by_id(session["user_id"])
    receiver_id = request.json.get("receiver-id")
    buddy_id = request.json.get("buddy-id")

    sender_name = user.fname
    message = request.json.get("send-message")
    time = datetime.now()
    time_stamp = time.strftime("%a, %b %d, %Y %I:%M %p")
    crud.create_chat(buddy_id, sender_id, receiver_id, sender_name, message, time_stamp)
    return "sent"

#CHECK******************
@app.route("/sign-out")
def sign_user_out():
    """signs the user out - automatically keeps session data saved"""
    if crud.user_logged_in(): 
        session.pop("user_id")
        flash("Thanks for coming!")
    else:
       flash("Not logged in. Cannot sign out.")
    return redirect("/")


if __name__ == "__main__":
    with app.app_context():
        connect_to_db(app) 
         #setting up server host for running app
        app.run(host="0.0.0.0", debug=True)