# Full-Stack URL Shortener

A secure, multi-user URL shortening service built with Node.js, Express, and MongoDB. This application allows users to register, log in, and manage their own short links with features like QR code generation and automatic link expiration.


##  Key Features

- **Secure User Authentication:** Stateless authentication using JWTs and bcrypt for password hashing.
- **Full CRUD Functionality:** Users can create, view, edit, and delete their own short links.
- **QR Code Generation:** Instantly generate a scannable QR code for any shortened URL.
- **Link Expiration:** Set links to automatically expire after a specified time using MongoDB TTL indexes.
- **Responsive UI:** A clean and modern user interface built with EJS and custom CSS.

---

##  Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JSON Web Tokens (JWT), bcrypt
- **Frontend:** EJS (Embedded JavaScript templates), CSS3
- **Utilities:** `qrcode`, `nanoid`, `dotenv`

---

## How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    ```
2.  **Navigate into the directory:**
    ```bash
    cd YOUR_REPO_NAME
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Create a `.env` file** in the root directory and add the following variables:
    ```
    MONGO_URL=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```
5.  **Start the server:**
    ```bash
    npm start
    ```