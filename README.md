# CampusConnect

> **Connect. Help. Resolve. Together.**
> *Smart Peer-to-Peer Campus Assistance & Issue Management Platform*

CampusConnect is a full-stack MERN application that brings together **peer-to-peer academic & technical assistance, intelligent student matching, campus infrastructure issue reporting, and administrator triage** into a single digital platform.

---

## 🌟 Key Features

### 1. Peer-to-Peer Assistance & Smart Matching Engine
- **Intelligent Weighted Scoring**:
  - **50% Skill Match**: Calculates intersection of requested skills with student skills.
  - **20% Availability**: Evaluates schedule compatibility.
  - **15% Location**: Checks proximity across campus blocks/departments.
  - **15% Reputation**: Factors helper's historical ratings and completed sessions.
- **Connection Lifecycle**: `PENDING` &rarr; `ACCEPTED` &rarr; `ACTIVE` &rarr; `COMPLETED`.
- **Reputation & Ratings**: Requesters submit 5-star ratings and feedback, dynamically updating helper reputation scores.
- **Mutual Skill Exchanges**: Automatically identifies students with reciprocal learning goals (e.g. Yashas teaches Flutter and wants Python; Alex teaches Python and wants Flutter).

### 2. Campus Infrastructure Issue Tracking
- **Student Reporting**: Report broken equipment, Wi-Fi issues, electrical, plumbing, lab, and cleanliness problems with location and severity.
- **6-Stage Lifecycle Stepper**: `REPORTED` &rarr; `UNDER REVIEW` &rarr; `ASSIGNED` &rarr; `IN PROGRESS` &rarr; `RESOLVED` &rarr; `CLOSED`.
- **Complete Audit Trail**: Live status history with timestamped updates and notes.

### 3. Administrator Portal
- **Centralized Dashboard**: Live counters of registered students, active issues, help requests, and resolved problems.
- **Urgent Issue Triage**: 1-click team dispatch and resolution notes logging.
- **User Directory**: View student reputation scores, ratings, and promote/demote roles.

---

## 🚀 Instant Demo Personas (1-Click Login)

The login page includes pre-seeded demo accounts matching the PRD scenarios:

| Persona | Name | Email | Password | Role / Specialty |
|---|---|---|---|---|
| **Student Helper** | Yashas Gowda | `yashas@campusconnect.edu` | `Student@123` | Flutter, Firebase, Dart, Node.js (4.9⭐, 95 Rep) |
| **Student Requester** | Alex Rivera | `alex@campusconnect.edu` | `Student@123` | Needs Flutter help; reported projector issue |
| **Campus Admin** | Campus Administrator | `admin@campusconnect.edu` | `Admin@123` | Facilities & Staff Authority |

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6.
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, Morgan.
- **Database**: MongoDB (Atlas or local), with automatic in-memory fallback (`mongodb-memory-server`) for zero-config local runs.

---

## 💻 Getting Started

### 1. Start Backend Server
```bash
cd server
npm install
node server.js
```
*Backend starts on `http://localhost:5000`. It automatically seeds demo data on initial launch.*

### 2. Start Frontend Client
```bash
cd client
npm install
npm run dev
```
*Frontend opens on `http://localhost:5173` with full API proxying to port 5000.*

### 3. Run Automated API Tests
```bash
cd server
npm run test:api
```
