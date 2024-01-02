# Mood Tracker API

This is a simple API design for use with a PostgreSQL database and [Auth0](https://auth0.com/). 

## Why I made this
 
**The problem:** Having to open a mood tracking app and navigate through it to log something every day is tedious. How can I track mood daily, but with as few clicks as possible?  
**The hypothesis:** iOS shortcuts can do many things, like prompting to choose from a list. Can it automate sending http requests?  
**The solution:** [Yes it can](https://support.apple.com/en-nz/guide/shortcuts/apd2d448b2de/ios). It can also parse JSON!  
**The result:** Mood tracking with a single click!

## How I use it

Back when Heroku was free, I hosted it with Heroku Postgres. I also integrated it with Apple Shortcuts so I can log a mood daily with just one tap.

Here are the steps for my setup.

### Local development

`npm install` - install dependencies

`npm start` - start dev server on localhost:5001/api (either comment out the auth0 code in app.js or add your auth0 environment variables to the .env for local testing.)

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

I added auth config to this API for Auth0. A single user is covered by the free trial.

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
3. Add action: Get Contents of URL. For `URL`, put the Domain URL from your machine-to-machine application but add `/oath/token`.
4. Click the sideways arrow after the url. Change the method to `POST`. Add 4 new Text fields under `Request Body` (make sure the option to the right of `Request Body` says `JSON`) with these key-values from your Auth0 machine-to-machine application and Auth0 api:
    - client_id: (Client ID)
    - client_secret: (Client Secret)
    - audience: (the identifier from the Auth0 API that you made)
    - grant_type: client_credentials
5. Add action: Get Dictionary Value. Populate it as: Get `Value` for `access_token` in `Contents of URL` (linked to the action above it).
6. Add action: List. Populate the list with some presets for what you want to track.
7. Add action: Choose from `List` (List being a variable linked to the action above it). 
8. Add action: Get Contents of URL. For the URL, put `https://(your-heroku-app).herokuapp.com/api?mood=` Then click `Chosen Item` from your autocorrect bar and it should append the chosen item from the List to the URL.  
9. Click the little arrow after the URL and change method to `POST`. Add a new header, put 'authorization' for the `Key` field and 'Bearer (Dictionary Value)', selecting the `Dictionary Value` variable from your autocorrect bar, for the `text` field.

Depending on how you want to use this, you could
- create an automation that prompts you with the list once per day and uses your choice as input to the shortcut (instead of the list being in the shortcut itself). The notification persists saying 'Tap to respond' so I can answer later if I'm not on my phone at the time it runs.
- add it to the homescreen so that you can press the button to choose from the list
  
## What now??

Data analysis time~!
