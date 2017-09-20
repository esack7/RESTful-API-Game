# RESTful-API Game

![alt text][logo]

[logo]: monsters.jpg " IKST"
## Table of Content

- [About](#about)
- [Contributors](#contributors)
- [Installation](#installation)
- [Playing the Game](#playing-the-game)
- [Loading and Creating Custom Games](#loading-and-creating-custom-games)
- [License](#license)

## About

RESTful-API is a game utilizing http POST, GET, PUT and DELETES methods.  The game is an API and operates as such.  This game was designed to be played using POSTMAN to send requests and recieve a response.

[POSTMAN](https://www.getpostman.com/)

## Contributors

* [Isaac Heist](https://github.com/esack7) :neckbeard:
* [Katherine Pryszlak](https://github.com/kpryzk) :eyes:
* [Said Abdou Mattar](https://github.com/saidmattar) :finnadie:
* [Tim Turner](https://github.com/ratiphi) :smiling_imp:

## Installation

Clone or fork the project to your localhost.

Navigate to the ```RESTful-API-Game/``` directory.  Run ```npm install``` to install all package dependencies.

The required dependencies are:
- bcrypt
- bluebird
- body-parser
- cors
- dotenv
- express
- jsonwebtoken
- mongoose

Create a .env file with the following:

```
MONGODB_URI='mongodb://localhost/<name of your database>'
APP_SECRET='<a secret word>'
PORT=<a port number>
```

## Playing the Game



## Loading and Creating Custom Games

### <a name="packages"></a>Packages and commands to remember:

#### For Mongo:
- npm install mongodb into your project directory (To install Mongo) -
- mongod (To start the MongoDB process)
- mongo (To start the MongoDB shell-- )

#### General:
  - In package.json's scripts, add- "start:debug": "DEBUG=http* nodemon server.js",
  - npm install express -
  - npm i or npm install (For node modules) -

###### HTTP requests:
  - node server.js or just nodemon (to start a command line server) -
  - rs (restart, if needed)
  - ^C (control-C to stop node server)
  - npm install httpie (A command line HTTP client, to be able to test making http requests. An alternative is postman.)
  - npm install superagent (To be able to make http requests) -
  - npm install uuid (For creating unique user ids) -
  - npm install -D jest (To be able to run tests) -
    - npm test (To actually run the jest test)

###### TESTS:
  - npm run start:watch (This option won't tell what is wrong with your code) -
  - npm run start:debug - (Then attempt a POST and this option will tell you where you are wrong)
  - npm run debugger (Not sure what makes this one different or special yet...)-


- Created a .env file with the following:

```
MONGODB_URI='mongodb://localhost/<name of your database>'
APP_SECRET='<a secret word>'
PORT=<a port number>
```

- In package.json, within scripts add the '--runInBand' to the 'test: jest.' This will make sure all tests run sequentially.
```
"test": "jest --runInBand",
```
- Created a `.env` & `.test.env` files
- Isaiah recommended adding this as an additional test command in package.json-    
```
 "testtwo": "jest -i",
 ```
 - If youu want to use httpie, here's a sample request to show how you would format to use a token for auth:
 ```
`http GET :5000/api/gallery/1234-5678   'Authorization:Bearer myWonderfulToken'`
```
- Adde multer to package.json
- Adde a .travis.yml file

- In server.js we 'server.stop = () => {'' the server and .close() the mongoConnection.

## License

The RESTful-API Game is licensed under the terms of MIT license and is free to be used.
