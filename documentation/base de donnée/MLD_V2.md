    user :
        bigint id PK "NOT NULL"
        bigint role_id FK "NOT NULL, DEFAULT 2" 
        string email "NOT NULL, UNIQUE, INDEX"
        string password_hash "NOT NULL"
        string first_name "NOT NULL"
        string last_name "NOT NULL"
        string phone "NOT NULL, UNIQUE, INDEX"
        enum gender "M, F, Other, NOT NULL"
        datetime created_at "NOT NULL"
        datetime deleted_at "NULL"
        datetime updated_at "NULL"


    user_info :
        bigint id PK "NOT NULL"
        bigint user_id FK "user.id, NOT NULL, UNIQUE, INDEX"
        bigint adress_id FK "adress.id, NULL"
        string profile_picture_url "NULL"
        text bio "NULL"
        json travel_preferences "{ musique: bool, discussion: bool, animaux: bool, non_fumeur: bool, women_only: bool}, NULL"
        boolean accept_calls "NOT NULL, DEFAULT FALSE"
        float average_rating "1 to 5, NOT NULL, DEFAULT 0"
        datetime created_at "NOT NULL"
        datetime deleted_at "NULL"
        datetime updated_at "NULL"


    roles :
        bigint id PK "NOT NULL"
        string name "ex: Admin, Moderator, Traveler, Moral_User, NOT NULL, UNIQUE"
        datetime created_at "NOT NULL"
        datetime deleted_at "NULL"
        datetime updated_at "NULL"


    moral_entity :
        bigint id PK "NOT NULL"
        bigint muser_id FK "user.id, NOT NULL, UNIQUE, INDEX"
        string name "NOT NULL, UNIQUE, INDEX"
        string siret "NOT NULL, UNIQUE"
        string contact_email "NOT NULL, UNIQUE"
        string contact_phone "NOT NULL, UNIQUE"
        datetime created_at "NOT NULL"
        datetime deleted_at "NULL"
        datetime updated_at "NULL"


    fleet :
        bigint id PK "NOT NULL"
        bigint moral_entity_id FK "moral_entity.id, NOT NULL, INDEX"
        bigint adress_id FK "adress.id, NOT NULL"
        string name "NOT NULL, UNIQUE, INDEX"
        string description "NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NULL"


    vehicle :
        bigint id PK "NOT NULL"
        bigint user_id FK "user.id, NULL (Particulier)"
        bigint fleet_id FK "fleet.id, NULL (Institution)"
        boolean has_clim "NOT NULL, DEFAULT TRUE"
        float consumption_l_per_100km "NOT NULL"
        int seat_count "NOT NULL"
        enum state "New, VeryGood, Good, Bad, Maintenance, NOT NULL"
        text description "NULL"
        string picture_url "NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NULL"
    


    city :
        bigint id PK "NOT NULL"
        string name "NOT NULL"
        string commune "NOT NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NULL"


    adress :
        bigint id PK "NOT NULL"
        bigint city_id FK "NOT NULL, INDEX"
        string street_address "NOT NULL"
        string complement "NULL"
        string postal_code "NOT NULL, INDEX"
        float latitude "NULL"
        float longitude "NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NULL"



    trip :
        bigint id PK "NOT NULL"
        bigint creator_id FK "user.id, NOT NULL, INDEX"
        enum creator_role_on_trip "Driver, Passenger, NOT NULL, DEFAULT Driver"
        bigint vehicle_id FK "vehicle.id, NOT NULL, INDEX"
        bigint departure_adress_id FK "adress.id, NOT NULL, INDEX"
        bigint arrival_adress_id FK "adress.id, NOT NULL, INDEX"
        datetime departure_datetime "NOT NULL, INDEX"
        datetime estimated_arrival_datetime "NOT NULL, INDEX"
        int total_seats "NOT NULL, DEFAULT 4"
        int available_seats "NOT NULL, DEFAULT 3"
        float total_price "NOT NULL, DEFAULT 0"
        float price_per_passenger "NOT NULL, DEFAULT 0"
        float average_rating "1 to 5, NOT NULL, DEFAULT 0"
        boolean women_only "NOT NULL, DEFAULT FALSE"
        enum status "Published, Full, Cancelled, Finished, NOT NULL, DEFAULT Published"
        json preferences "NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NULL"
        datetime deleted_at "NULL"


    travelers :
        bigint id PK "NOT NULL"
        bigint trip_id FK "trip.id, NOT NULL, INDEX"
        bigint user_id FK "user.id, NOT NULL, INDEX"
        enum role_on_trip "Driver, Passenger, NOT NULL, DEFAULT Passenger"
        enum status "Pending, Excluded, Arrived, NOT NULL, DEFAULT Pending"
        datetime joined_at "NOT NULL"



    message :
        bigint id PK "NOT NULL"
        bigint sender_id FK "user.id, NOT NULL, INDEX"
        bigint receiver_id FK "user.id, NOT NULL, INDEX"
        bigint trip_id FK "trip.id, NULL"
        text content "NOT NULL"
        boolean is_read "NOT NULL, DEFAULT FALSE"
        boolean is_reported "NOT NULL, DEFAULT FALSE"
        datetime sent_at "NOT NULL"
       
    
    notification:
        bigint id PK "NOT NULL"
        bigint receiver_id FK "user.id, NULL, INDEX"
        bigint trip_id FK "trip.id, NULL"
        text content "NOT NULL"
        datetime sent_at "NOT NULL"
        boolean is_read "NOT NULL, DEFAULT FALSE"
        enum type PK "Personal, Broadcast NOT NULL DEFAULT Personal"
    
    review :
        bigint id PK "NOT NULL"
        bigint author_id FK "user.id, NOT NULL"
        bigint trip_id FK "trip.id, NOT NULL" 
        text content "NULL"
        boolean is_reported "NOT NULL, DEFAULT FALSE"
        datetime created_at "NOT NULL"
    

    report :
        bigint id PK "NOT NULL"
        bigint reporter_id FK "user.id, NOT NULL"
        bigint reported_id FK "user.id, NOT NULL INDEX"
        enum reason "Abusive behavior, Fraud, Excessive delay, Other NOT NULL DEFAULT Other"
        text description "NOT NULL"
        enum status "Pending, Validated, Rejected, NOT NULL, DEFAULT Pending"
        datetime created_at "NOT NULL"
        text moderator_notes "NULL"

    comment :
        bigint id PK "NOT NULL"
        bigint author_id FK "user.id, NOT NULL"
        bigint target_id FK "user.id, NOT NULL"
        text content "NULL"
        boolean is_reported "NOT NULL, DEFAULT FALSE"
        datetime created_at "NOT NULL"

    group :
        bigint id PK "NOT NULL"
        string name "NOT NULL"
        bigint creator_id FK "user.id, NOT NULL, INDEX"
        text description "NULL"
        datetime created_at "NOT NULL"
        datetime updated_at "NULL"


    group_member :
        bigint id PK "NOT NULL"
        bigint group_id FK "group.id, NOT NULL, INDEX"
        bigint member_id FK "user.id, NOT NULL, INDEX"
        datetime joined_at "NOT NULL"
    

    waypoint :
        bigint id PK "NOT NULL"
        bigint trip_id FK "trip.id, NOT NULL, INDEX"
        bigint adress_id FK "adress.id, NOT NULL"
        datetime estimated_time "NOT NULL"
        string label "NOT NULL, ex: 'Pause déjeuner'"
    



//evolution:

Regularity Enum NN Default value "ONCE", (value of enum "ONCE", "DAILY")