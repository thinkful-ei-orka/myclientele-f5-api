# MyClientele API


### Usage
Base Url: _to update__/api
| Endpoint    | Method | Description                                                                                           |
| ----------- | ------- | ----------------------------------------------------------------------------------------------------- |
| /auth/login       | post     | Takes user name and password, checks for account,returns auth token                    |
| /auth/refresh       | put     | Takes user nam, returns new auth token                    |
| /users/       | post     | Takes registration info , then creates both a company and user for a new account|
| /clients/       | post     | Takes client information, inserts in to database and returns the client information in an object                    |
| /clients/       | get     | Gets all clients for associated with user, returns an object                    |
| /clients/:id       | get     | Takes client id as a path parameter, returns client information as an object                    |
| /clients/:id       | patch     | Takes client id as a path parameter and updated client information, alters client info in databse                    |
| /clients/:id       | delete     | Takes client id as a path parameter, removes client from database                    |
| /companies/:id | get  | Takes company id as a path parameter, returns company information as an object |
| /reports/ | get | Gets all reports associated with user, returns an object |
| /reports?clientid={id} | get | Gets all reports associated with a particular client by client id |
| /reports/ | post | Takes report information, inserts in to database and returns the report as an object |
| /reports/:report_id | get | Takes report id as a path paramater, returns report information as an object |
| /reports/:report_id | patch | Takes report id as a path paramater, and updated report information, and updates the report in the database |
| /reports/:report_id | delete | Takes report id as a path paramater, and deletes the report from the database |
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
Request Body Parameters:  
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


### GET `/clients/:id`
Parameters:  
None  
  
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
### PATCH `/clients/:id`
Parameters:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;"name":"The SVC Pharmacy",  
&nbsp;&nbsp;&nbsp;&nbsp;"locaiton":"876 Branch Ave., Crisot, DE, 12345",  
&nbsp;&nbsp;&nbsp;&nbsp;"day_of_week":"3",  
&nbsp;&nbsp;&nbsp;&nbsp;"hours_of_operaiton":"Monday Tuesday Thursday Saturday : 8AM-10PM",  
&nbsp;&nbsp;&nbsp;&nbsp;"currently_closed":"False",  
&nbsp;&nbsp;&nbsp;&nbsp;"notes":"Store owner likes to relocate display. Check when arriving",  
&nbsp;&nbsp;&nbsp;&nbsp;"general_manager":"Carl Sagan"  
}  

**All request body parameters are optional**
**name** *string*  
**locaiton***string*  
**day_of_week***integer* Format: 0-6 with Starting with Sunday  
**hours_of_operaiton** *string*  
**currently_closed** *boolean*  
**notes** *string*  
**general_manager** *string*  
  
Response:   

### DELETE `/clients/:id`
Parameters:  
None  
  
Response:   
None

### GET `/companies/:id`
Parameters:  
None  

Response:  
{  
&nbsp;&nbsp;&nbsp;&nbsp;"company_name":"F5 Energy",  
&nbsp;&nbsp;&nbsp;&nbsp;"company_location":"5 Fiskburg Lane, Carlsbad, DE 12345",  
}

### GET `/reports/`
Paramaters: 
None

Response:
Returns:   
{     
&nbsp;&nbsp;&nbsp;&nbsp;"reports":[  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "14"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"client_id": "345"),  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sales_rep_id": "6",    
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": "2016-06-23T02:10:25.000Z",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"company_id": "1",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notes": "Need more stock of product 4. Display was not showing the newest planogram",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"photo_url": "exampleurl.com",
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;},  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": "99"  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"client_id": "64"),  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"sales_rep_id": "6",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"date": "2017-07-04T09:15:22.000Z",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"notes": "",  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"photo_url": ""
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}  
&nbsp;&nbsp;&nbsp;&nbsp;]  
}  

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests in watch mode `npm test`

Run the migraitons up: `npm run migrate` , down: `npm run migrate --0`

## Deploying

When your new project is ready for deployment, add a new heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.
