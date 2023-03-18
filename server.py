"""Server for FrolfBuddy"""

from flask import (Flask, render_template, request, flash, session, redirect, jsonify, url_for) 
#adding functions for page view
from model import connect_to_db, db
import crud
from datetime import datetime
import cloudinary.uploader
import os

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
CLOUD_NAME = "dxxwltu0a"

#CHECK******************
@app.route("/")
def homepage():
    """main intro page for Brolfr"""
    return render_template('homepage.html')

#CHECK******************
@app.route("/home/<user_id>") # user user_id here
def welcome_page(user_id):
    """shows user home page if logged in"""
    if crud.user_logged_in():
        name = session["name"]
        return render_template("welcome.html", name=name)
    else:
         return redirect("/")

#CHECK******************
@app.route("/process-login", methods=["POST"])
def user_login():
    email = request.form.get('email').lower().strip()
    password = request.form.get('password')
    user = crud.get_user_by_email(email)

    if not user or user.password != password:
        flash("Haha, oops: wrong email or password entered. Try again dude.")
        return redirect("/login")
    else:
        session["user_id"] = user.user_id
        session["name"] = user.fname
        flash(f"Hey, {user.fname}!")
        return redirect(f"/home/{user.user_id}")

#CHECK******************
@app.route("/login")
def show_login():
    if crud.user_logged_in():
       return redirect(f"/home/{session['user_id']}")
    else:
        return render_template('login.html') 

#CHECK******************
@app.route("/new-account")
def show_new_account_form():
    return render_template('new-account.html')

#CHECK******************
@app.route("/create-new-account", methods=["POST"])
def create_new_account():
    fname = request.form.get("fname").strip()
    pronouns = request.form.get("pronouns")
    gender = request.form.get("gender")
    birthday = request.form.get("birthday")
    email = request.form.get("email").lower().strip()
    password = request.form.get("password")
    date_today  = datetime.now()
    member_since = date_today.strftime("%b %d, %Y")
    check_email = crud.get_user_by_email(email)
    if not check_email:
        crud.create_user(email, password, fname, pronouns, gender, birthday, member_since)
        flash(f"Hey there {fname.title()}, thanks for joining! Please log in!")
        return redirect("/login")
    else:
        flash(f"Error. User email {email} already exists.")
        return redirect('/create-new-account')

# @app.route("/login-help")
# def forgot_password(): #will write later

#------------complete-----------------
@app.route("/profile") #<user_id>
def user_profile():
    if crud.user_logged_in():
        user = crud.get_user_by_id(session['user_id'])
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
    user_details = crud.get_user_by_id(session['user_id'])
    user = crud.turn_one_profile_to_dict(user_details)
    return jsonify(user)
#-----------------------------
#------------complete-----------------
@app.route("/load-cities")
def load_cities():
    city_list = crud.get_all_cities()
    return jsonify(city_list)
# @app.route("/load-cities")
# def load_cities():
#     user_input = request.args.get("userInput")
#     city_list = crud.get_all_cities()
#     for city in city_list:
#         if user_input in city:
#     return jsonify(city_list)
#-----------------------------
#CHECK******************
@app.route("/process-edit", methods=["POST"])
def process_edit():
    user = crud.get_user_by_id(session['user_id'])
    location = request.form.get("user-location") 
    city_list = crud.get_all_cities()
    if location not in city_list:
        flash("Please use autocompleted city only.")
        return redirect("/edit-profile")
    crud.edit_profile(user, location)
    flash("success")
    return "Successfully Edited Profile!"

#CHECK******************
@app.route("/process-photo", methods=["POST"])
def process_photo():
    user = crud.get_user_by_id(session['user_id'])
    photo_upload = request.files["form-file"] #grabbing whole file from upload in form
    result = cloudinary.uploader.upload(photo_upload,
        api_key=CLOUDINARY_KEY,
        api_secret=CLOUDINARY_SECRET,
        cloud_name=CLOUD_NAME)
    user.photo_link = result['secure_url']

    if not photo_upload:
        flash("photo not uploaded")
        return redirect("/edit-profile")
    # user.photo_link = photo_link
    db.session.commit()
    # flash("success")
    # return redirect("/edit-profile")
    return "successfully uploaded photo"

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
#-----------------------------
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
    pending_buddies = crud.get_all_pending_buddies(session['user_id'])
    return jsonify(pending_buddies)
#-----------------------------
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
@app.route("/chat/<buddy_id>")
def show_buddy_chat(buddy_id):
    user_1 = crud.get_user_by_id(session["user_id"])
    buddy = crud.get_buddy_from_id(buddy_id)
    user_2 = crud.get_other_user_id_from_buddy(buddy, user_1.user_id)
    chat_messages = crud.get_chats_by_buddy(buddy)
    return render_template('chat.html', user_1 = user_1, user_2 = user_2, chat_messages=chat_messages)

#CHECK******************
@app.route("/send-message", methods=["POST"])
def send_message():
    sender_id = session["user_id"]
    user = crud.get_user_by_id(session["user_id"])
    receiver_id = request.json.get("receiver-id")
    message = request.json.get("send-message")
    sender_name = user.fname
    time = datetime.now()
    time_stamp = time.strftime("%a, %b %d, %Y %I:%M %p")
    buddy_id = crud.get_buddy_id_from_user_ids(sender_id, receiver_id)
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