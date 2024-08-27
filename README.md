# Event Hub

**Event Hub** is a college event hosting portal designed to streamline communication about events, workshops, and other activities. This application allows teachers to easily post event details while students receive notifications based on their interests. Event Hub fosters efficient event management and ensures students stay engaged with activities that matter to them.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

### For Teachers:
- Secure login system for posting and managing events.
- Simple form to input event details like title, description, date, time, venue, and category.
- Option to tag events for better categorization (technical, cultural, sports, etc.).

### For Students:
- Personalized profile where interests can be set.
- Event notifications based on interests.
- Access to a list of all events and ability to explore new activities.
  
### General:
- Real-time notifications for students when a new event matches their selected interests.
- Responsive UI for seamless use on desktop and mobile devices.
  
## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pavanreddy565/Event-Hub.git
   ```
2. **Navigate to the project directory**:
    ```bash
   cd event-hub
   ```
3. **Install dependencies**:
   - Backend (Node.js):
     
      ```bash
      npm install
      ```
   - Frontend (React):
     
      ```bash
      cd client
      npm install
      ```
4. **Run the application**:
   - Backend (Node.js):
     
      ```bash
      nodemon server.js
      ```
   - Frontend (React):
     
      ```bash
      npm run dev
      ```
  ## Usage

### For Teachers:
- Log in using your credentials.
- Add event details through the simple event form.
- Events will be automatically available to students.

### For Students:
- Create a profile and select your areas of interest.
- Get notified when a new event matches your preferences.
- Explore and participate in various college events.

## Technologies

- **Frontend**: React, HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB or MySQL (can be configured)
- **Notification System**: Email/Push notifications integration

## Contributing

Contributions are welcome! If you would like to contribute to **Event Hub**, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit the changes (`git commit -m 'Add feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
