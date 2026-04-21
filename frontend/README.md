# Provider Hub Frontend (SRS-Based)

This frontend prototype follows the SRS in `docs/srs/Software Requirements Specification (SRS).pdf`.

## Quick Run

Open `frontend/index.html` in a browser.

## SRS Coverage

- Customer Module (SRS 3.1)
  - Register / login UI
  - Search service by category
  - View provider profile list
  - Booking request form
  - Ratings / reviews input
  - Booking history

- Provider Module (SRS 3.2)
  - Provider registration/profile
  - Add service details
  - Accept/reject booking requests
  - Update availability status
  - Earnings summary cards

- Admin Module (SRS 3.3)
  - Manage users/providers
  - Verify provider accounts
  - Manage service categories
  - Generate reports
  - Suspend/deactivate account action

## Tech Alignment (SRS Section 8)

- HTML5
- CSS3
- Bootstrap 5
- JavaScript (Vanilla)

## Notes

This is a frontend prototype with mock data and UI flows. Backend integration points are ready for future API wiring (Go + Gin + MySQL + JWT).
