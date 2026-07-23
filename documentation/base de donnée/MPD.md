erDiagram

    %% --- ENTITÉS PRINCIPALES ---
    user {
        bigint id PK "NOT NULL"
        bigint role_id FK "NOT NULL, DEFAULT 2" 
        string email "NOT NULL, UNIQUE, INDEX"
        string password_hash "NOT NULL"
        string first_name "NOT NULL"
        string last_name "NOT NULL"
        string phone "NOT NULL, UNIQUE, INDEX"
        enum gender "Male, Female, NOT NULL"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
        datetime deleted_at "NULL"
    }

    user_info {
        bigint id PK "NOT NULL"
        bigint user_id FK "user.id, NOT NULL, INDEX"
        bigint user_preference_id FK "user_preference.id, NULL, INDEX"
        bigint adress_id FK "adress.id, NULL"
        bigint fleet_id "fleet.id, NULL"
        string picture_url "NULL"
        text bio "NULL"
        boolean accept_calls "NOT NULL, DEFAULT FALSE"
        float average_rating "1 to 5, NOT NULL, DEFAULT 0"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime deleted_at "NULL"
        datetime updated_at "NULL"
    }

    user_preference {
        bigint id PK "NOT NULL"
        bigint user_info_id FK "user.id, NOT NULL, INDEX"
        bigint preference_id FK "preference.id, NOT NULL, INDEX"
        boolean is_active "NOT NULL, DEFAULT TRUE"
    }

    trip_preference {
        bigint id PK "NOT NULL"
        bigint trip_id FK "trip.id, NOT NULL, INDEX"
        bigint preference_id FK "preference.id, NOT NULL, INDEX"
        boolean is_active "NOT NULL, DEFAULT TRUE"
    }

    preference {
        bigint id PK "NOT NULL"
        string description "(women_only, seek_conductor, smoking, animal, no_music, no_talk) NOT NULL, UNIQUE, INDEX"
    }

    roles {
        bigint id PK "NOT NULL"
        string name "ex: admin, moderator, traveler, moral_user, NOT NULL, UNIQUE"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime deleted_at "NULL"
        datetime updated_at "NULL"
    }

    %% --- ENTITÉS MORALES ---
    has_moral_entity {
        bigint user_id FK "user.id, NOT NULL, INDEX"
        bigint moral_entity_id FK "moral_entity.id, NOT NULL, INDEX"
    }

    moral_entity {
        bigint id PK "NOT NULL INDEX"
        bigint adress_id FK "adress.id, NOT NULL, INDEX"
        string name "NOT NULL, UNIQUE, INDEX"
        bigint siret "NULL, UNIQUE"
        string email "NOT NULL, UNIQUE"
        string phone "NOT NULL, UNIQUE"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
        datetime deleted_at "NULL"
    }

    moral_entity_fleet{
        bigint moral_entity_id FK "moral_entity.id, NULL, INDEX"
        bigint fleet_id FK "fleet.id, NULL, INDEX"
    }

    fleet {
        bigint id PK "NOT NULL"
        bigint adress_id FK "adress.id, NOT NULL"
        string name "NOT NULL, UNIQUE, INDEX"
        string description "NULL"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
    }

    vehicle {
        bigint id PK "NOT NULL"
        bigint fleet_id FK "fleet.id, NOT NULL, INDEX"
        boolean has_ac "NOT NULL"
        float consumption_liter_per_100km "NULL"
        int seat "NOT NULL"
        enum vehicle_state "New, VeryGood, Good, Bad, Maintenance, NOT NULL"
        text description "NULL"
        string picture_url "NULL"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
    }

    %% --- LOCALISATION ---
    city {
        bigint id PK "NOT NULL"
        string name "NOT NULL"
        string commune "NOT NULL"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
    }

    city_postal_code {
        bigint city_id FK "city.id, NOT NULL, INDEX"
        bigint postal_code_id FK "postal_code.id, NOT NULL, INDEX"
    }

    postal_code {
        bigint id PK "NOT NULL"
        bigint number "NOT NULL UNIQUE INDEX"
    }

    adress {
        bigint id PK "NOT NULL"
        bigint city_id FK "NOT NULL, INDEX"
        string street "NOT NULL"
        float latitude "NULL"
        float longitude "NULL"
    }

    %% --- TRAJETS ---
    trip {
        bigint id PK "NOT NULL"
        bigint creator_id FK "user.id, NOT NULL, INDEX"
        enum trip_creator_role "DRIVER, PASSENGER, NOT NULL, DEFAULT DRIVER"
        bigint vehicle_id FK "vehicle.id, NOT NULL, INDEX"
        bigint departure_id FK "adress.id, NOT NULL, INDEX"
        bigint arrival_id FK "adress.id, NOT NULL, INDEX"
        datetime departure_datetime "NOT NULL, INDEX"
        datetime estimated_arrival_datetime "NOT NULL, INDEX"
        int available_seats "NOT NULL, DEFAULT 3"
        float total_price "NOT NULL, DEFAULT 0"
        float average_rating "1 to 5, NOT NULL, DEFAULT 0"
        boolean is_women_only "NOT NULL, DEFAULT FALSE"
        enum trip_status "PUBLISHED, FULL, CANCELLED, FINISHED, NOT NULL, DEFAULT PUBLISHED"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
        datetime deleted_at "NULL"
    }

    traveler {
        bigint id PK "NOT NULL"
        bigint trip_id FK "trip.id, NOT NULL, INDEX"
        bigint user_id FK "user.id, NOT NULL, INDEX"
        enum traveler_role "DRIVER, PASSENGER, NOT NULL, DEFAULT PASSENGER"
        enum traveler_status "PENDING, EXCLUDED, ARRIVED, NOT NULL, DEFAULT PENDING"
        datetime joined_at "NOT NULL"
    }

    %% --- COMMUNICATION ET MODÉRATION ---
    message {
        bigint id PK "NOT NULL"
        bigint sender_id FK "user.id, NOT NULL, INDEX"
        bigint receiver_id FK "user.id, NOT NULL, INDEX"
        bigint trip_id FK "trip.id, NULL"
        text content "NOT NULL"
        boolean is_read "NOT NULL, DEFAULT FALSE"
        boolean is_reported "NOT NULL, DEFAULT FALSE"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
        datetime deleted_at "NULL"
    }

    notification {
        bigint id PK "NOT NULL"
        bigint receiver_id FK "user.id, NULL, INDEX"
        bigint trip_id FK "trip.id, NULL"
        text content "NOT NULL"
        boolean is_read "NOT NULL, DEFAULT FALSE"
        enum type "PERSONNAL, BROADCAST, NOT NULL DEFAULT PERSONNAL"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
    }

    report {
        bigint id PK "NOT NULL"
        bigint reporter_id FK "user.id, NOT NULL"
        bigint reported_id FK "user.id, NOT NULL"
        string reason "NOT NULL"
        text description "NOT NULL"
        enum report_status "PENDING, VALIDATED, REJECTED, NOT NULL, INDEX DEFAULT PENDING"
        datetime  DEFAUT CURRENT TIMESTAMP
        text moderator_notes "NULL"
    }

    review {
        bigint id PK "NOT NULL"
        bigint author_id FK "user.id, NOT NULL"
        bigint reviewed_id FK "user.id, NULL INDEX"
        bigint trip_id FK "trip.id, NULL INDEX" 
        boolean is_reported "NOT NULL, DEFAULT FALSE"
        text comment "NULL"
        datetime  DEFAUT CURRENT TIMESTAMP
        datetime updated_at "NULL"
        datetime deleted_at "NULL"
    }

    %% --- GROUPES ET ESCALES ---
    group {
        bigint id PK "NOT NULL"
        string name "NOT NULL"
        bigint creator_id FK "user.id, NOT NULL, INDEX"
        text description "NULL"
        datetime created_at "NOT NULL DEFAUT CURRENT TIMESTAMP"
        datetime updated_at "NULL"
    }

    group_member {
        bigint id PK "NOT NULL"
        bigint group_id FK "group.id, NOT NULL, INDEX"
        bigint member_id FK "user.id, NOT NULL, INDEX"
        datetime joined_at "NOT NULL DEFAUT CURRENT TIMESTAMP"
    }

    waypoint {
        bigint id PK "NOT NULL"
        bigint trip_id FK "trip.id, NOT NULL, INDEX"
        bigint adress_id FK "adress.id, NOT NULL"
        datetime estimated_at "NOT NULL"
        string description "NOT NULL, ex: 'Pause déjeuner'"
    }

    %% --- RELATIONS (Verbes et Cardinalité) ---
    %% Connexion des comptes
    user ||--|| user_info : "détient ses infos"
    user ||--|{ user_preference : "a des préférences"
    user_preference }o--|| preference : "correspond à"
    
    trip ||--|{ trip_preference : "impose des préférences"
    trip_preference }o--|| preference : "correspond à"

    user }o--|| roles : "possède un rôle"
    
    %% Logique Institutionnelle
    user ||--o{ has_moral_entity : "gère une"
    has_moral_entity }o--|| moral_entity : "est lié à"
    moral_entity ||--o{ fleet : "gère des"
    fleet ||--o{ vehicle : "contient"

    %% Localisation
    adress }o--|| city : "est située dans"
    postal_code }o--|| city_postal_code : "appartiennent"
    city }o--|| city_postal_code : "possèdent"

    %% Trajet
    vehicle ||--o{ trip : "est utilisé dans"
    trip }o--|| adress : "a pour départ"
    trip }o--|| adress : "a pour arrivée"
    trip ||--o{ waypoint : "peut avoir comme escale"
    waypoint }o--|| adress : "est situé à"
    
    trip ||--o{ traveler : "accueille"
    traveler }o--|| user : "en tant que voyageur"

    %% Échanges et Avis
    user ||--o{ notification : "reçoit"
    trip ||--o{ message : "génère des échanges"
    user ||--o{ message : "envoie"
    user ||--o{ message : "reçoit"
    user ||--o{ review : "donne des avis"
    user ||--o{ review : "reçoit des avis"

    %% Modération
    user ||--o{ report : "émet"
    user ||--o{ report : "est la cible"

    %% Groupes
    user ||--o{ group : "crée des groupes"
    group ||--o{ group_member : "accueille"
    group_member }o--|| user : "en tant que membre"

    %% évolution possible:
    json preferences "{ musique: bool, discussion: bool, animaux: bool, non_fumeur: bool, women_only: bool}, NULL" sur les tables user info et trip
    regularity int sur la table trip