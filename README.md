# Similar Movies App

https://cb-movierecs.glitch.me/

This web app allows the user to enter a movie and they will be given
back a list of similar movies. The user can add those movies to their
list and also delete them later. The user can create an account or
continue anonymously.

## Features

* Account creation
* Movie recommendations
* Save movies to a list
* Information stored in a database

## How it works

* Get similar movies
    1. User enters a movie and a GET request is sent to /api/movie
    2. That endpoint is configured to send a GET request to the search movie API at themoviedb.org
    3. A movie id is returned and another GET request is sent to the similar movies API
    4. It returns a list of similar movies and /api/movie writes it down as a response.

* Creating an account or logging in
    1. Either a POST request is sent to /api/signUp or a GET request is sent to /api/login
    2. The server connects to a mysql database and does a query to either create an account or check if usernames and passwords match.
    3. A response is sent back to the client and the account is created, the user is logged in, or the user is informed of an invalid login.

* Movie lists
    * Add movie
        1. A POST request is sent to /api/addMovie using an object containing the user, image path, title, rating.
        2. The server sends an insert query to the database that information

    * Remove movie
        1. A DELETE request is sent to /api/removeMovie using an object containing the user and movie title.
        The server sends a delete query to the database where user and title equals the same ones provided in the request.

    * Get user list
        1. A GET request is sent to /api/getList/:user.
        2. The server sends a select query for the movies where user equals ":user"
        3. A response is sent back with the applicable movies

## How to use

* Get similar movies
    * Enter a movie in the input box and press enter
    * Use the buttons or scroll to navigate around the list

* Add movies to your list
    * Click on 'add to list'

* Remove movies from list
    * Click 'remove'

* Create Account
    * Click 'sign up' and enter the info requested
    * Click 'create account'

* Log in
    * Click 'log in' and enter your info
    * Click 'log in'