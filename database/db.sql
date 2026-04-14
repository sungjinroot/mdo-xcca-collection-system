
CREATE TABLE IF NOT EXISTS Categories ( /*Passed Manual Test*/
    categoryID SERIAL PRIMARY KEY,
    categoryName varchar(255)
);

CREATE TABLE IF NOT EXISTS Catalogue ( /*has default values A1 A2 A3 A4 A5 and so on...*/ /*Passed Manual Test*/
    catalogueNo varchar(5) PRIMARY KEY,
    catalogueName varchar(255)
);

CREATE TABLE IF NOT EXISTS Rooms ( /*Passed Manual Test*/
    roomID SERIAL PRIMARY KEY,
    title varchar(255),
    roomName varchar(255),
    caption varchar(255),
    roomPictureURL varchar(255)
);

CREATE TABLE IF NOT EXISTS Artifacts ( /*Passed Manual Test*/
    artifactID SERIAL PRIMARY KEY,
    accessionNo varchar(255) UNIQUE,
    catalogueNo varchar(5) NOT NULL,
    roomID INT NOT NULL,
    storageLocation varchar(255),

    CONSTRAINT fk_catalogue FOREIGN KEY (catalogueNo) REFERENCES Catalogue(catalogueNo), /*1 Artifact REQUIRES 1 Catalogue*/
    CONSTRAINT fk_room FOREIGN KEY (roomID) REFERENCES Rooms(roomID) /*1 Artifact REQUIRES 1 ROOM*/
);

CREATE TABLE IF NOT EXISTS Pictures ( /*Passed Manual Test*/
    pictureID SERIAL PRIMARY KEY,
    angleName varchar(255),
    pictureFilePath varchar(255),
    artifactID INT, /*1 Artifact has many pictures, but it can also have zero pictures*/
    isProfilePicture BOOLEAN DEFAULT FALSE, 

    CONSTRAINT fk_picture_belongs_to FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID)
);

/*One is to ones*/

CREATE TABLE IF NOT EXISTS ArtifactCategories( /*Passed Manual Test*/
    artifactID INT,
    categoryID INT,
    
    PRIMARY KEY(artifactID,categoryID),

    CONSTRAINT fk_artifactCat FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID),
    CONSTRAINT fk_categoryCat FOREIGN KEY (categoryID) REFERENCES Categories(categoryID) 
);

CREATE TABLE IF NOT EXISTS ArtifactNames( /*Passed Manual Test*/
    artifactID INT PRIMARY KEY,
    englishName varchar(255),
    vernacularName varchar(255),

    CONSTRAINT fk_artifactNames FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID)
);

CREATE TABLE IF NOT EXISTS ArtifactProvenance( /*Passed Manual Test*/
    artifactID INT PRIMARY KEY,
    ethnicGroup varchar(255),
    locality varchar(255),
    placeOfOrigin varchar(255),

    CONSTRAINT fk_artifactProvenance FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID)
);

CREATE TABLE IF NOT EXISTS ContactPersons( /*Passed Manual Test*/
    artifactID INT PRIMARY KEY,
    contactPersonFullName varchar(255),
    dateCollectedByContactPerson DATE,
    receiverFullName varchar(255),
    receivedByReceiverDate DATE,
    recordedBy varchar(255),

    CONSTRAINT fk_contactPersons FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID)
);

CREATE TABLE IF NOT EXISTS Dimensions( /*Passed Manual Test*/
    artifactID INT PRIMARY KEY,
    artifactLength DECIMAL,
    artifactWidth DECIMAL,
    artifactHeight DECIMAL,
    artifactDiameter DECIMAL,

    CONSTRAINT fk_dimensions FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID)
);

CREATE TABLE IF NOT EXISTS PhysicalDescription( /*Passed Manual Test*/
    artifactID INT PRIMARY KEY,
    artifactDetails TEXT,
    artifactFunction TEXT,
    conditionUponReceipt TEXT,
    specialRemarks TEXT,

    CONSTRAINT fk_physicalDesc FOREIGN KEY (artifactID) REFERENCES Artifacts(artifactID)
);

CREATE TABLE IF NOT EXISTS Collection( /*Default values - Donated, On Loan, Excavated, Found, Purchased*/ /*Passed Manual Test*/
    collectionType varchar(5) PRIMARY KEY,
    collectionName varchar(50)
);

CREATE TABLE IF NOT EXISTS Acquisition( /*Passed Manual Test*/
    artifactID INT PRIMARY KEY,
    collectionType varchar(5),
    price DECIMAL,

    CONSTRAINT fk_acquisitionCollection FOREIGN KEY (collectionType) REFERENCES Collection(CollectionType)
);


/**/

CREATE TABLE IF NOT EXISTS Users (
    userID SERIAL PRIMARY KEY,
    userName varchar(255) UNIQUE,
    bcryptPassword varchar(255),
    canDelete BOOLEAN DEFAULT FALSE,
    canEdit BOOLEAN DEFAULT FALSE,
    canDownload BOOLEAN DEFAULT FALSE
);