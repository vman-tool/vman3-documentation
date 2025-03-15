---
sidebar_position: 1
---

# Run VMan in production mode (Installation Guide)
To run VMan  in your system for production. Make sure to have the following:
> prerequisite
> - docker
> - docker compose
> - internet access

Then follow the following steps to install VMan:

1. Create folder named vman using the command below:
```
sudo mkdir vman
```
2.  Navigate inside VMan directory:
```
cd vman
```
3. Create file named `docker-compose.yml` using command below:
```
sudo touch docker-compose.yml
```
4. Edit the `docker-compose.yml` file using the following command:
```
sudo nano docker-compose.yml
```
5. Paste the following content or write it inside the file:
```
version: '3.8'

services:
  frontend:
    image: ilyatuu/vman3_frontend
    ports:
      - 8900:80
    volumes:
      - ./config.json:/usr/share/nginx/html/assets/config.json
    depends_on:
      - backend
      - arango-db
    networks:
      - default
    restart: always

  backend:
    image: ilyatuu/vman3_backend

    command:
      [
        'uvicorn',
        'app.main:app',
        '--host',
        '0.0.0.0',
        '--port',
        '8080',
        '--workers',
        '2',
      ]
    ports:
      - '8901:8080'
    volumes:
      - ./app:/app
      - .settings.json:/vman3/settings.json
      - ./uploads:/vman3/app/uploads
    environment:
      - PYTHONUNBUFFERED=1
    env_file:
      - .env
    depends_on:
      - arango-db
    restart: always
  arango-db:
    image: arangodb/arangodb:3.12.2
    env_file:
      - .env
    volumes:
      - vman3db:/var/lib/arangodb3
    restart: always
    command:
      - arangod

      - --server.endpoint=tcp://0.0.0.0:8529
      - --rocksdb.write-buffer-size=128MB
      - --rocksdb.total-write-buffer-size=512MB

volumes:
  vman3db:
  config.json:
  uploads:

```
6. press `ctrl + o` to save then `ctrl + x` to close the file for **nano** editor.
7. create `config.json` file using the following command:
```
sudo touch config.json
```
8. Add the following content just like in the other file above:
```
{
  "API_URL": "https://backend-url/vman/api/v1",
  "BASE_URL": "https://backend-url",
  "API_URL_WS": "wss://backend-url/vman/api/v1/ws",
  "DOCUMENTATION_URL": "https://vman3.vatools.net/docs/"
}
```
> Note: `backend-url` and `frontend-url` should be replaced by your server domain name or ip address.
> - We recommend you use SSL protected server address.
> - Leave documentation link as is so you can access documentation link when you're using the system 
9. Save the file and let's move on to the next step
10. Create a file named `.env` as explaned above then paste the following content and update accordingly
```
DB_URL=http://arango-db:8529
DB_NAME=vman3
DB_ROOT_USER=root
ARANGO_ROOT_PASSWORD=your-password

DEFAULT_ACCOUNT_NAME=Administrator
DEFAULT_ACCOUNT_EMAIL=admin@vman.net #Update to your default user
DEFAULT_ACCOUNT_PASSWORD=password # Update password

FRONTEND_HOST=frontend-url
ACCESS_TOKEN_EXPIRE_MINUTES=10
REFRESH_TOKEN_EXPIRE_MINUTES=20


#CORS
CORS_ALLOWED_ORIGINS=http://127.0.0.1:4200,http://127.0.0.1:8080,http://localhost:4200,http://localhost:8080

#force https
FORCE_HTTPS_REDIRECT=False

```
> - Default account name, email and password should be added as per user
- Password must have:
>	- 1 Capital letter
> - 1 Special Character
> - 1 Numeric Character
> - At least 8 characters 

Once done save and close the file.
12. To start the VMan system run the following command:
```
sudo docker compose up -d
```
The system will be downloaded to your machine and get started.
13. When no domain name is linked, the system will be available under `http://your-ip-address:8900`

Once all is done you will be able to access the VMan system.

Cheers and Welcome!