# VMan Documentation 

## Prerequisites
Make sure to have installed the following:
- Node v18
- git

## How to run development environment
1. Clone the VMan documentation Repository from [here](https://github.com/vman-tool/vman3-documentation) using this command:

```
git clone https://github.com/vman-tool/vman3-documentation
```

2. Install the required dependencies <br>
Navigate to the project directory using this command:
```
cd vman3-documentation
```

Once you are in, install the dependencies using command:
```
npm install
```

After installation is done

3. Open the documentation
To open the documentation run the following command:
```
npm start
```

After running the above command, the documentation will run and open the default browser under the address `localhost:3000` and if it's not automatically opened click [localhost:3000](http://localhost:3000)


## How to run in docker
make sure to have installed `docker` if not click [here](https://docs.docker.com/engine/install/) to install docker.

Once you have docker installed, you can choose to run it in a docker compose file or run a container as is:

1. To run a with docker compose file:
create a docker compose file inside the project directory;

>  For Ubuntu:
``` 
touch docker-compose.yml 
```

> For windows: <br>   
Create new file called `docker-compose.yml`

Then paste the following code:
```
version: '3.8'

services:
  docs:
    build: .
    ports:
      - "3000:3000"
    networks:
      - default
    restart: always

```

save this file.

Then Run the following command:
```
docker compose up
```

you can use `-d` to run in detached mode.

**NB**: You can add `--build` everytime you run with docker compose to make sure all the changes are built before the container runs

2. To run a docker container
 First build the docker image:
 ```
 docker build -t vman-docs .

 ```

Then run the container:
```
docker run -p 3000:3000 vman-docs

```