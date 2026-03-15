---
sidebar_position: 1
---

# Run VMan in production mode (Installation Guide)
This is the guide on how you can run VMan  in production (Linux Server - Debian based):
> prerequisite
> - docker
> - docker compose
> - Linux understanding
> - Nginx

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
      - 8900:4200
    volumes:
      - ./config.json:/usr/share/nginx/html/assets/config.json
    depends_on:
      - backend
      - arango-db
    networks:
      - default
    restart: always

  backend:
    image: ilyatuu/vman3_backend:latest

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
      - ./ccva_files:/app/ccva_files
      - ./app:/app
      - .settings.json:/vman3/settings.json
      - ./uploads:/vman3/app/uploads
    environment:
      - PYTHONUNBUFFERED=1
    env_file:
      - .env
    depends_on:
      - arango-db
    networks:
      - default
    restart: always

  # docs:
  #   build: ./docs
  #   ports:
  #     - '8902:3000'
  #   networks:
  #     - default
  #   restart: always

  arango-db:
    image: arangodb/arangodb:3.12.2
    env_file:
      - .env
    volumes:
      - vman3db:/var/lib/arangodb3
    ports:
      - '8529:8529'
    networks:
      - default
    restart: always
    command:
      - arangod


  redis:
    container_name: redis-vman3
    image: redis:latest
    command: redis-server --requirepass vman@1029
    ports:
      - "6370:6379"


  # Celery worker for background task processing (CCVA, ODK sync)
  celery-worker:
    container_name: celery-worker
    image: ilyatuu/vman3_backend:latest
    command:
      [
        "python",
        "-m",
        "celery",
        "-A",
        "app.celery_app",
        "worker",
        "--loglevel=info",
        "--concurrency=2",
        "-Q",
        "celery,ccva,odk"
      ]
    volumes:
      - ccva_files:/app/ccva_files
      - app_data:/app
    env_file:
      - .env
    environment:
      PYTHONUNBUFFERED: "1"
      REDIS_CELERY_URL: "redis://redis"
    depends_on:
      - redis
      - arango-db
    restart: always

  # Flower - Celery monitoring UI (access via nginx with auth)
  flower:
    container_name: flower
    image: ilyatuu/vman3_backend:latest
    command:
      [
        "python",
        "-m",
        "celery",
        "-A",
        "app.celery_app",
        "flower",
        "--port=5555",
        "--url_prefix=flower"
      ]
    # Port not exposed directly - access via nginx with auth
    # ports:
    #   - "5555:5555"
    env_file:
      - .env
    environment:
      REDIS_URL: "redis://redis:6379"
      REDIS_CELERY_URL: "redis://redis"
    depends_on:
      - redis
      - celery-worker
    restart: always

volumes:
  vman3db:
  ccva_files:
  app_data:
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
# ACCOUNT DEFAULT INFORMATION
DEFAULT_ACCOUNT_NAME=admin
DEFAULT_ACCOUNT_EMAIL=admin@vman.net
DEFAULT_ACCOUNT_PASSWORD=******

USE_CELERY=true
REDIS_CELERY_URL=redis://redis
REDIS_URL=redis://:******@redis-vman3
REDIS_PASSWORD=******
DB_URL=http://arango-db:8529

# Database
DB_NAME=vman3
DB_PASSWORD=password
ARANGO_ROOT_USER=root
ARANGO_ROOT_PASSWORD=******
ARANGODB_URL=http://localhost:8529/

DB_ROOT_USER=root

CORS_ALLOWED_ORIGINS=http://localhost:4200,http://127.0.0.1:4200,'*'

APP_NANE=DescriblyFastAPIApp
DEBUG=True
SECRET_KEY=******


# SMTP Local Config
USE_CREDENTIALS=False

# JWT Secret
JWT_SECRET=******
REFRESH_TOKEN_EXPIRE_MINUTES=15
ACCESS_TOKEN_EXPIRE_MINUTES=10

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

11. To start the VMan system run the following command:
```
sudo docker compose up -d
```
The system will be downloaded to your machine and get started.

12. Where no domain name is linked, the system will be available under `http://your-ip-address:8900`

13. If domain name is linked and want to use reverse proxy specifically nginx. You will have to use these conf for vman to work properly:
```
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;

    keepalive_timeout 65;
    client_max_body_size 100M;

    # Docker embedded DNS (VERY IMPORTANT)
    resolver 127.0.0.11 valid=10s ipv6=off;

    # =========================
    # UPSTREAMS (LOAD BALANCED)
    # =========================

    upstream frontend_upstream {
        zone frontend 64k;
        server frontend:8900 resolve;
    }

    upstream backend_upstream {
        zone backend 64k;
        least_conn;
        server backend:8901 resolve;
    }

    # upstream doc_upstream {
    #     zone docs 64k;
    #     least_conn;
    #     server docs:8902 resolve;
    # }

    upstream arango_upstream {
        zone arango 64k;
        server arango-db:8529 resolve;
    }

    # Flower - Celery monitoring UI
    upstream flower_upstream {
        zone flower 64k;
        server flower:5555 resolve;
    }

    # =========================
    # SERVER
    # =========================
    server {
        listen 80;
        server_name vman3.vatools.net www.vman3.vatools.net localhost; # change to your custome domain

        # ----------------------
        # Health check
        # ----------------------
        location /nginx-health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # ----------------------
        # Frontend (Angular)
        # ----------------------
        location / {
            proxy_pass http://frontend_upstream;
            proxy_http_version 1.1;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 5s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;

            # Buffers
            proxy_buffer_size 128k;
            proxy_buffers 8 128k;
            proxy_busy_buffers_size 256k;
            
            # CORS Headers
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods 'GET, POST, PUT, DELETE, OPTIONS';
            add_header Access-Control-Allow-Headers 'Origin, Content-Type, Accept, Authorization';
        }

        # ----------------------
        # Backend API
        # ----------------------
        location /vman/api/v1 {
            proxy_pass http://backend_upstream;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Specific headers for backend
            proxy_set_header Content-Security-Policy "upgrade-insecure-requests";

            proxy_connect_timeout 10s;
            proxy_send_timeout 86400s;
            proxy_read_timeout 86400s;

            # Buffers
            proxy_buffer_size 128k;
            proxy_buffers 8 128k;
            proxy_busy_buffers_size 256k;
        }

        # ----------------------
        # WebSocket (FastAPI)
        # ----------------------
        location /vman/api/v1/ws {
            proxy_pass http://backend_upstream;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
        }

        # ----------------------
        # Uploads (Backend)
        # ----------------------
        location /uploads {
            proxy_pass http://backend_upstream;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 10s;
            proxy_read_timeout 86400s;
            proxy_send_timeout 86400s;
        }

        # ----------------------
        # ArangoDB
        # ----------------------
        location /_db {
            proxy_pass http://arango_upstream;
            proxy_redirect off;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            proxy_set_header Content-Security-Policy "upgrade-insecure-requests";
            proxy_buffer_size 128k;
            proxy_buffers 8 128k;
            proxy_busy_buffers_size 256k;
        }

        location /db {
            proxy_pass http://arango_upstream/; 
        }

        # ----------------------
        # Flower (Celery Monitoring) - Protected with Basic Auth
        # ----------------------
        location /flower {
            # Basic Authentication - generate with: htpasswd -c /etc/nginx/.htpasswd admin
            #auth_basic "Celery Monitoring";
            #auth_basic_user_file /etc/nginx/.htpasswd;

            proxy_pass http://flower_upstream;
            proxy_http_version 1.1;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_redirect off;
            rewrite ^/flower/(.*)$ /$1 break;
        }

        # ----------------------
        # Documentation
        # ----------------------
        #location /docs {
        #    proxy_pass http://docs_upstream;
        #
        #    proxy_set_header Host $host;
        #    proxy_set_header X-Real-IP $remote_addr;
        #    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        #    proxy_set_header X-Forwarded-Proto $scheme;
        #    rewrite ^/docs/(.*)$ /$1 break;
        #    #proxy_redirect http://$docs:3000/ /docs/;
        #}

    }
}
```

> NB: Uncomment documentation related blocks if you want local documentation otherwise you can always read latest documentation at [VMan Docs](https://vman3.vatools.net/docs)

> if you need documentation locally

14. Within `vman` directory, run this command:
```
git clone https://github.com/vman-tool/vman3-documentation
```

15. Rename documentation directory:
```
mv vman3-documentation docs
```

16. Rerun the server if it was the first time.
```
docker compose up -d
```


Cheers and Welcome!