# SAARTHI — User-Data Financial Intelligence

Saarthi is a working hackathon prototype where the **user provides the financial context** and Saarthi dynamically interprets it, calculates the maths, detects patterns, explains the situation and tests what-if decisions.

## Core demo
1. Sign in to the demo.
2. Open **My Data**.
3. Describe the decision/problem you want help with.
4. Upload an `.xlsx`, `.xls`, `.csv`, `.json` or `.txt` file — or paste data.
5. Saarthi parses the data and builds a financial context.
6. It calculates income, expenses, surplus, savings rate, categories, merchants, goals and savings opportunities.
7. Ask follow-up questions in **Ask Saarthi**.
8. Use **What If?** to simulate a spending reduction and see the mathematical effect.

## Run locally
```bash
npm install
npm start
```
Then open `http://localhost:3001`.

## Data format
The easiest spreadsheet columns are `Date`, `Description`/`Merchant`, `Category`, and `Amount`. Saarthi also tries to infer `Debit`/`Credit`, `Withdrawal`/`Deposit`, and category information.

## Important
This prototype does **not** connect to real bank accounts, payment rails, credentials or financial institutions. Uploaded data is processed in the running demo server memory and is not intended as a production financial service. Recommendations are analytical guidance, not regulated financial advice.

## Architecture
Browser → Express API → Data parser → Financial reasoning/calculation engine → structured insights → dynamic UI.
No final recommendation is hardcoded into the frontend.
