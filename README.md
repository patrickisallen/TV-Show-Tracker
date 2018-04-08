## TV Show Tracker App

The application is designed to let users add TV shows/movies into a list so that they can keep track of everything that they watch, add statuses to what they are watching, ratings, and episode progress. It allows you to search through the a whole database of new tv shows as well as discover everything that is available.  

## Motivation

Often times users watch hundreds and possibly thousands of hours of video content and will lose track of where they are, what they're watching or are just out to find out what new content is available. The application allows users to add shows to their list to see and keep track visually of everything. 

## Installation / Set-up

1. Modify the Vagrantfile to forward the port desired. 
2. Run using 'vagrant up' command, this may take a while. 
3. After downloads and provisioning the VM will be running the webapp. 

## The Database

The database used is MongoDB. There are 2 main tables that are used for the application. The user table and the movielist table.

The user table has the following attributes:
username, userid, email, password, movielist, and token. 
3 of the attributes are user defined (username, email, password) and 3 of the attributes are generated on the back-end (userid, movielist, token).

The movielist table has the following attributes:
id, original_name, title, episodes_watched, episodes_total, status, and rating. This table is used to store a users tv show entries. 

## The Back-end API

The main back-end API is made up of 3 overall sets of APIs. The first being the authorization API. 

The authorization API does 2 things. The first is registration.

The registration endpoint is accessed through `/api/register`
It takes in a username, password, email. What it does is it creates a new user in the user table database, and creates a movielist object in the movielist table. 

The login API accessed through the endpoint `/api/login`, takes in a username and password and checks if the username and password match and exist in the user table. If it is valid,it creates a JSON Web Token (JWT) for the current user session.

All the following APIs check if there is a valid JWT, if there is no valid JWT that matches the user, all API calls throw a 403 FORBIDDEN error. This is to ensure that the APIs are secure and cannot be accessed without a valid user. 

The user API serves as the main GET API to show user associated content. `/api/user`. It will use the userid and look up the user's movielist object in the movielist table and fetch that. 

The other user API is the abliity to look up other user's movielist tables. `/api/:uid`. The functionality is similar to previous but can be used by other users to see the list of other users. This is mainly implemented as a social feature to discover friends or other user's tv shows that exist on their list. 

The core functioanlity of the web application is defined by the following API calls.

`POST /api/movie` is used to add an entry to the user's movielist. 

`GET /api/movie/:movieid` is used to get a entry in the movielist. When you perform the GET call it gets all the current information for a movieID such as the title, total episodes, episode progress, status, and rating for that user's entry. 

`POST /api/movie/update/:movieid` is used to update a current entry in the user's movielist given the movie ID. It is used to change the fields in the user's movie list such as the episodes_watched, status, and rating. The main tracking functionality is defined by this API call and the previous.

`POST /api/movie/remove/:movieid` is used to remove an entry in the user's movielist table. 

## Front-end functionality

The front-end is divided into 3 major components. 

The login & register screen.
![register screen](https://i.imgur.com/nvBsgr2.png)
![login screen](https://i.imgur.com/5xlnHio.png)

This is where users are able to register and create an account and login to the web application. 

The main user page, user search, & search details
![user tv show list and search](http://i.imgur.com/nmsfBCg.jpg)

The user table shows all the entries that the user has added to their list which includes the ratings and progress for each. 

![search with autosuggest](https://i.imgur.com/F1TBlnl.png)
This is where users can look up tv shows and pull up more details about the TV shows that they look up. It has a built in autosuggest which shows all the closest matches to the TV show they are looking up. If there are no matches, nothing will appear.


![search details](https://i.imgur.com/MXZ9WQx.png)
The search details is where the main interaction with the back-end APIs come into play. This is where user's are able to update, remove, or add to their movie list as well as view details for the item they have looked up. 

The discovery page
![Discovery](https://i.imgur.com/FLMYSkt.jpg)
The discovery page is used to showcase a major tv show series and any of the top 5 most popular or trending tv shows.


## Problems / Incomplete items
The back-end items are complete. Main problem on the backend is the ability to add multiple entries of the same tv show to your list. 

The full ability to update, remove, add is working as intended. 

The incomplete items are mainly on the front-end:
The dialog that popus up does not have full option to add ratings, episode progress, but only status. The back-end API is able to do all of that but is not connected on the front-end. 

The ability to edit table entries in the user list for status, progress, removal, and rating. The back-end API is able to handle that but is not fully connected on the front-end. The event handler was created to do so but it was not completed. 

The discovery page does not have any real functionality such as to open a dialog to view show details and add them to your list. It was on the lower priority to complete additional functionality for that page. 


## Usage

To create user, simply access the URL and click register. Create a user, then use the user information in the previous page to login.

Ex.

Username: test
email: test@test.com
password: test

Once logged in, search for a tv show that exists (majority are available) and once the entry you were looking for shows up, click it and a dialog will pop up with all the options. 

Ex.

Search: Game of Thrones


