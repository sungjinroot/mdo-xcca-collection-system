-- ============================================
-- COMPLETE DATABASE RESET WITH TEST DATA
-- ============================================

-- Disable foreign key checks for clean deletion
SET session_replication_role = 'replica';

-- Clean up all tables in correct order (child tables first)
TRUNCATE TABLE ArtifactCategories CASCADE;
TRUNCATE TABLE Pictures CASCADE;
TRUNCATE TABLE Acquisition CASCADE;
TRUNCATE TABLE PhysicalDescription CASCADE;
TRUNCATE TABLE Dimensions CASCADE;
TRUNCATE TABLE ContactPersons CASCADE;
TRUNCATE TABLE ArtifactProvenance CASCADE;
TRUNCATE TABLE ArtifactNames CASCADE;
TRUNCATE TABLE Artifacts CASCADE;
TRUNCATE TABLE Rooms CASCADE;
TRUNCATE TABLE Categories CASCADE;
TRUNCATE TABLE Collection CASCADE;
TRUNCATE TABLE Users CASCADE;
TRUNCATE TABLE Catalogue CASCADE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

-- Reset sequences
ALTER SEQUENCE artifacts_artifactid_seq RESTART WITH 1;
ALTER SEQUENCE rooms_roomid_seq RESTART WITH 1;
ALTER SEQUENCE categories_categoryid_seq RESTART WITH 1;
ALTER SEQUENCE users_userid_seq RESTART WITH 1;
ALTER SEQUENCE pictures_pictureid_seq RESTART WITH 1;

-- ============================================
-- INSERT DEFAULT CATALOGUE VALUES (A1, A2, A3, A4, A5)
-- ============================================
INSERT INTO Catalogue (catalogueNo, catalogueName) VALUES 
('A1', 'Artifact Type 1'),
('A2', 'Artifact Type 2'),
('A3', 'Artifact Type 3'),
('A4', 'Artifact Type 4'),
('A5', 'Artifact Type 5')
ON CONFLICT (catalogueNo) DO NOTHING;

-- ============================================
-- INSERT DEFAULT COLLECTION TYPES (all 5 chars or less)
-- ============================================
INSERT INTO Collection (collectionType, collectionName) VALUES 
('DON', 'Donated'),
('LOAN', 'On Loan'),
('EXC', 'Excavated'),
('FOUND', 'Found'),
('PUR', 'Purchased')
ON CONFLICT (collectionType) DO NOTHING;

-- Insert test-specific collection types (insert one by one to avoid complete failure)
INSERT INTO Collection (collectionType, collectionName) VALUES ('DON01', 'Donation Test') ON CONFLICT (collectionType) DO NOTHING;
INSERT INTO Collection (collectionType, collectionName) VALUES ('TEST1', 'Test Collection') ON CONFLICT (collectionType) DO NOTHING;
INSERT INTO Collection (collectionType, collectionName) VALUES ('POST1', 'Post Collection') ON CONFLICT (collectionType) DO NOTHING;
INSERT INTO Collection (collectionType, collectionName) VALUES ('NEWTY', 'New Type') ON CONFLICT (collectionType) DO NOTHING;

-- ============================================
-- INSERT DEFAULT CATEGORIES
-- ============================================
INSERT INTO Categories (categoryID, categoryName) VALUES 
(1, 'Pottery'),
(2, 'Weapon'),
(3, 'Textile')
ON CONFLICT (categoryID) DO NOTHING;

-- Insert test categories
INSERT INTO Categories (categoryID, categoryName) VALUES 
(100, 'Test Cat 1'),
(101, 'Test Cat 2')
ON CONFLICT (categoryID) DO NOTHING;

-- ============================================
-- INSERT TEST ROOMS
-- ============================================
INSERT INTO Rooms (roomID, roomName, roomPictureURL, title, caption) VALUES 
(1, 'Test Room', 'test.jpg', 'Test Title', 'Test Caption'),
(1000, 'Integration Room', 'int.jpg', 'Int Title', 'Int Caption'),
(1001, 'Post Room', 'post.jpg', 'Post Title', 'Post Caption'),
(1002, 'Delete Room', 'del.jpg', 'Del Title', 'Del Caption')
ON CONFLICT (roomID) DO NOTHING;

-- ============================================
-- INSERT TEST ARTIFACT 1 (Main Test Artifact)
-- ============================================
INSERT INTO Artifacts (artifactID, accessionNo, catalogueNo, roomID, storageLocation) VALUES 
(1, 'ACC-001', 'A1', 1, 'Shelf A1');

-- ArtifactNames
INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES 
(1, 'Original Jar', 'Original Banga');

-- ArtifactProvenance
INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES 
(1, 'Maranao', 'Lanao del Sur', 'Mindanao');

-- ContactPersons
INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES 
(1, 'Juan dela Cruz', '2023-01-15', 'Maria Santos', '2023-02-01', 'Dr. Reyes');

-- Dimensions
INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES 
(1, 20.5, 15.0, 30.0, 18.0);

-- PhysicalDescription
INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES 
(1, 'Earthenware jar', 'Ceremonial', 'Good', 'None');

-- Acquisition (using DON which exists in Collection table)
INSERT INTO Acquisition (artifactID, collectionType, price) VALUES 
(1, 'DON', NULL);

-- ArtifactCategories
INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES 
(1, 1);

-- ============================================
-- INSERT TEST ARTIFACT 2 (For 404/Delete Testing)
-- ============================================
INSERT INTO Artifacts (artifactID, accessionNo, catalogueNo, roomID, storageLocation) VALUES 
(999, 'ACC-999', 'A2', 1, 'Shelf B2');

INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES 
(999, 'Test Artifact', 'Test Vernacular');

-- ============================================
-- INSERT INTEGRATION TEST ARTIFACT (For integration testing)
-- ============================================
INSERT INTO Artifacts (artifactID, accessionNo, catalogueNo, roomID, storageLocation) VALUES 
(1000, 'INT-ACC-001', 'A3', 1000, 'Integration Shelf');

INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES 
(1000, 'Integration Jar', 'Integration Banga');

INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES 
(1000, 'Test Group', 'Test Locality', 'Test Origin');

INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES 
(1000, 'Test Contact', '2024-01-01', 'Test Receiver', '2024-01-02', 'Test Recorder');

INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES 
(1000, 10.5, 20.5, 30.5, 40.5);

INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES 
(1000, 'Test Details', 'Test Function', 'Good', 'Test Remarks');

INSERT INTO Acquisition (artifactID, collectionType, price) VALUES 
(1000, 'TEST1', 100.00);

-- ============================================
-- INSERT POST TEST ARTIFACT DATA
-- ============================================
INSERT INTO Artifacts (artifactID, accessionNo, catalogueNo, roomID, storageLocation) VALUES 
(1001, 'POST-ACC-001', 'A4', 1001, 'Post Shelf');

INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES 
(1001, 'Post Jar', 'Post Banga');

-- ============================================
-- VERIFY DATA WAS INSERTED
-- ============================================
DO $$
DECLARE
    tbl RECORD;
    row_count INT;
BEGIN
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'DATABASE RESET COMPLETE';
    RAISE NOTICE '=========================================';
    
    FOR tbl IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', tbl.tablename) INTO row_count;
        RAISE NOTICE 'Table: % - % rows', tbl.tablename, row_count;
    END LOOP;
    
    RAISE NOTICE '=========================================';
    RAISE NOTICE 'Test artifacts available:';
    RAISE NOTICE '  - Artifact ID 1: Main test artifact';
    RAISE NOTICE '  - Artifact ID 999: 404/Delete testing';
    RAISE NOTICE '  - Artifact ID 1000: Integration tests';
    RAISE NOTICE '  - Artifact ID 1001: POST tests';
    RAISE NOTICE '=========================================';
END $$;