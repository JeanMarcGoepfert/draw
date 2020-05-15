TODO:
- drawing controls
- handle room not found etc, 404s
- start each user with diff colour?
- created/updated timestamps
- deploy
- set up domain

### Requirements

* Apache Maven
* JDK 8+

### Getting started

```
docker-compose up
redis-commander --redis-host 192.168.42.45 //replace this with your docker host ip
./redeploy.sh
```

Deploying:
```
git push heroku master
```

Or

```
mvn test exec:java
```

### Building the project

To build the project, just use:

```
mvn clean package
```

It generates a _fat-jar_ in the `target` directory.
