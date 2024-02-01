# Side - TakeHome Engineering Assignment

## Installation

1.  Clone the repo to your local machine
2.  Run `npm install`

## Run Tests

1. Run `npm run test`

## Run Locally

1. Run `npm run start:local`
2. Navigate to `https://studio.apollographql.com/sandbox/explorer` in your browser
3. Run these operations:

### Get All Properties

`query GetProperties { properties { listingId listPrice favoriteCount property { area bedrooms } address { city state postalCode country streetName streetNumber unit streetNumberText full crossStreet } disclaimer } }`

### Get all Properties by City

`query GetPropertiesInKaty($city: String) { properties(city: $city) { address { city } } }`
**Variables:**
`{ "city":  "Katy" }`
**Headers:**
`Authorization` : `Bearer: 676cfd34-e706-4cce-87ca-97f947c43bd4`

### Add a Favorite

`mutation AddFavorite($listingId: String) { addFavorite(listingId: $listingId) { listingId userId } }`
**Variables:**
`{ "listingId":  "49699701" }`
**Headers:**
`Authorization` : `Bearer: 676cfd34-e706-4cce-87ca-97f947c43bd4`

# Assumptions

- I can change the folder structure, rename files and change the boilerplate without impacting anything (this is not very realistic)
- I should strike a balance between reusability and time spent.

# Acceptance Criteria

- [x] Use Apollo Server as your graphql framework.
- [x] Add Bearer HTTP Authentication to restrict access to all GraphQL endpoints.
- [x] Store and maintain a “favorite counter” in MongoDB for each property listing. The favorite counter tracks how many people marked a listing as favorite.
- [x] Add the following GraphQL functionality:
  - [x] A GraphQL mutation to increment the favorite counter by 1. This endpoint would be called when someone clicks on the “Mark as favorite” button for a listing. But you do not need to implement a frontend interface.
  - [x] A GraphQL query that is fetching data from the SimplyRETS API endpoint ([documentation here](https://docs.simplyrets.com/api/index.html#/Listings/get_properties)). For each result, you need to inject the “favorite counter” from MongoDB.
  - [x] We should be able to filter properties by city.
  - [x] Add unit tests and/or integration tests
  - [x] Explain some of your design decisions in the README.md file

# Overall Approach and Design Decisions

## Apollo Server

I chose to move and rework what was in `index.js` to provide a more flexible way of start and stopping the server. This is to more easily facilitate local development and testing, including managing the starting and stopping of the Mongo memory server and Mongoose to avoid memory leaks and hanging tests.

## Database / ORM

Mongoose - I wanted the ability to define DB models and manage DB interactions in a cleaner way

## DataSources

I chose to name and organize the data sources by source type. This could be done other ways, such as by the provider (api name) or provider type (db type, etc) but I chose to keep it a little more abstract rather than tied to specific technologies.

### Property

Fetching the properties is pretty straightforward. The DataSource includes http header auth functionality.

### User

The user is fetched by their user token since that is what they provide in the auth header.

### Favorite

I chose to store favorites in their own collection because in my mind they are their own entity type. The DataSource facilitates the adding of a new one for any given property / user pair, but skips that if one already exists.

The method for determining how many favorites a property has is a simple document count query.

## Security

I created `/security/authenticate.js` to handle token authentication for all GraphQL endpoints. It utilizes a single `User` API call to verify the existance of a user.

## Utilities

I used an existing package to parse the bearer tokens.

# Local Development

- Environment variables
  - Added Dotenv for environment variables to get hardcoded values out of the code and improve configuration ability
  - Created config helper to get and set env vars
- Improved local development script: /local/run.js
  - Adjusted the existing database.js to be explicitly for local development including starting the Apollo server.
  - Utilize `nodemon` for developer efficiency

# Folder Structure

I made lots of folder structure changes to improve organization and readability.

# Tests

I added a Jest config file.

## Unit Tests

- `src/config.test.js` - tests only the config getter / setter functionality
- `src/security/authenticate.test.js` - Tests the token authorization functionality and mocks the user API to test in isolation
- `src/server.test.js` - Tests the server start and stop functionality
- `src/utils/parse-bearer-token.test.js` - Ensure the utility correctly parses tokens

## Integration Tests

`integration.test.js`
This test suite verifies that all of the AC / Requirements are met and working as expected. This functions a little more like an end-to-end test because it is making calls to the live real estate API. If I had more time, I would mock that API for this integration test and create a separate E2E test that calls the live API.

I chose be a little more verbose and explicit with the tests and variable names since I have often observed that reading and understanding tests is a common difficulty for engineers.

## Test Setup

`test/setup-tests.js` does some helpful things for all of our tests:

- Before any tests, start the mongo memory server and update env vars as needed
- After all tests have ran, tear down mongoose and mongo

# Things Left Undone

- Using just the CJS approach is a little clunky, I'd look into whether moving to the more modern ES Module approach is possible
- Apollo Server 4 is still being used, perhaps look into whether we can upgrade - if so, then adjust `renovate.`
- Consider adding `nvm` to more easily set and manage the Node version
