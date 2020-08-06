# MyClientele API


### Usage
Base Url: _to update__/api
| Endpoint    | Method | Description                                                                                           |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------- |
| /auth/login       | post     | Takes `user_name` and `password`, checks for ,returns auth token                    |
| /auth/refresh       | put     | Takes `user_name and id`, returns new auth token                    |
| /users/       | post     | Takes registration info , then creates both a company and user for a new account|
| /clients/       | post     | Takes client information and , inserts in to database and returns the client information in an object                    |
| /clients/       | get     | Gets all clients for associated with user, returns an object                    |
| /companies | ____  | ________________________________ |

### POST `auth/login`
Parameters:

Returns: 

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests in watch mode `npm test`

Run the migraitons up: `npm run migrate` , down: `npm run migrate --0`

## Deploying

When your new project is ready for deployment, add a new heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
