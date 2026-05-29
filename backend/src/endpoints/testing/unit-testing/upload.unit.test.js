// ============================================
// UNIT TESTS FOR UPLOAD API (upload.js)
// ============================================
// This file tests the image upload functionality for:
//   1. Room photos (single file upload)
//   2. Artifact photos (multiple file upload)
//
// We use mocking to avoid:
//   - Actually connecting to the database
//   - Actually saving files to disk
//   - Actually using multer (the file upload library)
// ============================================

// Import testing libraries
const request = require('supertest');  // Simulates HTTP requests
const express = require('express');    // Creates a test Express app

// ============================================
// MOCK THE DATABASE
// ============================================
// Instead of connecting to a real database, we create a fake one
// This prevents test data from polluting your real database
const mockPool = {
  query: jest.fn()  // A fake function that records if it was called
};

// Tell Jest to replace the real database module with our mock
jest.mock('../../../db', () => mockPool);

// ============================================
// MOCK MULTER (File Upload Library)
// ============================================
// Multer handles file uploads. We mock it to:
//   1. Avoid actually saving files to disk
//   2. Manually control what files look like in tests
//
// IMPORTANT: multer.single() sets req.file (for single files)
//            multer.array() sets req.files (for multiple files)

// Create fake middleware functions that will run before our endpoint
const mockSingleMiddleware = jest.fn((req, res, next) => {
  next();  // Just move to the next function by default
});

const mockArrayMiddleware = jest.fn((req, res, next) => {
  next();  // Just move to the next function by default
});

// Replace the real multer with our fake version
jest.mock('multer', () => {
  const multerMock = jest.fn().mockImplementation(() => ({
    // When code calls .single(), return our fake middleware
    single: jest.fn().mockReturnValue(mockSingleMiddleware),
    // When code calls .array(), return our fake middleware
    array: jest.fn().mockReturnValue(mockArrayMiddleware)
  }));
  
  // diskStorage is a multer function we don't need to test
  multerMock.diskStorage = jest.fn().mockReturnValue({});
  
  return multerMock;
});

// ============================================
// IMPORT THE REAL ENDPOINT (after mocks are set up)
// ============================================
const uploadEndpoint = require('../../upload');

// ============================================
// CREATE A TEST EXPRESS APP
// ============================================
// This mimics your real server but only includes the upload routes
const app = express();
app.use(express.json());              // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse form data
app.use('/upload', uploadEndpoint);   // Mount the upload routes

// ============================================
// THE ACTUAL TEST SUITE
// ============================================
describe('Upload API - Unit Tests', () => {
  // This runs BEFORE each individual test
  // It resets all mocks to a clean state
  beforeEach(() => {
    jest.clearAllMocks();                    // Clear all mock records
    mockPool.query.mockResolvedValue({ rows: [] });  // Make DB queries succeed by default
    
    // Reset middleware to their default behavior (just pass through)
    mockSingleMiddleware.mockImplementation((req, res, next) => next());
    mockArrayMiddleware.mockImplementation((req, res, next) => next());
  });

  // ============================================
  // TEST GROUP 1: ROOM PHOTO UPLOADS
  // ============================================
  describe('POST /upload/room', () => {
    
    // TEST 1: Successful upload with a valid file
    it('should upload a room photo successfully', async () => {
      // STEP 1: Setup - Tell the fake middleware to simulate a file upload
      mockSingleMiddleware.mockImplementation((req, res, next) => {
        // This is what multer would normally do - attach file info to req.file
        req.file = {
          fieldname: 'roomPicture',
          originalname: 'test-room.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          destination: '/app/uploads/rooms',
          filename: 'test-123.jpg',
          path: '/app/uploads/rooms/test-123.jpg',
          size: 1024
        };
        next();  // Continue to the actual endpoint handler
      });

      // STEP 2: Execute - Send a fake POST request with a fake file
      const response = await request(app)
        .post('/upload/room')
        .attach('roomPicture', Buffer.from('test image content'), 'test-room.jpg');

      // STEP 3: Verify - Check that we got the expected response
      expect(response.status).toBe(201);  // 201 = Created
      expect(response.body.success).toBe(true);
      expect(response.body.filename).toBeDefined();  // Should return a file path
    });

    // TEST 2: Upload fails when no file is provided
    it('should return 400 when no file is uploaded', async () => {
      // Setup - No file attached
      mockSingleMiddleware.mockImplementation((req, res, next) => {
        req.file = undefined;  // No file present
        next();
      });

      // Execute - Send request without a file
      const response = await request(app)
        .post('/upload/room');

      // Verify - Should get 400 Bad Request
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('No file uploaded');
    });
  });

  // ============================================
  // TEST GROUP 2: ARTIFACT PHOTO UPLOADS
  // ============================================
  describe('POST /upload/artifact', () => {
    
    // Reset database mock before each artifact test
    beforeEach(() => {
      mockPool.query.mockResolvedValue({ rows: [] });
    });

    // TEST 1: Upload one photo with a custom name
    it('should handle single picture name as string', async () => {
      // Setup - Simulate multer.array() attaching files to req.files
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        // CRITICAL: array() puts files in req.files (plural) as an array
        req.files = [{
          fieldname: 'photos',
          originalname: 'artifact1.jpg',
          filename: 'test-123.jpg',
          path: '/app/uploads/artifacts/test-123.jpg',
          mimetype: 'image/jpeg',
          size: 1024
        }];
        req.body = { artifactId: '2', pictureNames: 'Front View' };
        next();
      });

      // Execute
      const response = await request(app)
        .post('/upload/artifact')
        .field('artifactId', '2')
        .field('pictureNames', 'Front View');

      // Verify
      expect(response.status).toBe(200);  // 200 = OK
      expect(response.body.success).toBe(true);
      expect(mockPool.query).toHaveBeenCalled();  // Database insert was attempted
    });

    // TEST 2: When no name is provided, default to "No Name"
    it('should handle empty picture names', async () => {
      // Setup - No pictureNames field in request
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        req.files = [{
          fieldname: 'photos',
          originalname: 'artifact1.jpg',
          filename: 'test-123.jpg',
          path: '/app/uploads/artifacts/test-123.jpg'
        }];
        req.body = { artifactId: '3' };  // No pictureNames
        next();
      });

      // Execute
      const response = await request(app)
        .post('/upload/artifact')
        .field('artifactId', '3');

      // Verify - Should use default name "No Name"
      expect(response.status).toBe(200);
      expect(mockPool.query).toHaveBeenCalledWith(
        'INSERT INTO pictures (angleName, pictureFilePath, artifactID, isProfilePicture) VALUES ($1, $2, $3, $4)',
        ['No Name', expect.any(String), 3, true]  // 'No Name' is the default
      );
    });

    // TEST 3: Upload multiple photos at once
    it('should handle multiple files with picture names array', async () => {
      // Setup - Two files with two names
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        req.files = [
          {
            fieldname: 'photos',
            originalname: 'artifact1.jpg',
            filename: 'test-1.jpg',
            path: '/app/uploads/artifacts/test-1.jpg'
          },
          {
            fieldname: 'photos',
            originalname: 'artifact2.jpg',
            filename: 'test-2.jpg',
            path: '/app/uploads/artifacts/test-2.jpg'
          }
        ];
        req.body = { artifactId: '4', pictureNames: JSON.stringify(['Front', 'Back']) };
        next();
      });

      // Execute
      const response = await request(app)
        .post('/upload/artifact')
        .field('artifactId', '4')
        .field('pictureNames', JSON.stringify(['Front', 'Back']));

      // Verify - Should have inserted 2 records into database
      expect(response.status).toBe(200);
      expect(mockPool.query).toHaveBeenCalledTimes(2);  // Two database inserts
    });

    // TEST 4: Handle different format of pictureNames (array directly, not JSON string)
    it('should handle pictureNames as array directly', async () => {
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        req.files = [
          {
            fieldname: 'photos',
            originalname: 'artifact1.jpg',
            filename: 'test-1.jpg',
            path: '/app/uploads/artifacts/test-1.jpg'
          },
          {
            fieldname: 'photos',
            originalname: 'artifact2.jpg',
            filename: 'test-2.jpg',
            path: '/app/uploads/artifacts/test-2.jpg'
          }
        ];
        req.body = { artifactId: '7', pictureNames: ['Front', 'Back'] };  // Direct array, not JSON string
        next();
      });

      const response = await request(app)
        .post('/upload/artifact')
        .field('artifactId', '7')
        .field('pictureNames', ['Front', 'Back']);

      expect(response.status).toBe(200);
      expect(mockPool.query).toHaveBeenCalledTimes(2);
    });

    // TEST 5: Handle database errors gracefully
    it('should return 500 on database error', async () => {
      // Setup - Make the database fail
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        req.files = [{
          fieldname: 'photos',
          originalname: 'artifact1.jpg',
          filename: 'test-123.jpg',
          path: '/app/uploads/artifacts/test-123.jpg'
        }];
        req.body = { artifactId: '5' };
        next();
      });

      // Force database query to fail
      mockPool.query.mockRejectedValue(new Error('Database connection failed'));

      // Execute
      const response = await request(app)
        .post('/upload/artifact')
        .field('artifactId', '5');

      // Verify - Should return 500 Internal Server Error
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Internal server error');
    });

    // TEST 6: First photo should automatically be the profile picture
    it('should set first photo as profile picture', async () => {
      // Track all database insert calls to verify which is profile picture
      const queryCalls = [];
      mockPool.query.mockImplementation((query, params) => {
        queryCalls.push({ query, params });
        return Promise.resolve({ rows: [] });
      });

      // Setup - Two photos
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        req.files = [
          {
            fieldname: 'photos',
            originalname: 'artifact1.jpg',
            filename: 'test-1.jpg',
            path: '/app/uploads/artifacts/test-1.jpg'
          },
          {
            fieldname: 'photos',
            originalname: 'artifact2.jpg',
            filename: 'test-2.jpg',
            path: '/app/uploads/artifacts/test-2.jpg'
          }
        ];
        req.body = { artifactId: '6', pictureNames: JSON.stringify(['First', 'Second']) };
        next();
      });

      // Execute
      await request(app)
        .post('/upload/artifact')
        .field('artifactId', '6')
        .field('pictureNames', JSON.stringify(['First', 'Second']));

      // Verify - First photo (index 0) should be profile picture (true)
      //          Second photo (index 1) should NOT be profile picture (false)
      expect(queryCalls[0].params[3]).toBe(true);   // First photo = profile
      expect(queryCalls[1].params[3]).toBe(false);  // Second photo = not profile
    });

    // TEST 7: Edge case - No files uploaded at all
    it('should handle no files uploaded', async () => {
      // Setup - Empty files array
      mockArrayMiddleware.mockImplementation((req, res, next) => {
        req.files = [];  // No files
        req.body = { artifactId: '8' };
        next();
      });

      // Execute
      const response = await request(app)
        .post('/upload/artifact')
        .field('artifactId', '8');

      // Verify - Should still succeed but with empty files list
      expect(response.status).toBe(200);
      expect(response.body.files).toHaveLength(0);
    });
  });
});

// ============================================
// SUMMARY OF WHAT WE'RE TESTING:
// ============================================
//
// Room Upload:
//   - Uploading a room photo successfully
//   - Failing properly when no photo is provided
//
// Artifact Upload:
//   - Single photo upload with custom name
//   - Default name when none provided
//   - Multiple photos upload
//   - Different pictureNames formats (JSON string vs array)
//   - Database error handling
//   - First photo automatically becomes profile picture
//   - Empty file list handling
//
// All tests use mocks to avoid:
//   - Real database connections
//   - Actual file system writes
//   - Real multer processing
// ============================================