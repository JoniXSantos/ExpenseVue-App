# ExpenseVue

ExpenseVue is a full stack web application for personal finance management.

## Main Features 🗝️

- **Account Management:**  
  - Users are able to create an account using an email address and a secure password, which will be used for the authentication.
  - Enables password resets via email in case of forgotten credentials.
  - Accounts can be deleted at the user's discretion, permanently erasing all related data from the system.
- **Profile Management:**
  Allows users to update personal information and upload a profile picture.
- **Bank Connections:**
  - Supports secure connection and synchronization of bank accounts using the [Yapily API](https://docs.yapily.com/) for automatic transaction imports.
  - Manages the addition, updating, and removal of bank connections, with support for manual financial sources.
- **Transaction Management:**
  - Facilitates the addition, editing, and deletion of income and expense transactions.
  - Includes categorization and source assignment for better financial organization.
- **Budgeting:**
  - Offers tools to create, modify, and monitor budgets based on categories and time periods.
  - Tracks actual spending against planned budgets.
- **Balance Overview:**
  - Presents real-time summaries of total balances, monthly income, and expenses through visual cards and clear summaries.
  - Provides interactive charts and graphs to help users gain insights into their financial data.
- **Contact & Support:**
  Includes a built-in contact form for user feedback and support requests.
- **Responsive Design:**
  Delivers a seamless user experience across both desktop and mobile platforms.


## Architecture 🏗️

- **Frontend:** React.js (with React Router, Context API, and reusable components).
- **Backend:** Python Flask (RESTful API, and JWT authentication).
- **Database:** SQLAlchemy (supports PostgreSQL, MySQL, and SQLite).
- **Other Services:** [Cloudinary](https://cloudinary.com/) (for user image management), [EmailJS](https://www.emailjs.com/) (for notifications and password recovery).

## Main Folder Structure 🔍

```
src/
api/ # Flask backend (models, routes, utilities)
front/ # React frontend (components, pages, styles)
firebase/ # Firebase Auth integration (optional)
contexts/ # Authentication and global contexts
stories/ # Storybook components and documentation
```

## Installation and Configuration ⚙️

1. Clone the repository and navigate to the project folder.

2. Install the backend dependencies:
```sh
pipenv install
pipenv install cloudinary
```

3. Install the frontend dependencies:
```sh
npm install
npm install --save @emailjs/browser
npm install react-chartjs-2 chart.js
```

4. Set the environment variables:
- Copy the file `.env.example` to `.env` and fill in the necessary details for the database and external services.

5. **Perform the database migrations:**
```sh
pipenv run migrate
pipenv run upgrade
```

6. **Run the backend:**
```sh
pipenv run start
```

7. **Run the frontend:**
```sh
npm run start
```

## Collaboration and Development 👩‍💻

- There are so many things you can do in this project, for instance:
  - Create new login methods using Firebase.
  - Include IA assistance as a feature.
  - Add smart notifications, such as reminders or alerts for unusual spending, upcoming bills, or monthly expense summaries.
- Use branches for your contributions and make clear and descriptive pull requests.
- If you add a new dependency or key feature, remember to update this README.

## Authors and Contact 🆘

- [Joni Santos](https://github.com/JoniXSantos)
- [Ana Maria Páez](https://github.com/AnaPaez89)
- [Monica Solines](https://github.com/monicasolines)
- [Danny Valdivia](https://github.com/dluisvaldivia)

Do not hesitate to contact us with questions, suggestions, or to report any bug!
