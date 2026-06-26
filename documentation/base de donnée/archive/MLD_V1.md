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
DepartAdressID int FK NN
RallyPoint text NN
ScheduleID int FK NN
seat int NN default 4

Adress:


Vehicle:
seat int NN default 4

Schedule:
Time datetime NN
Date date Nullable

Tripers:
TripID int FK NN
UserID int FK NN
Triper Role Enum NN Default Value "DRIVER", (value of enum "DRIVER", "PASSENGER")


//evolution:

Regularity Enum NN Default value "ONCE", (value of enum "ONCE", "DAILY")