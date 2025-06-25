## 👤 Author

**Name:** [Anas-dev](https://github.com/Anas6424)

---

## 🎯 Project Objective

Build a web-based attendance tracking application to help school teachers manage sessions, courses (UEs), exams, rooms, and student attendance effectively.

---

## 🛠️ Technologies Used

* **Vue 3**
* **Pinia** (state management)
* **Vue Router** (routing)
* **TailwindCSS** (styling)
* **Supabase** (database + Google OAuth)
* **Vite** (build tool)
* **ESLint** (code linting)

---

## ✅ Features

* Google OAuth login
* List and create new sessions
* Session detail view with associated courses (UEs)
* Add unlinked UEs to sessions
* Manage exams for each UE
* Assign rooms to exams (duplicate prevention)
* Assign and update invigilators
* Toggle-based student attendance tracking by room
* Auto-redirect after login/logout
* Reusable UI components:
  * Generic table
  * Breadcrumb navigation
* Centralized Supabase API logic via service files

---

> 🔒 **Access Restriction:**  
> Session data includes private academic and personal information. Only authorized users can access or interact with protected sections of the application.

> ⚠️ **Important Note:**  
> This project relies on a custom Supabase schema. If you are using your own Supabase instance, you will need to **replicate the exact database structure** (tables, columns, relationships, etc.).  
> Without it, some features may **not function correctly or at all**.

---

## ▶️ Installation & Running the App

```bash
# 1. Install project dependencies
npm install
```

```bash
# 2. Create a .env file with your Supabase credentials
# (based on .env.example)
```

Inside your project root, create a .env file and add:

```bash
VITE_SUPABASE_URL=https://your-supabase-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-api-key
```

You can find these values in your [Supabase project settings](https://app.supabase.com/project/_/settings/api).

```bash
# 3. Run the project in development mode
npm run dev
```