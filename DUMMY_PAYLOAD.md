# Dummy Payload for University Creation API Testing

## API Endpoint
```
POST http://localhost:4000/api/universities
```

## Headers
```
Content-Type: application/json
Authorization: Bearer YOUR_ACCESS_TOKEN
```

## Sample Payload 1: Complete University with Programs

```json
{
  "fullName": "National University of Sciences and Technology",
  "shortName": "NUST",
  "sector": "Public",
  "fieldOfStudy": "Engineering",
  "city": "Islamabad",
  "websiteUrl": "https://nust.edu.pk",
  "applyUrl": "https://admissions.nust.edu.pk",
  "email": "info@nust.edu.pk",
  "phone": "051-111-116-878",
  "address": "Sector H-12, Islamabad, Pakistan",
  "about": "NUST is one of the top-ranked universities in Pakistan, known for its excellence in engineering and technology education. Established in 1991, it has consistently ranked among the best universities in the country.",
  "admissionTestType": "NUST Entry Test",
  "weightages": [
    {
      "type": "Matric",
      "value": "10%"
    },
    {
      "type": "FSC",
      "value": "40%"
    },
    {
      "type": "Test",
      "value": "50%"
    }
  ],
  "programs": [
    {
      "name": "BS Computer Science",
      "degree": "Bachelors",
      "deadline": "2025-07-15",
      "merit": "85.5%",
      "fee": 150000,
      "duration": "4 Years",
      "status": "Open"
    },
    {
      "name": "BS Electrical Engineering",
      "degree": "Bachelors",
      "deadline": "2025-07-15",
      "merit": "82.3%",
      "fee": 140000,
      "duration": "4 Years",
      "status": "Open"
    },
    {
      "name": "MS Computer Science",
      "degree": "Masters",
      "deadline": "2025-06-30",
      "merit": "75.0%",
      "fee": 180000,
      "duration": "2 Years",
      "status": "Open"
    }
  ]
}
```

## Sample Payload 2: Medical University

```json
{
  "fullName": "King Edward Medical University",
  "shortName": "KEMU",
  "sector": "Public",
  "fieldOfStudy": "Medical",
  "city": "Lahore",
  "websiteUrl": "https://kemu.edu.pk",
  "applyUrl": "https://admissions.kemu.edu.pk",
  "email": "info@kemu.edu.pk",
  "phone": "042-111-001-882",
  "address": "Mall Road, Lahore, Punjab, Pakistan",
  "about": "King Edward Medical University is one of the oldest and most prestigious medical institutions in Pakistan, established in 1860. It is known for producing world-class medical professionals.",
  "admissionTestType": "MDCAT",
  "weightages": [
    {
      "type": "Matric",
      "value": "10%"
    },
    {
      "type": "FSC",
      "value": "40%"
    },
    {
      "type": "Test",
      "value": "50%"
    }
  ],
  "programs": [
    {
      "name": "MBBS",
      "degree": "Bachelors",
      "deadline": "2025-08-01",
      "merit": "92.5%",
      "fee": 250000,
      "duration": "5 Years",
      "status": "Open"
    },
    {
      "name": "BDS",
      "degree": "Bachelors",
      "deadline": "2025-08-01",
      "merit": "88.0%",
      "fee": 220000,
      "duration": "4 Years",
      "status": "Open"
    }
  ]
}
```

## Sample Payload 3: Business University

```json
{
  "fullName": "Lahore University of Management Sciences",
  "shortName": "LUMS",
  "sector": "Private",
  "fieldOfStudy": "Business",
  "city": "Lahore",
  "websiteUrl": "https://lums.edu.pk",
  "applyUrl": "https://admissions.lums.edu.pk",
  "email": "admissions@lums.edu.pk",
  "phone": "042-3560-8000",
  "address": "DHA, Lahore Cantt, Lahore, Pakistan",
  "about": "LUMS is Pakistan's leading private university, known for its business and management programs. It offers world-class education with international standards.",
  "admissionTestType": "LUMS Admission Test",
  "weightages": [
    {
      "type": "Matric",
      "value": "15%"
    },
    {
      "type": "FSC",
      "value": "35%"
    },
    {
      "type": "Test",
      "value": "50%"
    }
  ],
  "programs": [
    {
      "name": "BS Accounting and Finance",
      "degree": "Bachelors",
      "deadline": "2025-06-15",
      "merit": "90.0%",
      "fee": 350000,
      "duration": "4 Years",
      "status": "Open"
    },
    {
      "name": "MBA",
      "degree": "Masters",
      "deadline": "2025-05-30",
      "merit": "85.0%",
      "fee": 450000,
      "duration": "2 Years",
      "status": "Open"
    },
    {
      "name": "PhD Management",
      "degree": "PhD",
      "deadline": "2025-04-15",
      "merit": "80.0%",
      "fee": 300000,
      "duration": "4 Years",
      "status": "Open"
    }
  ]
}
```

## Sample Payload 4: Minimal University (Basic Info Only)

```json
{
  "fullName": "University of Engineering and Technology",
  "shortName": "UET",
  "sector": "Public",
  "fieldOfStudy": "Engineering",
  "city": "Lahore",
  "websiteUrl": "https://uet.edu.pk",
  "applyUrl": "https://admissions.uet.edu.pk",
  "email": "info@uet.edu.pk",
  "phone": "042-111-001-883",
  "address": "Grand Trunk Road, Lahore, Pakistan",
  "about": "UET Lahore is one of the oldest engineering universities in Pakistan, established in 1921.",
  "admissionTestType": "ECAT",
  "weightages": [],
  "programs": []
}
```

## Sample Payload 5: University with Custom Weightages

```json
{
  "fullName": "COMSATS University Islamabad",
  "shortName": "CUI",
  "sector": "Federal",
  "fieldOfStudy": "Computer Science",
  "city": "Islamabad",
  "websiteUrl": "https://comsats.edu.pk",
  "applyUrl": "https://admissions.comsats.edu.pk",
  "email": "info@comsats.edu.pk",
  "phone": "051-111-001-007",
  "address": "Park Road, Chak Shahzad, Islamabad, Pakistan",
  "about": "COMSATS University Islamabad is a public university known for its IT and computer science programs.",
  "admissionTestType": "COMSATS Entry Test",
  "weightages": [
    {
      "type": "Matric",
      "value": "10%"
    },
    {
      "type": "FSC",
      "value": "30%"
    },
    {
      "type": "Test",
      "value": "40%"
    },
    {
      "type": "Interview",
      "value": "20%"
    }
  ],
  "programs": [
    {
      "name": "BS Software Engineering",
      "degree": "Bachelors",
      "deadline": "2025-07-20",
      "merit": "78.5%",
      "fee": 120000,
      "duration": "4 Years",
      "status": "Open"
    }
  ]
}
```

## Testing Instructions

1. **Get Access Token First:**
   ```
   POST http://localhost:4000/api/auth/admin/login
   Content-Type: application/json
   
   {
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

2. **Use the returned access token in the Authorization header:**
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Test with different payloads to verify:**
   - Basic validation
   - Program creation
   - Weightage calculations
   - Error handling

## Expected Response Format

```json
{
  "success": true,
  "data": {
    "_id": "generated_id",
    "fullName": "University Name",
    "shortName": "UNI",
    "sector": "Public",
    "fieldOfStudy": "Engineering",
    "city": "Lahore",
    "websiteUrl": "https://example.com",
    "applyUrl": "https://admissions.example.com",
    "email": "info@example.com",
    "phone": "042-111-001-001",
    "address": "University Address",
    "about": "University description",
    "admissionTestType": "Test Type",
    "weightages": [...],
    "programs": [...],
    "status": "in_progress",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "University created successfully"
}
```

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error message"
    }
  ]
}
``` 