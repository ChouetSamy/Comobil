Migrations:

docker compose exec app php bin/console make:migration #créer la nouvelle version avec les requête sql

docker compose exec app php bin/console doctrine:migrations:migrate #transforme en sql les version

docker compose exec app php bin/console doctrine:schema:validate 

#vérifie la validité des données relation, dans le code et entre le code et la bdd

BDD

docker compose exec db psql -U comobil -d comobil \
-c 'SELECT id, departure_datetime FROM trip ORDER BY id;'

curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@comobil.local",
    "password": "Test1234!",
    "first_name": "SAM",
    "last_name": "Testing",
    "phone": "06 07 08 09 10",
    "gender": "MALE"
  }'

curl -i -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "female@comobil.local",
    "password": "Test1234!",
    "first_name": "Jane",
    "last_name": "Doe",
    "phone": "0600000002",
    "gender": "FEMALE"
  }'

/connexion :
#pour se facilité la vie on utilise jq, il enregistre le token pour nous, c'est plus facile de le réutiliser ensuite.

TOKEN=$(curl -s -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@comobil.local",
    "password": "Test1234!"
  }' | jq -r '.token')

echo "$TOKEN" #vérifie que le token est bien présent, et est le même.

TOKEN_FEMALE=$(curl -s -X POST http://localhost:8080/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "female@comobil.local",
    "password": "Test1234!"
  }' | jq -r '.token')

curl -i "http://localhost:8080/api/trips/search?departureCommune=paris&preferences[]=women_only" \
  -H "Authorization: Bearer $TOKEN_FEMALE" \
  -H "Accept: application/ld+json"

curl -i "http://localhost:8080/api/trips/search?departureCommune=paris" \
  -H "Authorization: Bearer $TOKEN_FEMALE" \
  -H "Accept: application/ld+json"

/test du provider user_infos

/création:
curl -X POST http://localhost:8080/api/user_infos \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/ld+json" \
  -d '{
    "user": "/api/users/1",
    "picture_url": null,
    "bio": "Utilisateur de test",
    "accept_call": true,
    "average_rating": 0
  }'

/call
curl -X GET http://localhost:8080/user_infos \
  -H "Authorization: Bearer $TOKEN"

  curl -i -X POST http://localhost:8080/api/trips \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/ld+json" \
  -d '{
    "creator": "/api/users/1",
    "vehicle": null,
    "departureAddress": "/api/adresses/1",
    "arrivalAddress": "/api/adresses/2",
    "departureDatetime": "2026-07-25T08:00:00+00:00",
    "estimatedArrivalDatetime": "2026-07-25T10:00:00+00:00",
    "totalPrice": 20.00,
    "pricePerPassenger": 10.00,
    "averageRating": 0,
    "tripStatus": "PUBLISHED",
    "tripCreatorRole": "DRIVER",
    "availableSeats": 3
  }'

curl -X POST http://localhost:8080/api/travelers/1/exclude \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/ld+json" \
  -d '{}' | jq