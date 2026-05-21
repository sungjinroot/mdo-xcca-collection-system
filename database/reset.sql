-- Disable foreign key checks
SET session_replication_role = 'replica';

-- Truncate all tables in correct order
TRUNCATE TABLE ArtifactCategories CASCADE;
TRUNCATE TABLE Acquisition CASCADE;
TRUNCATE TABLE PhysicalDescription CASCADE;
TRUNCATE TABLE Dimensions CASCADE;
TRUNCATE TABLE ContactPersons CASCADE;
TRUNCATE TABLE ArtifactProvenance CASCADE;
TRUNCATE TABLE ArtifactNames CASCADE;
TRUNCATE TABLE Artifacts CASCADE;
TRUNCATE TABLE Rooms CASCADE;
TRUNCATE TABLE Categories CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset sequences if any
SELECT setval(pg_get_serial_sequence('Artifacts', 'artifactID'), 1, false);
SELECT setval(pg_get_serial_sequence('Rooms', 'roomID'), 1, false);