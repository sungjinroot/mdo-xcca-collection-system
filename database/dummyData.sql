-- =========================
-- DUMMY DATA INSERT SCRIPT by chatgpt
-- =========================

-- Categories
INSERT INTO Categories (categoryName) VALUES
('Tools'),
('Weapons'),
('Textiles'),
('Ceramics'),
('Jewelry');

-- Catalogue
INSERT INTO Catalogue (catalogueNo, catalogueName) VALUES
('A1', 'Prehistoric Items'),
('A2', 'Ethnographic Objects'),
('A3', 'Colonial Era Artifacts'),
('A4', 'Religious Items'),
('A5', 'Household Objects');

-- Rooms
INSERT INTO Rooms (title, roomName, caption, roomPictureURL) VALUES
('Hall A', 'Ancient Gallery', 'Artifacts from ancient times', 'roomA.jpg'),
('Hall B', 'Cultural Gallery', 'Cultural heritage display', 'roomB.jpg'),
('Hall C', 'Colonial Gallery', 'Colonial period artifacts', 'roomC.jpg');

-- Collection
INSERT INTO Collection (collectionType, collectionName) VALUES
('A', 'Donated'),
('B', 'On Loan'),
('C', 'Excavated'),
('D', 'Found'),
('E', 'Purchased');

-- Artifacts
INSERT INTO Artifacts (accessionNo, catalogueNo, roomID) VALUES
('ACC001', 'A1', 1),
('ACC002', 'A2', 2),
('ACC003', 'A3', 3),
('ACC004', 'A4', 1),
('ACC005', 'A5', 2);

-- ArtifactCategories (many-to-many)
INSERT INTO ArtifactCategories (artifactID, categoryID) VALUES
(1, 1),
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

-- Pictures
INSERT INTO Pictures (angleName, pictureFilePath, artifactID, isProfilePicture) VALUES
('Front', 'a1_1.jpg', 1, TRUE),
('Back', 'a1_2.jpg', 1, FALSE),
('Left', 'a2_1.jpg', 2, TRUE),
('Right', 'a3_1.jpg', 3, TRUE),
('Up', 'a4_1.jpg', 4, TRUE);

-- ArtifactNames (1:1)
INSERT INTO ArtifactNames (artifactID, englishName, vernacularName) VALUES
(1, 'Stone Axe', 'Palakol na Bato'),
(2, 'Woven Cloth', 'Hinabing Tela'),
(3, 'Clay Pot', 'Palayok'),
(4, 'Religious Icon', 'Imahen'),
(5, 'Necklace', 'Kuwintas');

-- ArtifactProvenance (1:1)
INSERT INTO ArtifactProvenance (artifactID, ethnicGroup, locality, placeOfOrigin) VALUES
(1, 'Lumad', 'Bukidnon', 'Mindanao'),
(2, 'Ifugao', 'Ifugao', 'Luzon'),
(3, 'Tagalog', 'Laguna', 'Luzon'),
(4, 'Cebuano', 'Cebu', 'Visayas'),
(5, 'Maranao', 'Lanao', 'Mindanao');

-- ContactPersons (1:1)
INSERT INTO ContactPersons (artifactID, contactPersonFullName, dateCollectedByContactPerson, receiverFullName, receivedByReceiverDate, recordedBy) VALUES
(1, 'Juan Dela Cruz', '2020-01-10', 'Maria Santos', '2020-01-15', 'Admin'),
(2, 'Pedro Reyes', '2021-02-05', 'Ana Cruz', '2021-02-10', 'Admin'),
(3, 'Luis Garcia', '2019-03-12', 'Jose Lopez', '2019-03-15', 'Admin'),
(4, 'Carlos Mendoza', '2018-04-20', 'Elena Ramos', '2018-04-25', 'Admin'),
(5, 'Ramon Torres', '2022-05-18', 'Sofia Lim', '2022-05-20', 'Admin');

-- Dimensions (1:1)
INSERT INTO Dimensions (artifactID, artifactLength, artifactWidth, artifactHeight, artifactDiameter) VALUES
(1, 30.5, 10.2, 5.0, NULL),
(2, 100.0, 50.0, NULL, NULL),
(3, NULL, NULL, 25.0, 15.0),
(4, 40.0, 20.0, 10.0, NULL),
(5, NULL, NULL, NULL, 8.5);

-- PhysicalDescription (1:1)
INSERT INTO PhysicalDescription (artifactID, artifactDetails, artifactFunction, conditionUponReceipt, specialRemarks) VALUES
(1, 'Made of stone with sharp edge', 'Cutting tool', 'Good', 'Handle slightly worn'),
(2, 'Handwoven fabric', 'Clothing', 'Excellent', 'Bright colors'),
(3, 'Earthen clay pot', 'Cooking vessel', 'Fair', 'Minor cracks'),
(4, 'Wooden carved icon', 'Religious use', 'Good', 'Paint fading'),
(5, 'Beaded necklace', 'Adornment', 'Excellent', 'Well preserved');

-- Acquisition (1:1)
INSERT INTO Acquisition (artifactID, collectionType, price) VALUES
(1, 'A', 0),
(2, 'C', 0),
(3, 'E', 1500),
(4, 'D', 0),
(5, 'B', 0);