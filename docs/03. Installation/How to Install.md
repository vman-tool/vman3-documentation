---
sidebar_position: 2
---

# Run VMan in development Mode

## Vman3 Frontend Installation

> Prerequisites
- angular v18
- node v18


### Development server

Run this command to get the project from github to your local machine:
```
git clone https://github.com/vman-tool/vman3-frontend
```

Navigate into project folder using this command:
```
cd vman3-frontend
```

Run this command to install dependencies
```
npm install 
```

Then install angular cli if not available 
```
npm install -g @angular/cli@18
```

To run for a development server run:
```
ng serve
```
Open [http://localhost:4200/](http://localhost:4200/) in your browser. The application will automatically reload if you change any of the source files.


### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Configuration
Set ```config.json``` inside assets folder located in ``` srs/assets/``` with value

```
{
  "API_URL": "http://backend-url/vman/api/v1",
  "BASE_URL": "http://backend-url/",
  "API_URL_WS": "ws://backend-url/vman/api/v1/ws"
}

```

So that it runs in development mode.


## VMan3 API

This is the API for the Vman3 project. It is built using FastAPI and MongoDB.

> Prerequisites

- Python 3.9+
- Docker
- Docker Compose
- Git/ Git Flow

### Installation
```
Run 'git clone https://github.com/vman-tool/vman3' to copy the project local then,
Run 'cd vman3 ' to change to the project directory,

```
### 1. Create and Activate a Virtual Environment

Create a virtual environment to manage your project dependencies.

```bash
# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment (Linux/Mac)
source venv/bin/activate

# Activate the virtual environment (Windows)
venv\Scripts\activate
```

### 2. Run the following command to install the required dependencies:
```bash
pip3 install -r requirements.txt
# update .txt from venv
pip freeze > requirements.txt
```


### 3. Configure Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```bash

MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=vman3

DEFAULT_PROJECT_ID=1
ODK_API_URL=""
ODK_API_VERSION=v1
ODK_USERNAME=""
ODK_PASSWORD=""

```

### 4. add settings.json
# command copy the content of settings.json.example to settings.json

```bash

cp settings.json.example settings.json
```
# command copy the content of env_sample.example to .env

```
cp .env_sample .env
    
```

### 5. Running the arangodb database  with Docker Compose


After ensuring the above configurations, build and run the Docker containers:

```bash
docker compose up arango-db -d

```

### 6. Running the Application

Run the following command to start the FastAPI application:

```
bash uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

The application will be accessible at `http://localhost:8080/vman/api/v1`.



### 7. Running the Application with Docker Compose


After ensuring the above configurations, build and run the Docker containers:

```
bash docker-compose up --build
```

