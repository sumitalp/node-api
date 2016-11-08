# node api bookmarking site

This project is a bookmarking site with Node.js. I chose Express.js as RESTful api development.

# Prerequisite

You must have MongoDB installed in your system.

# Running the application

To run the application you can follow these steps

Clone the repository

Install dependencies
npm install
Finally run the app
node server.js

## User Module urls
- /api/users                  [GET]
- /api/users/registration     [POST]
- /api/users/authenticate     [POST]
- /api/users/:user_id         [PUT, GET, DELETE]

## Bookmark Module urls
- /api/bookmarks              [GET]
- /api/bookmarks              [POST]
- /api/bookmarks/:user_id     [GET, DELETE]
