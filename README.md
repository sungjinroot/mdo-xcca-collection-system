

HOW TO RUN PROJECT:

Step 1. Git clone the repository.

Step 2: Go to frontend, then npm install. Go to backend, then npm install. Go to root directory then npm install

Step 3: Dockerize it. 


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


Known Bugs that cannot seem to be fixed (?):
1. uploads folder always spawns inside frontend directory (harmless)
2. Artifacts display (frontend) when hovering a clicked rooms dropdown, it has a glitching effect. (Visual bug)
3. Duplicate Accession Number (happy path must be checked)
