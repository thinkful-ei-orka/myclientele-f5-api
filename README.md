# MyClientele API


### Usage
Base Url: _to update__/api
| Endpoint    | Method | Description                                                                                           |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------- |
| /auth/login       | post     | Takes user name and password, checks for account,returns auth token                    |
| /auth/refresh       | put     | Takes user nam, returns new auth token                    |
| /users/       | post     | Takes registration info , then creates both a company and user for a new account|
| /clients/       | post     | Takes client information and , inserts in to database and returns the client information in an object                    |
| /clients/       | get     | Gets all clients for associated with user, returns an object                    |
| /companies | ____  | ________________________________ |

### POST `/auth/login`
Parameters:
{
    "user_name":"Irma-JuniorSale",
    "password":"P947fheh(*"
}
**username***string*
**password** *string*
Returns: 
{
    "authToken": 
}

### PUT `/auth/refresh`
Parameters:
none

Returns: 
{
    "authToken": ___
}

### POST `/users`
Parameters:
{
    "name":"Irma",
    "user_name":"Irma-JuniorSale",
    "password":"P947fheh(*",
    "company_name":"F5 Energy",
    "company_location":"5 Fiskburg Lane, Carlsbad, DE 12345",
    "admin":"True",
    "email":"IrmaJS@f5ftw.com",
    "phone_number":"2045987890"
}
**name** *string*
**username***string*
**password** *string* Must be between 8 and 72 characters, must include one upper case, one lower case, one number and one special character
**company_name***integer*
**company_location** *string*
**admin** *boolean*
**email** *string*
**phone_number** *string* Format: 10 digit number

Returns: 
{
    "User created 
}

### GET `/clients`
Parameters:
None

Returns: 
{   
    "clients":[
        {
            "id": "54"
            "name": "The SVC Pharmacy"),
            "location": "678 Ivy Ave., Crisot, DE, 12345",
            "sales_rep_id": "7",
            "company_id": "1",
            "day_of_week": "3",
            "hours_of_operation": "Monday Tuesday Wednesday Saturday : 8AM-10PM",
            "currently_closed": "True",
            "notes": "General manager likes to relocate display. Check when arriving",
            "general_manager": "Carl Dougins"
        },
        {
            "id": "57"
            "name": "The ABC Gas Station"),
            "location": "980 Leaf Ave., Crumbiy, DE, 12345",
            "sales_rep_id": "7",
            "company_id": "1",
            "day_of_week": "6",
            "hours_of_operation": "Monday Tuesday Wednesday Saturday : 8AM-10PM",
            "currently_closed": "True",
            "notes": "",
            "general_manager": "Doug Carlin"
        }
    ]
}

### POST `/clients`
Parameters:
{
    "name":"The SVC Pharmacy",
    "locaiton":"678 Ivy Ave., Crisot, DE, 12345",
    "company_id":"1",
    "day_of_week":"3",
    "hours_of_operaiton":"Monday Tuesday Wednesday Saturday : 8AM-10PM",
    "currently_closed":"True",
    "notes":"General manager likes to relocate display. Check when arriving",
    "general_manager":"Carl Dougins"
}

**name** *string*
**locaiton***string*
**company_id** *integer*
**day_of_week***integer* Format: 0-6 with Starting with Sunday
**hours_of_operaiton** *string*
**currently_closed** *boolean*
**notes** *string*
**general_manager** *string*

Returns: 
{
    "id": "54"
    "name": "The SVC Pharmacy"),
    "location": "678 Ivy Ave., Crisot, DE, 12345",
    "sales_rep_id": "7",
    "company_id": "1",
    "day_of_week": "3",
    "hours_of_operation": "Monday Tuesday Wednesday Saturday : 8AM-10PM",
    "currently_closed": "True",
    "notes": "General manager likes to relocate display. Check when arriving",
    "general_manager": "Carl Dougins"
}

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests in watch mode `npm test`

Run the migraitons up: `npm run migrate` , down: `npm run migrate --0`

## Deploying

When your new project is ready for deployment, add a new heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
