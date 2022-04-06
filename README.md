# Mood Tracker API

This is a simple API design for use with a PostgreSQL database and [Auth0](https://auth0.com/). 

## Why I made this

**The scenario:** I want to do mood tracking.  
**The problem:** I hate journalling and I can't be bothered to open a mood tracking app and log something every day.  
**The hypothesis:** iOS shortcuts can do many things, like prompting to choose from a list. Can it send http requests??  
**The answer:** [Yes it can](https://support.apple.com/en-nz/guide/shortcuts/apd2d448b2de/ios). It can also parse JSON! 

So, basically I made this API because I'm lazy.

## How I use it

Personally I host a copy on Heroku free hosting with Heroku Postgres. I integrate it with Apple Shortcuts so I can log a mood daily with just one tap.

Here are the steps for my setup.

### Local development

`npm install` - install dependencies

`npm start` - start dev server on localhost:5001/api

`docker-compose up` - start a postgres database in a docker container for testing.  

### Deployment to Heroku

If you don't have Heroku CLI: `brew tap heroku/brew && brew install heroku`  
Create an account on [Heroku](https://www.heroku.com/).

Create the app:
`heroku login`  
`heroku create <appname>`  
`heroku addons:create heroku-postgresql:hobby-dev -a <appname>`

In a terminal in the root directory:
`heroku git:remote -a <appname>`  
`git push heroku main`

### Connect to a postgres client

1. Go to your [Heroku dashboard](https://dashboard.heroku.com/apps) and click your app
2. Click on 'Resources' then 'Heroku Postgres'
3. Click on 'Settings' then 'View credentials...'
4. Use these credentials to connect to your db via a client e.g. Postico
5. Check that the schema was loaded, otherwise [add it](https://github.com/rachelgrimwood/tracker-api/blob/main/db/sql/01_database_schema.sql)

### Connect Auth0

For safety!! I added auth to this app from auth0. I'm pretty sure the free trial period is only related to the number of users of an app so it should be all good.

1. Create an [Auth0](https://auth0.com/) account
2. Create a new tenant
3. In the dashboard sidebar, click 'Applications' then 'APIs'. Create an API, make up a name and identifier
4. In the dashboard sidebar, click 'Applications' then 'Applications'. Create a machine-to-machine application and for authorization, select the auth0 API you just made.
5. Go back to your Heroku app dashboard and click 'Settings', then 'Reveal Config Vars'. DATABASE_URL should already be there.
6. Add convig vars:
    - AUTH0_AUDIENCE: The identifier for the auth0 API that you made
    - AUTH0_ISSUER_BASE_URL: https://(your-tenant-name).(your-region).auth0.com. You can find yours under 'Domain' in your machine-to-machine application as well.

### Make an iOS shortcut

1. Make a new shortcut.
2. Go to your machine-to-machine application in Auth0 and click 'Settings'. You will be using the credentials under 'Basic information'.
3. Add action: Get contents of URL. For URL, put the Domain from your machine-to-machine application but add /oath/token
4. Click the little sideways arrow after the url. Change the method to POST. Add a JSON request body with these key-values, using values from your machine-to-machine application and auth0 api:
    - client_id: (Client ID)
    - client_secret: (Client Secret)
    - audience: (the identifier from the auth0 API that you made)
    - grant_type: client_credentials
5. Add action: Get Dictionary Value. Populate it as: Get `Value` for `access_token` in `Contents of URL` (linked to the action above it).
6. Add action: List. Populate the list with some preset moods that you want to track.
7. Add action: Choose from List (linked to the action above it). 
8. Add action: Get Contents of URL. For the URL, put https://(your-heroku-app).herokuapp.com/api?mood= Then click Chosen Item from your autocorrect bar and it should append the chosen item from the List to the URL.
9. Add action: Dismiss Siri and Continue. That's it!
10. Now: close your shortcut and go to the automations menu. Create a new automation with the action Run Shortcut for your shortcut. Choose when you want to be prompted! Now you will be prompted for your daily mood. The mood will be logged with just one click.
  
## What now???
  
Once you have enough data... Make an app to query and analyse your data 🧐
