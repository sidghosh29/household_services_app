# Household Services Application – V2 (H.S.A.) 

It is a multi-user app (requires one admin and other service professionals/ customers) that acts as a platform for providing comprehensive home servicing and solutions.

---

To build the Household Services Application (H.S.A.), I adopted a modular approach with a clear separation of concerns between the frontend and the backend. The following modular approach was adopted:

- Frontend Development: The application features a Vue.js 2 frontend, ensuring a responsive and interactive Single Page Application (SPA) experience. Vue Router handles navigation, while Vuex is used for state management.
- Backend Development: The backend is developed using Flask, focusing on a RESTful architecture. Flask-RESTful defines and manages APIs that act as the communication layer between the frontend and backend. Flask SQLAlchemy enables object-relational mapping (ORM) for interacting with the database.
- Security and Role Management: Flask Security Too ensures secure authentication and implements role-based access control (RBAC) with predefined roles, such as Admin, Service Professional, and Customer. This approach provides a secure login mechanism and enforces access restrictions based on user roles.
- Task Automation: Celery is used for scheduling and executing background tasks, such as: Sending daily email reminders Generating and emailing monthly activity reports Enabling admins to download CSV files
- Caching for Performance Optimization: Caching mechanisms are implemented in the backend using cache.get and cache.set which minimizes redundant database queries by storing serialized responses temporarily, ensuring faster responses for frequently requested resources, such as services.

