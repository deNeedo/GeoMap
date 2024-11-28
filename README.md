
# GeoMap

## Overview
GeoMap is a dynamic web application that provides interactive map views with real-time geolocation features. Designed to leverage modern mapping technologies, GeoMap offers users the ability to visualize geographical locations, retrieve geolocation details, and interact with maps in an intuitive and user-friendly way. With its seamless integration between a React.js client and a Spring Boot server, GeoMap ensures a smooth and robust user experience.

## Features
- **Interactive Map Visualization**: Display customizable map views powered by OpenStreetMap.
- **Geolocation Services**: Fetch user location via IP and enable precise positioning on the map.
- **Click-to-Coordinate Logging**: Capture and log the longitude and latitude of clicked points on the map.
- **Responsive Design**: Interface that ensures optimal performance across different screen sizes.

## Getting Started

### Prerequisites

#### Common (Server & Client)
- **Java**: Java(TM) SE Runtime Environment (build 21.0.3+7-LTS-152)
- **Node.js**: Node.js 20.13.1 (or compatible)
  
#### Server
- **PostgreSQL**: PostgreSQL 16.1

### Installation

#### Quickstart Approach
- **Download Assets**: Obtain the latest release from the GitHub repository at [GeoMap Releases](https://github.com/deNeedo/GeoMap/releases/latest).
  - Look for the following files: **server-X.Y.jar**, **client.zip**, and **init.sql**, where **X** and **Y** represent the version number.

- **Initialize Database**:
  ```bash
  psql -f ./path/to/init.sql
  ```

- **Run the Server**:
  ```bash
  java -jar server-X.Y.jar
  ```

- **Run the Client**:
  Extract the `client.zip` and start the client development server:
  ```bash
  npm install
  npm start
  ```

#### Manual Compilation
- **Clone the Repository**:
  ```bash
  git clone https://github.com/deNeedo/GeoMap.git
  ```

- **Build Server**:
  ```bash
  ./gradlew build
  ```

- **Set Up Database**:
  ```bash
  psql -f ./database/init.sql
  ```

- **Run the Client**:
  Navigate to the client directory:
  ```bash
  cd client
  npm install
  npm start
  ```

## Usage

### Key Features Walkthrough

#### Interactive Map
- On loading, GeoMap fetches the user's geolocation based on their IP address and centers the map accordingly.
- Clicking anywhere on the map logs the longitude and latitude of that point in the console.

#### Server Logs
- After starting the server, it initializes the database connection and displays readiness logs.

#### Example Use Case
1. Open the GeoMap application in your browser.
2. Allow geolocation permissions if prompted.
3. View the map centered on your current location.
4. Click on any map point to capture its coordinates.

## Contribution
GeoMap is an open-source project. Contributions, feedback, and suggestions are welcome. Please submit issues or feature requests via the [GitHub repository](https://github.com/deNeedo/GeoMap).

## License
GeoMap is distributed under the MIT License. See the [LICENSE](https://github.com/deNeedo/GeoMap/blob/dev/LICENSE.md) file for details. 
