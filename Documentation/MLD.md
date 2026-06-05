User:
id int pk
email text unique Not Null = NN
first_name text NN
last_name text NN
gender text NN
password text NN
phone_number int unique NN

Roles:
id int PKs
name text NN (admin, traveler)

City:
id int PK
name text NN

Trip:
id int PK
CityID int FK NN
TripID int FK NN
RallyPoint text NN
TripersID int FK NN
ScheduleID int FK NN
TripType Enum NN default value "Depart" (values:"DEPART", "DESTINATION", "HALT" )

TripPlanning:
id int PK
tripID int FK
seat int NN

Schedule:
DepartTime Time NN
DepartDate date Nullable

Tripers:
TripID int FK NN
UserID int FK NN
Triper Role Enum NN Default Value "DRIVER", (value of enum "DRIVER", "PASSENGER")


//evolution:

Regularity Enum NN Default value "ONCE", (value of enum "ONCE", "DAILY")