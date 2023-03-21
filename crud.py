"""just here to put get functions aka CRUD (create, read, update, delete)"""


from model import db, User, Buddy, Chat, City,  connect_to_db

import server 
from datetime import date

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

def update_user_info(user_id, intro_text, calendar, location, skill_level, age_range, frequented_courses, gender_preference, kids_okay, dogs_okay, friendly_or_stakes_game, type_of_game, alcohol_okay, tobacco_okay, smoke_420_okay):
    user = get_user_by_id(user_id)
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

def get_age_by_birthday(birthday):
    dates = birthday.split("/") 
    today = date.today()
    age_year = today.year - int(dates[2]) #2023 - 1988 = 35
    age_month_equal = today.month == int(dates[0]) 
    if age_month_equal:
        age_day = today.day < int(dates[1]) # 20 < 3 = false
        if age_day:
            age = age_year - 1
        else:
            age = age_year
    elif not age_month_equal:
        age_month = today.month < int(dates[0])  #3 < 10 = true
        if age_month:
            age = age_year - 1
        else:
            age = age_year
    return age



    
    





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

def turn_one_profile_to_dict(user):
        user_dict = {}
        user_dict["fname"] = getattr(user, "fname")
        user_dict["user_id"] = getattr(user, "user_id")
        user_dict["pronouns"] = getattr(user, "pronouns")
        user_dict["gender"] = getattr(user, "gender")
        user_dict["birthday"] = getattr(user, "birthday")
        age = get_age_by_birthday(getattr(user, "birthday"))
        user_dict["age"] = age
        user_dict["member_since"] = getattr(user, "member_since")
        user_dict["photo_link"] = getattr(user, "photo_link")
        user_dict["intro_text"] = getattr(user, "intro_text")
        user_dict["calendar"] = getattr(user, "calendar")
        user_dict["location"] = getattr(user, "location")
        user_dict["skill_level"] = getattr(user, "skill_level")
        user_dict["age_range"] = getattr(user, "age_range")
        user_dict["frequented_courses"] = getattr(user, "frequented_courses")
        user_dict["gender_preference"] = getattr(user, "gender_preference")
        user_dict["kids_okay"] = getattr(user, "kids_okay")
        user_dict["dogs_okay"] = getattr(user, "dogs_okay")
        user_dict["friendly_or_stakes_game"] = getattr(user, "friendly_or_stakes_game")
        user_dict["type_of_game"] = getattr(user, "type_of_game")
        user_dict["alcohol_okay"] = getattr(user, "alcohol_okay")
        user_dict["tobacco_okay"] = getattr(user, "tobacco_okay")
        user_dict["smoke_420_okay"] = getattr(user, "smoke_420_okay")
        return user_dict

def turn_profiles_to_dict(profiles):
    user_list = []
    for user in profiles:
        user_dict = {}
        user_dict["fname"] = getattr(user, "fname")
        user_dict["user_id"] = getattr(user, "user_id")
        user_dict["pronouns"] = getattr(user, "pronouns")
        user_dict["gender"] = getattr(user, "gender")
        age = get_age_by_birthday(getattr(user, "birthday"))
        user_dict["age"] = age
        user_dict["member_since"] = getattr(user, "member_since")
        user_dict["photo_link"] = getattr(user, "photo_link")
        user_dict["intro_text"] = getattr(user, "intro_text")
        user_dict["calendar"] = getattr(user, "calendar")
        user_dict["location"] = getattr(user, "location")
        user_dict["skill_level"] = getattr(user, "skill_level")
        user_dict["age_range"] = getattr(user, "age_range")
        user_dict["frequented_courses"] = getattr(user, "frequented_courses")
        user_dict["gender_preference"] = getattr(user, "gender_preference")
        user_dict["kids_okay"] = getattr(user, "kids_okay")
        user_dict["dogs_okay"] = getattr(user, "dogs_okay")
        user_dict["friendly_or_stakes_game"] = getattr(user, "friendly_or_stakes_game")
        user_dict["type_of_game"] = getattr(user, "type_of_game")
        user_dict["alcohol_okay"] = getattr(user, "alcohol_okay")
        user_dict["tobacco_okay"] = getattr(user, "tobacco_okay")
        user_dict["smoke_420_okay"] = getattr(user, "smoke_420_okay")
        user_list.append(user_dict)
    return user_list

def turn_date_to_age(date):
    pass

def turn_profiles_to_dict_bud(profiles):
    user_list = []
    for user in profiles:
        user_dict = {}
        user_dict["fname"] = getattr(user[0], "fname")
        user_dict["user_id"] = getattr(user[0], "user_id")
        user_dict["pronouns"] = getattr(user[0], "pronouns")
        user_dict["gender"] = getattr(user[0], "gender")
        age = get_age_by_birthday(getattr(user[0], "birthday"))
        user_dict["age"] = age
        user_dict["member_since"] = getattr(user[0], "member_since")
        user_dict["photo_link"] = getattr(user[0], "photo_link")
        user_dict["intro_text"] = getattr(user[0], "intro_text")
        user_dict["calendar"] = getattr(user[0], "calendar")
        user_dict["location"] = getattr(user[0], "location")
        user_dict["skill_level"] = getattr(user[0], "skill_level")
        user_dict["age_range"] = getattr(user[0], "age_range")
        user_dict["frequented_courses"] = getattr(user[0], "frequented_courses")
        user_dict["gender_preference"] = getattr(user[0], "gender_preference")
        user_dict["kids_okay"] = getattr(user[0], "kids_okay")
        user_dict["dogs_okay"] = getattr(user[0], "dogs_okay")
        user_dict["friendly_or_stakes_game"] = getattr(user[0], "friendly_or_stakes_game")
        user_dict["type_of_game"] = getattr(user[0], "type_of_game")
        user_dict["alcohol_okay"] = getattr(user[0], "alcohol_okay")
        user_dict["tobacco_okay"] = getattr(user[0], "tobacco_okay")
        user_dict["smoke_420_okay"] = getattr(user[0], "smoke_420_okay")
        user_dict["chat_link"] = f"/chat/{user[1]}"
        user_list.append(user_dict)
    return user_list

def get_all_profiles(user_id):
    """pulls all users that are not logged in user, not rejected, requested, or already matched buddies"""
    users = User.query.filter(db.not_(User.user_id == user_id)).all()
    buddies  = get_all_buddy_user_ids(user_id)
    profiles_data = []
    for user in users:
        if user.user_id not in buddies:
            profiles_data.append(user)
    new_buddy_data = turn_profiles_to_dict(profiles_data)
    return new_buddy_data
        
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
    buddy_data = []
    for buddy in buddies:
        if buddy.accepted == True:
            if buddy.user_id_1 == user_id:
                user = get_user_by_id(buddy.user_id_2)
                buddy_data.append([user, buddy.buddy_id])
            elif buddy.user_id_2 == user_id:
                user = get_user_by_id(buddy.user_id_1)
                buddy_data.append([user, buddy.buddy_id])
    new_buddy_data = turn_profiles_to_dict_bud(buddy_data)
    print(buddy_data)
    return new_buddy_data


def get_all_pending_buddies(user_id):
    """pulls buddies that are instantiated as a Buddy and have not been accepted by other user yet"""
    buddies = Buddy.query.filter(Buddy.user_id_2 == user_id).all()
    buddy_data = []
    for buddy in buddies:
        if buddy.pending == True:
            user = get_user_by_id(buddy.user_id_1)
            buddy_data.append(user)

    new_buddy_data = turn_profiles_to_dict(buddy_data)
    return new_buddy_data


def get_all_rejected_buddies(user_id):
    """pulls buddies that are instantiated as a Buddy and have been rejected by other buddy"""
    buddies = Buddy.query.filter(Buddy.user_id_2 == user_id).all()
    buddy_data = []
    for buddy in buddies:
        if buddy.rejected == True:
            user = get_user_by_id(buddy.user_id_1)
            buddy_data.append(user)
        else:
            continue
    new_buddy_data = turn_profiles_to_dict(buddy_data)
    return new_buddy_data

            
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

def accept_buddy_again(buddy_id, user_id):
    buddy = Buddy.query.get(buddy_id)
    if buddy.user_id_2 == user_id:
        buddy.user_id_2 = buddy.user_id_1
        buddy.user_id_1 = user_id
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

def deny_buddy_again(buddy_id, user_id):
    buddy = Buddy.query.get(buddy_id)
    if buddy.user_id_1 == user_id:
        buddy.user_id_1 = buddy.user_id_2
        buddy.user_id_2 = user_id
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

def get_states():
    states = ['Alabama',
'Alaska',
'Arizona',
'Arkansas',
'California',
'Colorado',
'Connecticut',
'Delaware',
'Florida',
'Georgia',
'Hawaii',
'Idaho',
'Illinois',
'Indiana',
'Iowa',
'Kansas',
'Kentucky',
'Louisiana',
'Maine',
'Maryland',
'Massachusetts',
'Michigan',
'Minnesota',
'Mississippi',
'Missouri',
'Montana',
'Nebraska',
'Nevada',
'New Hampshire',
'New Jersey',
'New Mexico',
'New York',
'North Carolina',
'North Dakota',
'Ohio',
'Oklahoma',
'Oregon',
'Pennsylvania',
'Rhode Island',
'South Carolina',
'South Dakota',
'Tennessee',
'Texas',
'Utah',
'Vermont',
'Virginia',
'Washington',
'West Virginia',
'Wisconsin',
'Wyoming',]
    return states

def get_all_cities_by_state(state):
    cities = City.query.filter(City.state_name == state).all()
    city_names = []
    for city in cities:
        city_names.append(city.city)
    return city_names


if __name__ == "__main__":
    from server import app
    with app.app_context(): #importing app from server.py (flask)

        connect_to_db(app)