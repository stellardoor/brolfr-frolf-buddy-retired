"""just here to put get functions aka CRUD (create, read, update, delete)"""


from model import db, User, Buddy, Chat, City,  connect_to_db

import server 

# missing import ^  Chat

#join example from skillstest:
# animals = Animal.query.options(db.joinedload("human")).filter(Animal.animal_species == animal_species).all()


def create_user(email, password, fname, pronouns, gender, birthday, member_since):
    user = User(
        email=email, 
        password=password, 
        fname=fname,
        pronouns = pronouns, 
        gender = gender,
        birthday = birthday,
        member_since=member_since,
        )
    db.session.add(user)
    db.session.commit()

def update_user_info(user_id, photo_link, intro_text, calendar, location, skill_level, age_range, frequented_courses, gender_preference, kids_okay, dogs_okay, friendly_or_stakes_game, type_of_game, alcohol_okay, tobacco_okay, smoke_420_okay):
    user = get_user_by_id(user_id)
    user.photo_link = photo_link, 
    user.intro_text = intro_text,
    user.calendar = calendar, 
    user.location = location, 
    user.skill_level = skill_level, 
    user.age_range = age_range,
    user.frequented_courses = frequented_courses,
    user.gender_preference = gender_preference,
    user.kids_okay = kids_okay, 
    user.dogs_okay = dogs_okay, 
    user.friendly_or_stakes_game = friendly_or_stakes_game,
    user.type_of_game = type_of_game,
    user.alcohol_okay = alcohol_okay, 
    user.tobacco_okay = tobacco_okay,
    user.smoke_420_okay = smoke_420_okay

    db.session.commit()

def user_logged_in():
    """checks if user is logged in"""
    if "user_id" in server.session:
        return True
    else:
        return False

def get_user_by_email(email):
    return User.query.filter(User.email == email).first()

def get_user_by_id(user_id):
    return User.query.filter(User.user_id == user_id).first()

def get_buddy_from_id(buddy_id):
    return Buddy.query.filter(Buddy.buddy_id == buddy_id).first()

def get_other_user_id_from_buddy(buddy, user_id):
    """gets the other user from session user in a buddy match"""
    if buddy.user_id_1 == user_id:
        user_2 = get_user_by_id(buddy.user_id_2)
    elif buddy.user_id_2 == user_id:
        user_2 = get_user_by_id(buddy.user_id_1)
    return user_2

def get_all_cities():
    all_cities = City.query.all()
    city_list = []
    for city in all_cities:
        city_list.append(f"{city.city}, {city.state_id}")
    return city_list

def edit_profile(user, location):
    user.location = location
    db.session.commit()

def get_all_profiles(user_id):
    """pulls all users that are not logged in user, not rejected, requested, or already matched buddies"""
    users = User.query.filter(db.not_(User.user_id == user_id)).all()
    buddies  = get_all_buddy_user_ids(user_id)
    profiles_data = []
    for user in users:
        if user.user_id not in buddies:
            profiles_data.append(user)
    return profiles_data
        
def get_all_buddy_user_ids(user_id):
    '''returns a list of user ids that are matched with session user'''
    # grabbing all buddies of session user >
    buddies = Buddy.query.filter(db.or_(Buddy.user_id_1 == user_id, Buddy.user_id_2 == user_id)).all()
    buddy_list = []
    for buddy in buddies:
        if buddy.user_id_1 == user_id:
            buddy_list.append(buddy.user_id_2)
        elif buddy.user_id_2 == user_id:
            buddy_list.append(buddy.user_id_1)
    return buddy_list

def get_accepted_buddies(user_id):
    "pulls buddies that are instantiated as a Buddy as of now - filters out session user, rejected buds"
    buddies = Buddy.query.filter(db.or_(Buddy.user_id_1 == user_id, Buddy.user_id_2 == user_id)).all()
    print(buddies)
    buddy_data = []
    for buddy in buddies:
        if buddy.accepted == True:
            if buddy.user_id_1 == user_id:
                user = get_user_by_id(buddy.user_id_2)
                buddy_data.append(user)
            elif buddy.user_id_2 == user_id:
                user = get_user_by_id(buddy.user_id_1)
                buddy_data.append(user)
    return buddy_data

def get_all_pending_buddies(user_id):
    """pulls buddies that are instantiated as a Buddy and have not been accepted by other user yet"""
    buddies = Buddy.query.filter(Buddy.user_id_2 == user_id).all()
    buddy_data = []
    for buddy in buddies:
        if buddy.pending == True:
            user = get_user_by_id(buddy.user_id_1)
            buddy_data.append(user)
        else:
            continue
    return buddy_data


def get_all_rejected_buddies(user_id):
    """pulls buddies that are instantiated as a Buddy and have been rejected by other buddy"""
    buddies = Buddy.query.filter(Buddy.user_id_2 == user_id).all()
    buddy_data = []
    for buddy in buddies:
        if buddy.rejected == True:
            if buddy.user_id_2 == user_id:
                user = get_user_by_id(buddy.user_id_1)
                buddy_data.append(user)
        else:
            continue
    return buddy_data

            
def create_buddy_request(user_id_1, user_id_2):
    #just putting this here to prevent duplicates at the source:
    check_buddy = get_buddy_id_from_user_ids(user_id_1, user_id_2)
    if not check_buddy:
        buddies = Buddy(user_id_1=user_id_1, user_id_2=user_id_2, pending=True)
        db.session.add(buddies)
        db.session.commit()
        # buddy_id = get_buddy_id_from_user_ids(user_id_1, user_id_2)
        return buddies
    
def create_chat(buddy_id, sender_id, receiver_id,sender_name, message, time_stamp):
    """creating chat for each message sent"""        
    chat = Chat(
        buddy_id = buddy_id,
        sender_id = sender_id, 
        receiver_id = receiver_id,
        message = message,
        sender_name = sender_name,
        time_stamp = time_stamp
    )
    db.session.add(chat)
    db.session.commit()

def get_chats_by_buddy(buddy):
    messages = []
    chats = Chat.query.filter(Chat.buddy_id == buddy.buddy_id).all()
    if chats:
        for chat in chats:
            messages.append(chat)
        return messages
    else:
        return None

def get_chat_by_user_id(user_id):
    buddy_links = []
    buddies = get_accepted_buddies(user_id)
    for buddy in buddies:
        buddy_id = get_buddy_id_from_user_ids(user_id, buddy.user_id)
        buddy_links.append([buddy_id, buddy])
    return buddy_links
    

def get_buddy_id_from_user_ids(user_id_1, user_id_2):
    """returns buddy id from input of 2 user id's"""
    buddy1 = Buddy.query.filter(db.and_(Buddy.user_id_1 == user_id_1, Buddy.user_id_2 == user_id_2)).first()
    buddy2 = Buddy.query.filter(db.and_(Buddy.user_id_1 == user_id_2, Buddy.user_id_2 == user_id_1)).first()
    if buddy1:
        return buddy1.buddy_id
    elif buddy2:
        return buddy2.buddy_id

def accept_buddy_request(buddy_id):
    buddy = Buddy.query.get(buddy_id)
    buddy.pending = False
    buddy.accepted = True
    buddy.rejected = False
    
    db.session.commit()

def deny_buddy_request(buddy_id):
    buddy = Buddy.query.get(buddy_id)
    buddy.pending = False
    buddy.accepted = False
    buddy.rejected = True
    
    db.session.commit()

def create_city(city, state_id, state_name, county_fips, county_name, lat, lng, timezone, zips):

    city_data = City(  
                city = city,
                state_id = state_id,
                state_name = state_name,
                county_fips = county_fips,
                county_name= county_name,
                lat = lat,
                lng = lng,
                timezone = timezone,
                zips = zips
                )
    return city_data


if __name__ == "__main__":
    from server import app
    with app.app_context(): #importing app from server.py (flask)

        connect_to_db(app)