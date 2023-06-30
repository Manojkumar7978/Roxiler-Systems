# Product Dashboard(BE)

## Introduction
The backend of this project is responsible for fetching the sales transaction data from a third-party API and initializing the database with the obtained seed data. It provides several APIs to retrieve and analyze the sales data based on user-defined parameters. The main functionalities of the backend include:

-Initializing the database with sales transaction data fetched from the third-party API.
-Listing all transactions with support for search and pagination based on product title, description, and price.
-Generating statistics for the total sale amount, number of sold items, and number of unsold items for a selected month.
-Creating a bar chart that displays the price range and the number of items falling within each range for a selected month.
-Generating a pie chart to showcase the unique categories and the number of items in each category for a selected month.



## Installation
Detailed instructions on how to install, configure, and get the project running.

```bash
(go to the parent folder of this file)
npm i
cd backend
nodemon server.js

```


## APIs Used
https://s3.amazonaws.com/roxiler.com/product_transaction.json

## API Endpoints

GET /api/initialize_database - for initialize the database

GET /api/transaction - for all transaction details

### This above api end point takes some query
- search * (String or Number)
- month * (Number 0 to 12) (0 for get all month transaction)
- page (page number)
- perPage (per page how many product you need)   
       
        
GET /api/statistics 
- Total sale amount of selected month
- Total number of sold items of selected month
- Total number of not sold items of selected month
### This above api end point takes month query
- month* (number 1-12) 

GET /api/pie_chart - to find unique categories and number of items from that category for the selected month regardless of the year
### This above api end point takes month query
- month* (number 1-12) 


GET /api/bar_chart - it response price range and total item between that price range.
### This above api end point takes month query
- month* (number 1-12) 


GET /api/combined_data -  it fetches the data from all the 3 APIs mentioned above, combines the response and sends a final response of the combined JSON.
### This above api end point takes month query
- month* (number 1-12) 



## Technology Stack
- Node.js
- Express.js
- MongoDB
- Mongoose 
- MongoDB Atlas

## Deploye
-Back end deployed at cyclic
