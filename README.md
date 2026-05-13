

HOW TO RUN PROJECT:



HOW TO ENTER THE BACKEND SHELL

sudo docker exec -it mdo-xcca-collection-system-backend-1 bash


HOW TO ENTER THE DOCKERIZED DATABASE

docker exec -it mdo-xcca-collection-system-db-1 psql -U postgres -d mydb




DATABASE PROPAGATION

Propagate the necessary tables:
cd mdo-xcca-collection-system/database
docker exec -i mdo-xcca-collection-system-db-1 psql -U postgres -d mydb < db.sql


Propagate with dummy data:
cd mdo-xcca-collection-system/database
docker exec -i mdo-xcca-collection-system-db-1 psql -U postgres -d mydb < dummyData.sql



