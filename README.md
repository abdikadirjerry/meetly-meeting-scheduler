# Meetly — Meeting Scheduler

A modern, responsive meeting scheduling dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Meetly helps users organize appointments, manage their schedules, explore meetings through a calendar, and receive meeting reminders.

## Features

- **Dashboard overview** — View meeting statistics, today's meetings, upcoming appointments, completed meetings, and your next meeting.
- **Meeting management** — Create, view, edit, complete, and delete meetings.
- **Calendar view** — Navigate between months, select dates, and view scheduled meetings.
- **Meetings list** — Browse meetings and organize your schedule.
- **Search and filters** — Find meetings and filter or sort them by relevant criteria.
- **Scheduling validation** — Validate required fields, meeting times, and conflicting schedules.
- **Local persistence** — Keep meetings and notifications saved in browser local storage across page refreshes.
- **Notifications and reminders** — Receive in-app notifications and browser notifications for upcoming meetings.
- **Responsive interface** — Use the dashboard on desktop, tablet, and mobile screens.

## Technology Stack

- [Next.js](https://nextjs.org/) — App Router
- [React](https://react.dev/) — UI components
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling and responsive layouts
- [Lucide React](https://lucide.dev/) — Icons
- Browser `localStorage` — Client-side data persistence
- [Git](https://git-scm.com/) and [GitHub](https://github.com/) — Version control
- [Vercel](https://vercel.com/) — Deployment

## Getting Started

### Prerequisites

Install the following before running Meetly:

- [Node.js](https://nodejs.org/) compatible with the version of Next.js used by this project
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/meetly-meeting-scheduler.git
   ```

2. Navigate into the project directory:

   ```bash
   cd meetly-meeting-scheduler
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Commands

```bash
# Start the development server
npm run dev

# Run ESLint
npm run lint

# Create a production build
npm run build

# Run the production server after building
npm run start
```

## Project Structure

The project follows a feature-oriented Next.js App Router structure. The main directories include:

```text
meetly-meeting-scheduler/
├── public/                 # Static assets
├── src/
│   ├── app/                # Application routes and layouts
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Reusable React hooks
│   ├── lib/                # Utilities and scheduling logic
│   └── types/              # TypeScript type definitions
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

Individual files may vary as the project evolves.

## Data Storage and Notifications

Meetly is a frontend-only application. Meeting data and in-app notifications are stored in the browser using `localStorage`.

- Data is stored locally in the browser rather than in a remote database.
- Data is not automatically synchronized across different browsers or devices.
- Clearing the browser's site data may remove locally stored meetings and notifications.
- Browser notifications require permission from the user.
- Meeting reminders are checked while the application is open. They are not guaranteed to run when the browser or application is closed.
- Meetly does not currently provide user accounts or cloud synchronization.

## Screenshots

Screenshots of the dashboard, calendar, meeting form, and notification panel can be added here.

<!-- Add screenshots to a project screenshots directory and link them here. -->

## Future Improvements

- Add optional export and import of meeting data.
- Improve notification preferences and reminder settings.
- Add automated tests for scheduling and validation logic.
- Further refine accessibility and responsive behavior.

## Deployment

Meetly can be deployed to [Vercel](https://vercel.com/).

1. Push the project to a GitHub repository.
2. Sign in to Vercel and import the repository.
3. Keep the detected Next.js framework settings unless the project requires changes.
4. Deploy the application.
5. Open the generated deployment URL and verify the main features.

For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Contributing

This project is maintained as a personal portfolio project. Suggestions and improvements are welcome.

## License

No license has been specified yet. Add a `LICENSE` file if you decide to distribute the project under an open-source license.
