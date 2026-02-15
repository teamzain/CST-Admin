# Course Completion Flow & Progress Tracking Guide

> **Last Updated:** February 15, 2026  
> **Purpose:** Complete documentation of course completion logic, progress tracking, and enrollment status management

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Data Models](#data-models)
3. [Progress Tracking](#progress-tracking)
4. [Course Completion Rules](#course-completion-rules)
5. [Completion Checks](#completion-checks)
6. [Certificate Generation](#certificate-generation)
7. [Identifying Completed Enrollments](#identifying-completed-enrollments)
8. [API Endpoints for Progress](#api-endpoints-for-progress)
9. [Complete Flow Examples](#complete-flow-examples)

---

## 🎯 Overview

The LMS system tracks course completion through a multi-layered approach involving:

1. **Lesson Progress** - Individual lesson completion tracking
2. **Quiz Performance** - Quiz attempts and passing scores
3. **Session Attendance** - Live session participation
4. **Seat Time** - Total time spent on course
5. **Compliance Checks** - State requirements, ID verification, range passes
6. **Overall Progress** - Weighted calculation of all components

---

## 📊 Data Models

### 1. **CourseEnrollment** (Main tracking model)
```prisma
model CourseEnrollment {
  id            Int       @id
  user_id       Int       # Student ID
  course_id     Int       # Course ID
  status        String    @default("IN_PROGRESS")  # IN_PROGRESS, COMPLETED, DROPPED
  progress      Float     @default(0)              # 0-100%
  seat_time_min Int       @default(0)              # Minutes spent
  started_at    DateTime  @default(now())
  completed_at  DateTime?                          # Set when status = COMPLETED
}
```

**Status Values:**
- `IN_PROGRESS` - Student actively taking course
- `COMPLETED` - All requirements met, course finished
- `DROPPED` - Student withdrew

---

### 2. **StudentProgress** (Aggregated progress view)
```prisma
model StudentProgress {
  id               Int      @id
  user_id          Int
  course_id        Int
  enrollment_id    Int      @unique
  
  total_lessons    Int      # Count of all lessons in course
  completed_lessons Int     # Lessons marked as complete (90%+ watched)
  
  total_quizzes    Int      # Count of all quizzes
  passed_quizzes   Int      # Quizzes where score >= passing_score
  
  total_sessions   Int      # Live sessions in course
  attended_sessions Int     # Sessions marked PRESENT or LATE
  
  overall_progress Float    # Weighted calculation (0-100%)
}
```

---

### 3. **LessonProgress** (Per-lesson tracking)
```prisma
model LessonProgress {
  id               Int     @id
  user_id          Int
  lesson_id        Int
  enrollment_id    Int
  
  watched_seconds  Int     # Total seconds watched
  total_seconds    Int     # Video length
  progress_percent Float   # (watched_seconds / total_seconds) * 100
  is_completed     Boolean # true when progress_percent >= 90%
  last_position    Int     # For resume playback
}
```

**Completion Threshold:** **90%** of video watched = lesson complete

---

### 4. **QuizAttempt** (Quiz submissions)
```prisma
model QuizAttempt {
  id            Int      @id
  quiz_id       Int
  user_id       Int
  score         Float    # Percentage (0-100)
  is_passed     Boolean  # true when score >= quiz.passing_score
  attempt_no    Int      # Which attempt (1st, 2nd, etc.)
  completed_at  DateTime
}
```

---

### 5. **CourseCompletionRule** (Configurable requirements)
```prisma
model CourseCompletionRule {
  id                      Int @id
  course_id               Int @unique
  
  require_all_lessons     Boolean @default(true)      # Must watch all lessons
  min_hours_required      Float?                      # Minimum seat time
  require_final_exam      Boolean @default(true)      # Must pass quiz
  min_exam_score          Int?                        # Min score (e.g., 80)
  require_id_verification Boolean @default(false)     # Must verify ID
  require_range_pass      Boolean @default(false)     # Must pass range test
}
```

---

### 6. **State** (Regulatory requirements)
```prisma
model State {
  id                     Int
  name                   String
  
  # Hour requirements by training type
  unarmed_hours         Int @default(20)
  armed_hours           Int @default(40)
  
  # Passing scores by training type
  unarmed_passing_score Int @default(70)
  armed_passing_score   Int @default(80)
  
  # Requirements
  requires_range_pass   Boolean @default(false)
  is_seat_time_enabled  Boolean @default(false)
  certificate_validity_years Int?
}
```

---

### 7. **Attendance** (Session tracking)
```prisma
model Attendance {
  id             Int              @id
  session_id     Int
  user_id        Int
  course_id      Int
  status         AttendanceStatus # PRESENT, ABSENT, LATE, EXCUSED
  check_in_time  DateTime?
  check_out_time DateTime?
}
```

---

### 8. **Certificate** (Proof of completion)
```prisma
model Certificate {
  id                 Int      @id
  enrollment_id      Int      @unique
  certificate_uid    String   @unique
  issued_at          DateTime @default(now())
  expires_at         DateTime?
  
  # Snapshot data
  student_name       String
  course_title       String
  instructor_name    String?
  issued_state_code  String
  completed_at       DateTime?
}
```

---

## 📈 Progress Tracking

### How Course Progress is Calculated

**Formula:**
```
Overall Progress =
  (Lessons Component * 40%) +
  (Quizzes Component * 40%) +
  (Sessions Component * 20%)

Where:
  Lessons Component   = (completed_lessons / total_lessons) * 100  OR 100 if no lessons
  Quizzes Component   = (passed_quizzes / total_quizzes) * 100     OR 100 if no quizzes
  Sessions Component  = (attended_sessions / total_sessions) * 100 OR 100 if no sessions
```

**Example:**
```
Course has:
- 5 lessons  → Student completed 4 → 80% * 40 = 32%
- 3 quizzes  → Student passed 2   → 67% * 40 = 26.8%
- 2 sessions → Student attended 1 → 50% * 20 = 10%

Overall Progress = 32% + 26.8% + 10% = 68.8%
```

---

### Progress Update Triggers

Progress is recalculated when:

1. **Lesson Watched** - After video progress update
2. **Quiz Submitted** - After quiz completion
3. **Attendance Marked** - After session attendance
4. **Manual Trigger** - Via `/api/course/:id/progress/:userId/calculate`

---

## ✅ Course Completion Rules

### Course-Level Requirements (from CourseCompletionRule)

1. **require_all_lessons = true**
   - ✅ PASS: `completed_lessons == total_lessons`
   - ❌ FAIL: Any lesson not completed (< 90% watched)

2. **require_final_exam = true**
   - ✅ PASS: At least one passing quiz attempt with `is_final: true`
   - ❌ FAIL: No passing final exam

3. **min_exam_score** (e.g., 80)
   - ✅ PASS: Final exam score >= 80%
   - ❌ FAIL: Highest score < 80%

4. **min_hours_required** (e.g., 20 hours)
   - ✅ PASS: `enrollment.seat_time_min >= 20 * 60`
   - ❌ FAIL: Not enough time logged

5. **require_id_verification = true**
   - ✅ PASS: ComplianceCheck record exists with `id_verified: true`
   - ❌ FAIL: No verified ID on file

6. **require_range_pass = true**
   - ✅ PASS: Range qualification exists (feature incomplete)
   - ❌ FAIL: No range pass proof

---

## 🔍 Completion Checks

### Complete Verification Flow (for Certificate)

When a user attempts to generate a certificate, the system performs these checks in order:

#### **Check 1: Enrollment Status**
```
IF enrollment.status != 'COMPLETE'
  → REJECT: Cannot generate certificate for incomplete enrollments
```

#### **Check 2: Course Active**
```
IF course.is_active == false
  → REJECT: Course no longer active
```

#### **Check 3: Certificate Template Exists**
```
IF NOT(course.certificate_template OR state.certificate_template)
  → REJECT: No certificate available for this course
```

#### **Check 4: Progress at 100%**
```
IF studentProgress.overall_progress < 100
  → REJECT: Course not fully completed (X% done)
```

#### **Check 5: Course Completion Rules**

If `CourseCompletionRule` exists, verify all enabled rules:

```
IF rule.require_all_lessons == true
  ✅ Check: completed_lessons == total_lessons

IF rule.require_final_exam == true
  ✅ Check: At least one quiz.is_final passed

IF rule.min_exam_score exists (e.g., 80)
  ✅ Check: Highest passed final exam score >= 80

IF rule.min_hours_required exists (e.g., 20)
  ✅ Check: seat_time_min >= (20 * 60 minutes)

IF rule.require_id_verification == true
  ✅ Check: ComplianceCheck.id_verified == true

IF rule.require_range_pass == true
  ✅ Check: Range qualification exists (future feature)
```

#### **Check 6: State-Level Requirements**

```
IF course.attendance_required == true
  ✅ Check: attended_sessions == total_sessions

IF state.is_seat_time_enabled == true
  ✅ Check: seat_time_hours >= state.[armed/unarmed]_hours
          (based on course.training_type)

IF course.requires_exam == true
  ✅ Check: Final exam score >= state.[armed/unarmed]_passing_score

IF state.requires_range_pass == true AND course.requires_range == true
  ✅ Check: Range pass exists (future feature)
```

#### **Check 7: Existing Certificate**
```
IF certificate already issued
  → Return existing certificate
```

---

## 🎖️ Certificate Generation

### How Certificate is Generated

```
1. User calls: POST /api/course/certificate/:enrollmentId/certificates/generate

2. System performs all checks above ↑

3. If ALL checks pass:
   
   a. Query platform settings
   b. Calculate expiry date:
      expiry_date = today + state.certificate_validity_years
   
   c. Generate unique certificate ID (UUID)
   
   d. Create Certificate record with snapshot data:
      - student_name
      - course_title
      - training_type (UNARMED, ARMED, REFRESHER)
      - duration_hours
      - instructor_name & signature
      - platform_name & signature
      - issued_state_code
      - completed_at (timestamp)
      - seat_time_hours (converted from minutes)

4. Return certificate data to frontend for display/printing

5. User can access: GET /api/course/certificate/:certificateId
```

---

## 🔎 Identifying Completed Enrollments

### Method 1: Check Enrollment Status

```bash
GET /api/course/enrollments/:enrollmentId
```

Response:
```json
{
  "id": 123,
  "user_id": 45,
  "course_id": 10,
  "status": "COMPLETED",           # ← Status field
  "progress": 100,                 # ← Progress percentage
  "seat_time_min": 1800,           # ← 30 hours
  "started_at": "2026-01-15T10:00:00Z",
  "completed_at": "2026-02-15T14:30:00Z" # ← When completed
}
```

**Completion Indicators:**
- ✅ `status == "COMPLETED"`
- ✅ `completed_at != null`
- ✅ `progress == 100`

---

### Method 2: Check Student Progress

```bash
GET /api/course/:courseId/progress/:userId
```

Response:
```json
{
  "userId": 45,
  "courseId": 10,
  "enrollmentStatus": "COMPLETED",
  "completedAt": "2026-02-15T14:30:00Z",
  "progress": {
    "lessons": {
      "total": 5,
      "completed": 5,
      "percentage": 100
    },
    "quizzes": {
      "total": 3,
      "passed": 3,
      "percentage": 100
    },
    "sessions": {
      "total": 2,
      "attended": 2,
      "percentage": 100
    },
    "overall": 100,
    "isCompleted": true          # ← Completion flag
  }
}
```

**Completion Indicators:**
- ✅ `progress.overall == 100`
- ✅ `progress.isCompleted == true`
- ✅ `enrollmentStatus == "COMPLETED"`

---

### Method 3: Check Certificate Exists

```bash
GET /api/course/certificate/user/:userId/certificates
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 5,
      "enrollment_id": 123,
      "certificate_uid": "550e8400-e29b-41d4-a716-446655440000",
      "issued_at": "2026-02-15T14:30:00Z",
      "expires_at": "2028-02-15T14:30:00Z",
      "student_name": "John Doe",
      "course_title": "Unarmed Security",
      "completed_at": "2026-02-15T14:30:00Z"
    }
  ]
}
```

**Completion Indicators:**
- ✅ Certificate exists for enrollment
- ✅ `issued_at` timestamp present

---

## 🔌 API Endpoints for Progress

### Track Lesson Progress

```bash
POST /api/course/lesson/:lessonId/progress/:userId

Body:
{
  "currentPosition": 300,      # Seconds watched
  "totalDuration": 600,        # Video length
  "watchedSeconds": 10,        # Increment
  "forceComplete": false       # Manual completion
}

Response:
{
  "progressPercent": 50,
  "isCompleted": false,
  "lastPosition": 300
}
```

---

### Mark Lesson Complete

```bash
POST /api/course/lesson/:lessonId/mark-complete/:userId

Response:
{
  "id": 456,
  "isCompleted": true,
  "progressPercent": 100,
  "completedAt": "2026-02-15T14:30:00Z"
}
```

---

### Get Student Progress

```bash
GET /api/course/:courseId/progress/:userId

Response: (see above)
```

---

### Get Detailed Progress

```bash
GET /api/course/:courseId/progress/:userId/detailed

Response:
{
  "courseId": 10,
  "courseName": "Unarmed Security",
  "lessons": [
    {
      "id": 1,
      "title": "Introduction",
      "isCompleted": true,
      "progressPercent": 100,
      "watchedSeconds": 1200,
      "lastPosition": 1200
    },
    ...
  ],
  "quizzes": [
    {
      "id": 1,
      "title": "Chapter 1 Quiz",
      "passingScore": 70,
      "attempts": [
        {
          "score": 85,
          "isPassed": true,
          "attemptNo": 1
        }
      ]
    },
    ...
  ],
  "sessions": [
    {
      "id": 1,
      "title": "Live Q&A",
      "attendanceStatus": "PRESENT",
      "checkInTime": "2026-02-15T10:00:00Z"
    },
    ...
  ]
}
```

---

### Calculate Progress

```bash
POST /api/course/:courseId/progress/:userId/calculate

Response:
{
  "userId": 45,
  "courseId": 10,
  "progress": {
    "lessons": {
      "total": 5,
      "completed": 5,
      "percentage": 100
    },
    "quizzes": {
      "total": 3,
      "passed": 3,
      "percentage": 100
    },
    "sessions": {
      "total": 2,
      "attended": 2,
      "percentage": 100
    },
    "overall": 100,
    "isCompleted": true
  }
}
```

---

### Get All Enrollments

```bash
GET /api/course/enrollments/all?courseId=10&userId=45&status=COMPLETED&page=1&limit=10

Response:
{
  "success": true,
  "data": [
    {
      "id": 123,
      "userId": 45,
      "courseId": 10,
      "status": "COMPLETED",
      "completedAt": "2026-02-15T14:30:00Z",
      "progress": 100
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

### Generate Certificate

```bash
POST /api/course/certificate/:enrollmentId/certificates/generate

Response:
{
  "id": 5,
  "enrollment_id": 123,
  "certificate_uid": "550e8400-e29b-41d4-a716-446655440000",
  "issued_at": "2026-02-15T14:30:00Z",
  "expires_at": "2028-02-15T14:30:00Z",
  "student_name": "John Doe",
  "course_title": "Unarmed Security",
  "instructor_name": "Jane Smith",
  "training_type": "UNARMED",
  "duration_hours": 20,
  "completed_at": "2026-02-15T14:30:00Z",
  "seat_time_hours": 22.5
}
```

---

## 🔄 Complete Flow Examples

### Example 1: 5-Lesson Course with Quiz

#### **Course Setup**
```
Course: "Basic Security"
- 5 lessons (20 min each)
- 1 final quiz (80% passing score)
- No mandatory sessions
- State: IL (20 hours unarmed, 70% passing score)

Completion Rules:
- require_all_lessons: true
- require_final_exam: true
- min_exam_score: 75
```

#### **User John Doe's Journey**

**Week 1: Lessons Only**
```
MON: Watches Lesson 1 (90%) → LessonProgress[1].is_completed = true
TUE: Watches Lesson 2 (85%) → LessonProgress[2].progress = 85%
WED: Watches Lesson 3 (100%) → LessonProgress[3].is_completed = true
THU: Watches Lesson 4 (95%) → LessonProgress[4].is_completed = true
FRI: Watches Lesson 5 (60%) → LessonProgress[5].progress = 60%

StudentProgress after Week 1:
- total_lessons: 5
- completed_lessons: 3
- overall_progress: (3/5)*40 + 100*40 + 100*20 = 24 + 40 + 20 = 84%
- enrollment.status: IN_PROGRESS
```

**Week 2: Finish Lessons**
```
MON: Completes Lesson 2 (100%) → recount = 4 lessons done
TUE: Completes Lesson 5 (100%) → recount = 5 lessons done

StudentProgress updated:
- completed_lessons: 5
- overall_progress: (5/5)*40 + 100*40 + 100*20 = 40 + 40 + 20 = 100%
```

**Wait - 100% but Status Still IN_PROGRESS because:**
- Quiz not yet attempted!

```
WED: Attempts final quiz
  - Score: 78%
  - is_passed: true (78 >= 80? NO) ❌
  - Attempt 1 FAILED

THU: Attempts final quiz again
  - Score: 85%
  - is_passed: true (85 >= 75 min_exam_score? YES) ✅
  - Attempt 2 PASSED

StudentProgress NOT recalculated automatically
```

**Week 3: Request Certificate**
```
POST /api/course/certificate/:enrollmentId/certificates/generate

System verification:
1. enrollment.status == COMPLETED ✅
2. course.is_active == true ✅
3. studentProgress.overall_progress >= 100 ✅
4. All lessons completed ✅
5. Final exam passed with score >= 75 ✅
6. IL state 20-hour requirement: 22.5 hours logged ✅

→ Certificate generated!
→ Enrollment status changed to COMPLETED
→ completed_at set to current timestamp
```

---

### Example 2: 3-Lesson Course with Live Sessions + Quiz

#### **Course Setup**
```
Course: "Advanced Techniques"
- 3 lessons
- 2 mandatory live sessions (attendance required)
- 1 quiz (70% passing)
- State: CA (40 hours armed, 80% passing)

Completion Rules:
- require_all_lessons: true
- require_final_exam: true
- min_hours_required: 40
- attendance_required: true
```

#### **User Jane Smith's Journey**

**Timeline:**
```
Day 1: Enrolls
  - CourseEnrollment created
  - status = IN_PROGRESS
  - progress = 0
  
Day 2-3: Watches lessons
  - Lesson 1: 100% watched → is_completed = true
  - Lesson 2: 100% watched → is_completed = true
  - Lesson 3: 100% watched → is_completed = true
  - Seat time: 1 hour accumulated
  
  StudentProgress:
  - overall_progress: (3/3)*40 + 0*40 + 0*20 = 40%
  
Day 4: Attends Session 1
  - Attendance marked: PRESENT
  - Seat time: +1 hour = 2 hours total
  
Day 5: Attends Session 2
  - Attendance marked: PRESENT
  - Seat time: +1 hour = 3 hours total
  
  StudentProgress:
  - overall_progress: (3/3)*40 + 0*40 + (2/2)*20 = 60%
  
Day 6: Takes quiz
  - Score: 82%
  - is_passed: true (82 >= 70) ✅
  
  StudentProgress:
  - overall_progress: (3/3)*40 + (1/1)*40 + (2/2)*20 = 100%
```

**Problem: Overall = 100% but needs 40 hours!**

```
Days 7-40: Continues with additional sessions/practice
  - Logs total 42 hours of seat time
  
When 40 hours logged:
  - State requirement met ✅
```

**Certificate Generation:**
```
POST /api/course/certificate/:enrollmentId/certificates/generate

Verification:
1. enrollment.status == COMPLETED ✅
2. All 3 lessons done ✅
3. Both sessions attended ✅
4. Quiz passed (82 >= 70) ✅
5. 42 hours >= 40 required ✅

→ Certificate issued!
```

---

### Example 3: Incomplete Course - Cannot Generate Certificate

#### **Course Setup**
```
Course: "Foundation Level"
- 4 lessons
- 1 quiz (75% passing)
**Completion Rules:**
- require_all_lessons: true
- require_final_exam: true
- min_exam_score: 80
```

#### **User Bob's Journey**

**Timeline:**
```
Day 1: Enrolls
Day 2: Watches lessons
  - Lesson 1: 100% → complete
  - Lesson 2: 85% → NOT complete (< 90%)
  - Lesson 3: 100% → complete
  - Lesson 4: 50% → NOT complete
  
  StudentProgress:
  - overall_progress: (2/4)*40 + 100*40 + 100*20 = 20 + 40 + 20 = 80%

Day 3: Takes quiz
  - Score: 78%
  - is_passed: true (78 >= 75) ✅ (passes quiz but...)
```

**Attempt to Generate Certificate:**
```
POST /api/course/certificate/:enrollmentId/certificates/generate

Verification:
1. overall_progress 80% < 100% ❌
   REJECT: Certificate generation blocked

Error Response:
{
  "statusCode": 400,
  "message": "Course not fully completed. Current progress: 80%"
}
```

**To Complete:**
```
Bob needs to:
1. Rewatch Lesson 2 to 90%+ → complete
2. Rewatch Lesson 4 to 90%+ → complete
3. Retake quiz with score >= 80% (currently 78%)

Then: overall_progress will reach 100%
Then: Can try certificate generation again
```

---

## 📱 Frontend Integration Checklist

- [ ] Display real-time progress percentage
- [ ] Show which lessons are completed (90%+ watched)
- [ ] Show which quizzes are passed
- [ ] Track session attendance
- [ ] Display seat time in hours
- [ ] Show overall progress bar
- [ ] Enable certificate generation when 100% complete
- [ ] Display certificate after generation
- [ ] Show expiry date on certificate
- [ ] Allow certificate download/printing
- [ ] Display detailed progress breakdown
- [ ] Show estimated time to complete
- [ ] Warn if missing requirements for completion

---

## 🔗 Relationships Summary

```
User (45)
  └─ CourseEnrollment (123)
     └─ status: "COMPLETED"
     └─ progress: 100
     └─ completed_at: "2026-02-15"
     │
     ├─ StudentProgress
     │  └─ overall_progress: 100
     │  └─ completed_lessons: 5
     │  └─ passed_quizzes: 1
     │  └─ attended_sessions: 2
     │
     ├─ LessonProgress (5 records)
     │  └─ Lesson[1]: is_completed=true
     │  └─ Lesson[2]: is_completed=true
     │  └─ ...
     │
     ├─ QuizAttempt (1 record)
     │  └─ Quiz[final]: is_passed=true, score=85
     │
     ├─ Attendance (2 records)
     │  └─ Session[1]: PRESENT
     │  └─ Session[2]: PRESENT
     │
     └─ Certificate (1 record)
        └─ issued_at: "2026-02-15"
        └─ expires_at: "2028-02-15"
```

---

## 🎯 Key Takeaways

1. **Course NOT complete** until:
   - Overall progress = 100%
   - All completion rules satisfied
   - Certificate can be generated

2. **Enrollment status changes to COMPLETED** when:
   - Certificate is successfully generated
   - System automatically updates status and sets completed_at

3. **Progress is weighted:**
   - Lessons: 40%
   - Quizzes: 40%
   - Sessions: 20%

4. **Multiple layers of checks:**
   - Course-level (completion rules)
   - State-level (regulatory requirements)
   - User compliance (ID verification)

5. **Seat time is accumulated:**
   - From lesson watching
   - From session attendance
   - Used to verify state hour requirements

6. **Certificate snapshot** captures state at generation:
   - Cannot be deleted if issued
   - Contains immutable record of completion
   - Shows expiry date based on state rules

---

## 🚀 SQL Queries for Status Checking

### Find all completed enrollments for a course
```sql
SELECT e.*, u.first_name, u.last_name
FROM course_enrollments e
JOIN users u ON e.user_id = u.id
WHERE e.course_id = 10
  AND e.status = 'COMPLETED'
  AND e.completed_at IS NOT NULL
ORDER BY e.completed_at DESC;
```

### Find courses with 100% progress but not marked complete
```sql
SELECT e.*, sp.overall_progress
FROM course_enrollments e
JOIN student_progress sp ON e.id = sp.enrollment_id
WHERE e.status = 'IN_PROGRESS'
  AND sp.overall_progress >= 100
ORDER BY sp.updated_at DESC;
```

### Count students at each completion percentage
```sql
SELECT
  ROUND(sp.overall_progress / 10) * 10 as progress_bucket,
  COUNT(*) as count
FROM student_progress sp
WHERE sp.course_id = 10
GROUP BY progress_bucket
ORDER BY progress_bucket DESC;
```

### Find certificates issued in last 30 days
```sql
SELECT c.*, u.first_name, u.last_name, c.course_name
FROM certificates c
WHERE c.issued_at >= NOW() - INTERVAL '30 days'
ORDER BY c.issued_at DESC;
```

---

## 📞 Support

For questions about course completion logic, check:
- [Student Progress Service](/apps/course/src/student-progress/student-progress.service.ts)
- [Certificate Service](/apps/course/src/certificate/certificate.service.ts)
- [Enrollment Service](/apps/course/src/enrollment/enrollment.service.ts)
- [Lesson Progress Service](/apps/course/src/lesson-proress/lesson-progress.service.ts)

