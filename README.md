# GearLoop – Client

GearLoop is a modern equipment rental platform designed to connect equipment owners with customers. Users can explore available equipment, make rental bookings, complete secure payments, and manage their rental activities through personalized dashboards.

This repository contains the frontend application of GearLoop, built with Next.js, React, and TypeScript.

## 🚀 Live Demo

- **Live Website:** `YOUR_LIVE_WEBSITE_URL`
- **Client Repository:** `YOUR_CLIENT_REPOSITORY_URL`
- **Server Repository:** `YOUR_SERVER_REPOSITORY_URL`

## ✨ Key Features

### Authentication
- User registration and login.
- Google Authentication.
- Secure session management.
- Role-based dashboard access.

### Customer Features
- Browse approved equipment listings.
- Search and explore equipment.
- View detailed equipment information.
- Add and remove favorite equipment.
- Book equipment with rental dates and quantity.
- Complete payments through Stripe Checkout.
- View personal rental history.
- Manage profile information.

### Owner Features
- Add new equipment listings.
- Manage existing equipment.
- View rental requests.
- Approve or reject booking requests.
- Monitor rental performance and earnings.
- Access owner analytics.

### Admin Features
- Manage registered users.
- Update user roles.
- Approve or reject equipment listings.
- Monitor all equipment and bookings.
- View platform analytics and revenue statistics.

### UI & User Experience
- Modern SaaS-inspired dashboard.
- Responsive design for desktop, tablet, and mobile.
- Dark and Light theme support.
- Loading and error states.
- Interactive components and animations.
- Toast notifications for user feedback.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Frontend Framework |
| React | UI Development |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Better Auth | Authentication |
| Stripe | Payment Integration |
| Lucide React | Icons |

## 📁 Project Structure

```text
gearloop-client/
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── add-equipment/
│   │   │   ├── favorites/
│   │   │   ├── my-equipment/
│   │   │   ├── my-rentals/
│   │   │   ├── owner-rentals/
│   │   │   ├── profile/
│   │   │   └── ...
│   │   ├── login/
│   │   ├── register/
│   │   ├── equipment/
│   │   └── ...
│   ├── components/
│   └── lib/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd gearloop-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Add any additional authentication and payment environment variables required by your application.

Never expose secret keys or commit environment files to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

### 6. Build for Production

```bash
npm run build
```

## 🔗 Backend Integration

The frontend communicates with the GearLoop Express backend through REST API requests.

**Backend API URL:**

`http://localhost:5000`

The API handles authentication verification, equipment management, booking operations, payment processing, and dashboard data.

## 💳 Payment Integration

GearLoop integrates Stripe Checkout for secure equipment rental payments.

The frontend redirects customers to Stripe Checkout to complete their payments and handles the payment result through the application's success flow.

## 👥 User Roles

| Role | Access |
|---|---|
| Customer | Browse, favorite, book, and manage rentals |
| Owner | Manage equipment and rental requests |
| Admin | Manage users, equipment, bookings, and analytics |

## 📸 Screenshots

Add project screenshots here after completing the final UI review.

- Home Page: `ADD_HOMEPAGE_SCREENSHOT`
- Equipment Listing: `ADD_EQUIPMENT_SCREENSHOT`
- Customer Dashboard: `ADD_CUSTOMER_DASHBOARD_SCREENSHOT`
- Owner Dashboard: `ADD_OWNER_DASHBOARD_SCREENSHOT`
- Admin Dashboard: `ADD_ADMIN_DASHBOARD_SCREENSHOT`

## 🔮 Future Improvements

- Advanced search and filtering.
- Pagination for large equipment listings.
- Enhanced analytics and reporting.
- Additional notification features.
- Further performance and accessibility improvements.

## 👨‍💻 Developer

**Project:** GearLoop  
**Type:** Equipment Rental Platform  
**Frontend:** Next.js + React + TypeScript  
**Backend:** Express.js + MongoDB

---

**GearLoop – Making Equipment Rental Simple and Convenient.**