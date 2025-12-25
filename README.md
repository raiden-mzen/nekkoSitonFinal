<div align="center">

# ⚡ NEKKO SITON ⚡  
## 📸 Online Photography Booking System

🚀 *A futuristic, full-stack booking & management system for photography and videography services.*

![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-0F172A?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-0E1117?style=for-the-badge&logo=supabase)
![Status](https://img.shields.io/badge/Project-Final%20Project-success?style=for-the-badge)

</div>

---

## 🌌 Project Description

The **Nekko Siton Online Booking System** is a modern web-based platform designed to digitalize and streamline the booking process of **Nekko Siton Photography & Videography**.

It solves real-world problems such as:
- ❌ Forgotten or double-booked appointments  
- ❌ Disorganized client and payment records  
- ❌ Manual approval and communication workflows  

By introducing **real-time scheduling**, **role-based access**, and **centralized data management**, this system improves efficiency for admins and delivers a smoother experience for clients.

---

## 🎯 Objectives

- Prevent double bookings with real-time availability
- Centralize bookings, payments, and client data
- Provide admin-only approval & management tools
- Improve professionalism and scalability of operations
- Support future business growth

---

## 🧠 System Features

### 👤 Client Side
- Online service booking
- Date & time selection
- Real-time availability calendar
- Custom notes & special requests
- Upload proof of payment *(only after admin approval)*
- Booking status tracking
- Separated user profiles
- Responsive UI (desktop & mobile)

### 🛡️ Admin Side
- Secure admin-only access
- Approve / reject booking requests
- View and manage all bookings
- Upload & verify payment proofs
- Manage services & schedules
- Assign admin roles via database or admin panel
- Role-based authorization

---

## ⚙️ Tech Stack

| Layer | Technology |
|-----|-----------|
| Frontend | React + Vite |
| Language | TypeScript (TSX) |
| Backend | Supabase |
| Routing | React Router |
| Animation | Framer Motion |
| Icons | Lucide React |
| Calendar | React Big Calendar |
| Styling | CSS |

---

## 🗄️ Database Overview (Supabase)

### 🔑 Core Tables
- **profiles** – user data & roles
- **bookings** – booking requests & status
- **services** – photography packages
- **photography_sessions** – session details

### 🔐 Role-Based Access
- `admin`
- `client`

Admins can approve bookings and manage the system.  
Clients can only access their own data.

---

## 🔒 Supabase Security (SAFE HANDLING)

⚠️ **IMPORTANT SECURITY NOTICE**

- ❌ No API keys, passwords, or secrets are committed
- ❌ `.env` file is excluded via `.gitignore`
- ✅ Uses Supabase Auth & Row Level Security (RLS)
- ✅ Role-based authorization enforced

### `.env` Example (DO NOT COMMIT)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_public_anon_key
