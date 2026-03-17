# Clinique CMS Frontend

Modern Next.js frontend for the Clinic Queue Management API. The UI is dark, minimal, and role-based (admin, doctor, receptionist, patient) with HTTP-only cookie auth.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Demo credentials

- Email: enrollment@darshan.ac.in
- Password: password123

## Environment

Create a .env.local file:

```
CMS_API_URL=https://cmsback.sampaarsh.cloud
```

If you skip this, the app defaults to the production API.

## App structure

- Home page: login + overview
- Dashboard: role-based panels

## Role workflows

### Admin

- View clinic overview (clinic code, counts)
- List users
- Create doctor/receptionist/patient accounts

### Patient

- Book appointment (date + time slot)
- View appointments
- Load appointment details (prescription/report)
- View prescriptions and reports

### Receptionist

- Load queue for a date
- Update queue status: in-progress, done, skipped

### Doctor

- View today’s queue
- Add prescriptions (medicines, notes)
- Add reports (diagnosis, tests, remarks)

## API proxy routes

The frontend calls Next.js API routes that attach the JWT from an HTTP-only cookie:

- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- GET /api/admin/clinic
- GET/POST /api/admin/users
- POST /api/appointments
- GET /api/appointments/my
- GET /api/appointments/:id
- GET /api/queue?date=YYYY-MM-DD
- PATCH /api/queue/:id
- GET /api/doctor/queue
- GET /api/prescriptions/my
- POST /api/prescriptions/:appointmentId
- GET /api/reports/my
- POST /api/reports/:appointmentId
- GET /api/health

## Notes

- JWT is stored in an HTTP-only cookie (cms_token).
- User data is stored in a readable cookie (cms_user) for client routing and labels.
- Role checks are enforced by the backend; the UI adapts based on user role.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
