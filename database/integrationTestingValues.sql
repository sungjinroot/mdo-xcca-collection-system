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
('A1', 'Prehistoric Items'),
('A2', 'Ethnographic Objects'),
('A3', 'Colonial Era Artifacts'),
('A4', 'Religious Items'),
('A5', 'Household Objects')
ON CONFLICT (catalogueNo) DO NOTHING;

-- ============================================
-- INSERT DEFAULT COLLECTION TYPES
-- ============================================
INSERT INTO Collection (collectionType, collectionName) VALUES
('A', 'Donated'),
('B', 'On Loan'),
('C', 'Excavated'),
('D', 'Found'),
('E', 'Purchased')
ON CONFLICT (collectionType) DO NOTHING;

-- ============================================
-- INSERT ROOMS
-- ============================================
INSERT INTO Rooms (roomID, roomName, title, caption, roomPictureURL) VALUES
(1, 'Heritage Gallery', 'Ancient Artifacts Exhibit', 'Discover the rich cultural heritage of pre-colonial Philippines', 'http://127.0.0.1:3000/uploads/rooms/1779890410103-859789368.jpg'),
(2, 'Textile Wing', 'Weaving Traditions', 'Traditional Filipino textiles and weaving techniques from various ethnic groups', 'http://127.0.0.1:3000/uploads/rooms/1779890709095-786932618.jpg'),
(3, 'Maritime Gallery', 'Ancient Sea Trade', 'Discover balangays, trading vessels, and maritime artifacts that connected the Philippines to Southeast Asia', 'http://127.0.0.1:3000/uploads/rooms/1779890872018-383596357.jpg')
ON CONFLICT (roomID) DO NOTHING;

-- Reset room sequence if needed
SELECT setval('rooms_roomid_seq', 3, true);

-- ============================================
-- INSERT CATEGORIES
-- ============================================
INSERT INTO Categories (categoryID, categoryName) VALUES
(15, 'Pottery'),
(16, 'Ceremonial Objects'),
(17, 'Ancient Tools'),
(18, 'Burial Artifacts'),
(19, 'Jewelry'),
(20, 'Textiles'),
(21, 'Weaving Tools'),
(22, 'Traditional Clothing'),
(23, 'Beadwork'),
(24, 'Natural Dyes'),
(25, 'Maritime Trade'),
(26, 'Fishing Gear'),
(27, 'Boat Artifacts'),
(28, 'Navigation Tools'),
(29, 'Underwater Finds')
ON CONFLICT (categoryID) DO NOTHING;

-- Reset categories sequence
SELECT setval('categories_categoryid_seq', 29, true);

-- ============================================
-- INSERT ARTIFACTS
-- ============================================
INSERT INTO Artifacts (artifactID, accessionNo, catalogueNo, roomID, storageLocation) VALUES
(1, 'ACC-001', 'A1', 1, 'Shelf A1 - Bay 2'),
(2, 'ACC-002', 'A1', 1, 'Shelf A2 - Bay 1'),
(3, 'ACC-003', 'A1', 1, 'Vault Cabinet 1 - Display Case A'),
(4, 'ACC-004', 'A2', 2, 'Textile Cabinet 1 - Drawer A'),
(5, 'ACC-005', 'A2', 2, 'Shelf B1 - Weaving Section'),
(6, 'ACC-006', 'A3', 3, 'Shelf M1 - Bay 3'),
(7, 'ACC-007', 'A3', 3, 'Shelf M2 - Bay 1')
ON CONFLICT (artifactID) DO NOTHING;

-- Reset artifacts sequence
SELECT setval('artifacts_artifactid_seq', 7, true);

-- ============================================
-- INSERT ARTIFACT NAMES
-- ============================================
INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES
(1, 'Ancient Burial Jar', 'Tapayan'),
(2, 'Ritual Offering Bowl', 'Dulang'),
(3, 'Gold Pendant', 'Panika'),
(4, 'Traditional Woven Skirt', 'Malong'),
(5, 'Backstrap Loom', 'Pagsiyab'),
(6, 'Ancient Boat Model', 'Balangay'),
(7, 'Traditional Fishing Net', 'Lambat');

-- ============================================
-- INSERT ARTIFACT PROVENANCE
-- ============================================
INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES
(1, 'Maranao', 'Lanao del Sur', 'Mindanao'),
(2, 'Tagbanua', 'Aborlan', 'Palawan'),
(3, 'Visayan', 'Oslob', 'Cebu'),
(4, 'Maguindanao', 'Cotabato City', 'Mindanao'),
(5, 'T''boli', 'Lake Sebu', 'South Cotabato'),
(6, 'Butuanon', 'Butuan City', 'Agusan del Norte'),
(7, 'Sama-Bajau', 'Sitangkai', 'Sulu Archipelago');

-- ============================================
-- INSERT CONTACT PERSONS
-- ============================================
INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES
(1, 'Juan dela Cruz', '2023-01-15', 'Maria Santos', '2023-02-01', 'Dr. Reyes'),
(2, 'Elena Rodriguez', '2025-03-13', 'Antonio Mendoza', '2026-05-19', 'Dr. Santos'),
(3, 'Inez Cabrera', '2025-07-08', 'Maria Santos', '2026-05-04', 'Dr. Reyes'),
(4, 'Fatima Alonto', '2026-02-10', 'Cristina Lopez', '2026-04-15', 'Dr. Reyes'),
(5, 'Barbara Ofong', '2026-02-10', 'Maria Santos', '2026-07-30', 'Dr. Santos'),
(6, 'National Museum', '2025-11-27', 'Antonio Mendoza', '2026-03-10', 'Dr. Reyes'),
(7, 'Hadji Abdulrahman', '2025-11-27', 'Cristina Lopez', '2026-01-26', 'Dr. Santos');

-- ============================================
-- INSERT DIMENSIONS
-- ============================================
INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES
(1, 25.0, 25.0, 30.0, 28.0),
(2, 35.0, 35.0, 15.0, 35.0),
(3, 4.5, 0.5, 3.0, NULL),
(4, 165.0, 90.0, NULL, NULL),
(5, 120.0, 25.0, 10.0, NULL),
(6, 120.0, 25.0, 45.0, NULL),
(7, 300.0, 200.0, NULL, NULL);

-- ============================================
-- INSERT PHYSICAL DESCRIPTION
-- ============================================
INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES
(1, 'Earthenware burial jar with geometric incised designs', 'Used for secondary burial of ancestors', 'Good - minor cracks on rim', 'Restored in 2023'),
(2, 'Wooden ceremonial bowl with carved animal motifs', 'Used for rice offerings during harvest rituals', 'Excellent', 'Still used in annual ceremonies'),
(3, 'Intricately crafted gold pendant depicting a floral motif', 'Worn as status symbol and ceremonial adornment', 'Excellent - well-preserved', 'Pre-colonial goldwork'),
(4, 'Handwoven tubular garment with geometric patterns in red, gold, and blue', 'Worn as formal attire during weddings and festivals', 'Good - some fading', 'Made from abaca fibers with natural dyes'),
(5, 'Complete backstrap loom set with bamboo rods and cotton threads', 'Used for traditional T''boli textile weaving (T''nalak)', 'Functional - some wear on straps', 'Still operational'),
(6, 'Miniature replica of ancient balangay boat with intricately carved prow', 'Educational model showing traditional boat-building technique', 'Excellent', 'Based on 9th century archaeological find'),
(7, 'Hand-woven fishing net made from abaca fibers with wooden floats', 'Used for traditional fishing methods', 'Worn - needs conservation', 'Collected from sea-based community');

-- ============================================
-- INSERT ACQUISITION
-- ============================================
INSERT INTO Acquisition (artifactID, collectionType, price) VALUES
(1, 'A', NULL),
(2, 'A', NULL),
(3, 'D', NULL),
(4, 'E', 3500.00),
(5, 'A', NULL),
(6, 'B', NULL),
(7, 'C', NULL);

-- ============================================
-- INSERT ARTIFACT CATEGORIES
-- ============================================
INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES
(1, 15), (1, 16), (1, 18),
(2, 16),
(3, 19), (3, 16),
(4, 20), (4, 22),
(5, 21), (5, 20),
(6, 27), (6, 25),
(7, 26), (7, 25);

-- ============================================
-- INSERT PICTURES
-- ============================================
INSERT INTO Pictures (pictureID, angleName, pictureFilePath, artifactID, isProfilePicture) VALUES
(1, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779892285814-260203947.jpg', 1, true),
(2, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779892875266-767021167.jpg', 2, true),
(3, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779893795930-585253248.jpg', 3, true),
(4, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779893858185-418998507.jpg', 4, true),
(5, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779893921032-612967179.png', 5, true),
(6, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779894006125-906346455.jpg', 6, true),
(7, 'front', 'http://127.0.0.1:3000/uploads/artifacts/1779894051578-709314079.jpg', 7, true)
ON CONFLICT (pictureID) DO NOTHING;

-- Reset pictures sequence
SELECT setval('pictures_pictureid_seq', 7, true);

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
    RAISE NOTICE '  - Artifact 1-3: Heritage Gallery';
    RAISE NOTICE '  - Artifact 4-5: Textile Wing';
    RAISE NOTICE '  - Artifact 6-7: Maritime Gallery';
    RAISE NOTICE '=========================================';
END $$;
