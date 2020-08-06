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
&nbsp;&nbsp;&nbsp;&nbsp;"user_name":"Irma-JuniorSale",  
&nbsp;&nbsp;&nbsp;&nbsp;"password":"P947fheh(*"  
}  
**user_name** *string*  
**password** *string*   

Returns:   
{  
&nbsp;&nbsp;&nbsp;&nbsp;"authToken":   
}  

### PUT `/auth/refresh`
Parameters:  
none  

Returns:   
{  
&nbsp;&nbsp;&nbsp;&nbsp;"authToken": ___  
}  

### POST `/users`
Parameters:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;"name":"Irma",  
&nbsp;&nbsp;&nbsp;&nbsp;"user_name":"Irma-JuniorSale",  
&nbsp;&nbsp;&nbsp;&nbsp;"password":"P947fheh(*",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_name":"F5 Energy",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_location":"5 Fiskburg Lane, Carlsbad, DE 12345",  
&nbsp;&nbsp;&nbsp;&nbsp;"admin":"True",  
&nbsp;&nbsp;&nbsp;&nbsp;"email":"IrmaJS@f5ftw.com",  
&nbsp;&nbsp;&nbsp;&nbsp;"phone_number":"2045987890"  
}  
**name** *string*  
**username** *string*  
**password** *string* Must be between 8 and 72 characters, must include one upper case, one lower case, one number and one special character  
**company_name** *integer*  
**company_location** *string*  
**admin** *boolean*  
**email** *string*  
**phone_number** *string* Format: 10 digit number  
  
Returns:   
{  
&nbsp;&nbsp;&nbsp;&nbsp;"User created"   
}  

### GET `/clients`
Parameters:  
None  
  
Returns:   
{     
&nbsp;&nbsp;&nbsp;&nbsp;"clients":[  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "54"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "The SVC Pharmacy"),  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"location": "678 Ivy Ave., Crisot, DE, 12345",    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sales_rep_id": "7",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"company_id": "1",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"day_of_week": "3",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hours_of_operation": "Monday Tuesday Wednesday Saturday : 8AM-10PM",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"currently_closed": "True",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notes": "General manager likes to relocate display. Check when arriving",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"general_manager": "Carl Dougins"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "57"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"name": "The ABC Gas Station"),  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"location": "980 Leaf Ave., Crumbiy, DE, 12345",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sales_rep_id": "7",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"company_id": "1",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"day_of_week": "6",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"hours_of_operation": "Monday Tuesday Wednesday Saturday : 8AM-10PM",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"currently_closed": "True",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notes": "",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"general_manager": "Doug Carlin"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  
&nbsp;&nbsp;&nbsp;&nbsp;]  
}  
  
### POST `/clients`
Parameters:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;"name":"The SVC Pharmacy",  
&nbsp;&nbsp;&nbsp;&nbsp;"locaiton":"678 Ivy Ave., Crisot, DE, 12345",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_id":"1",  
&nbsp;&nbsp;&nbsp;&nbsp;"day_of_week":"3",  
&nbsp;&nbsp;&nbsp;&nbsp;"hours_of_operaiton":"Monday Tuesday Wednesday Saturday : 8AM-10PM",  
&nbsp;&nbsp;&nbsp;&nbsp;"currently_closed":"True",  
&nbsp;&nbsp;&nbsp;&nbsp;"notes":"General manager likes to relocate display. Check when arriving",  
&nbsp;&nbsp;&nbsp;&nbsp;"general_manager":"Carl Dougins"  
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
&nbsp;&nbsp;&nbsp;&nbsp;"id": "54"  
&nbsp;&nbsp;&nbsp;&nbsp;"name": "The SVC Pharmacy"),  
&nbsp;&nbsp;&nbsp;&nbsp;"location": "678 Ivy Ave., Crisot, DE, 12345",  
&nbsp;&nbsp;&nbsp;&nbsp;"sales_rep_id": "7",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_id": "1",  
&nbsp;&nbsp;&nbsp;&nbsp;"day_of_week": "3",  
&nbsp;&nbsp;&nbsp;&nbsp;"hours_of_operation": "Monday Tuesday Wednesday Saturday : 8AM-10PM",  
&nbsp;&nbsp;&nbsp;&nbsp;"currently_closed": "True",  
&nbsp;&nbsp;&nbsp;&nbsp;"notes": "General manager likes to relocate display. Check when arriving",  
&nbsp;&nbsp;&nbsp;&nbsp;"general_manager": "Carl Dougins"  
}  
  
## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests in watch mode `npm test`

Run the migraitons up: `npm run migrate` , down: `npm run migrate --0`

## Deploying

When your new project is ready for deployment, add a new heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
