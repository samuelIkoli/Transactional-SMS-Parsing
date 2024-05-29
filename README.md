# Transactional-SMS-Parsing
This is an endpoint that takes in sample SMS bank alerts and then parses the information to get relevant data.


## 📁 Project Configuration

The project is divided into:

- Controllers: found in `src/controller` folder. The functions that get executed when the endpoints are called is defined here.

- Routes: found in `src/routes` directory. URL endpoints and their corresponding method/action.


## Getting Started: Running the Server

### 🔧 Tech Stack

- NodeJS
- ExpressJS
- Typescript

### 📝 Requirements

This project requires nodeJS version >= 14 and npm package manager.

### 💻 Running Locally

1. Clone this repository by running:
   ```bash
   git clone https://github.com/samuelIkoli/Transactional-SMS-Parsing.git
   cd Transactional-SMS-Parsing
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the server in dev mode:
   ```bash
   npm run dev
   ```


### 💻 Testing

Online API testing tools such as **Postman** and **Thunderclient** can be used to test the endpoints. Testing can be carried out on the postman documentation endpoint [here](https://www.postman.com/crimson-capsule-415986/workspace/new-team-workspace/collection/19177553-73086e59-b7aa-4fbb-bbd2-951d38a0f556?action=share&creator=19177553).



### 📩 Request

- Accepts JSON only.
- Request body should **only** contain the specified values and follow the database schema.
- Example request:
  ```json
  {
           "message": "Debit\nAmt:NGN50,026.88\nAcc:000******060\nDesc:099MJKL22217OIRf/REV-TRF/Mailers/FRM OLOWE ADEDEJI TO  - IR\nTime:05/08/2022\nAvail Bal:NGN1,800,320.02\nTotal:NGN1,800,000.00",
           "sender_id": "AccessBank"
         }
  ```

### 📂 Response

Returns JSON.

### ⚠️ Response Status

- 200 - OK.
- 400 - Bad Request:
  - Request body has more than the specified attribute.
  - Invalid content-Type.

## 📖 Documentation

Documentation can be found [here](https://www.postman.com/crimson-capsule-415986/workspace/new-team-workspace/collection/19177553-73086e59-b7aa-4fbb-bbd2-951d38a0f556?action=share&creator=19177553)


## 🔗 Links

* [Server URL](http://smsparser-env.eba-qpmsxmqk.eu-north-1.elasticbeanstalk.com/)


Built by SAMUEL IKOLI