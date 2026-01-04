Seaview Apartments Inquiry Form Tests
This project contains automated tests for the inquiry form on the 
Seaview Apartments website (https://seaview-apartmani.com/hr) using Selenium WebDriver with JavaScript/Node.js.

Overview
The test suite validates the functionality of the apartment inquiry form, testing various scenarios including valid data submission and invalid input handling. The tests are implemented using Mocha test framework, Chai assertions, and Selenium WebDriver for browser automation.

Features
12 Comprehensive Test Cases: Tests for valid and invalid form submissions

Multi-language Support: Handles both Croatian and English UI elements

Robust Element Location: Uses multiple CSS selectors and XPaths for reliable element finding

Form Field Validation: Tests all form fields (name, email, address, city, phone, message, terms)

Success/Failure Verification: Validates success messages and error conditions

Cross-browser Compatibility: Configured for Chrome browser

Test Cases
TC-281220251: Sending inquiry with valid data

TC-281220252: Sending inquiry with invalid name and surname length

TC-281220253: Sending inquiry when name and surname is null

TC-281220254: Sending inquiry when email is null

TC-281220255: Sending inquiry when email is invalid

TC-281220256: Sending inquiry when address is invalid

TC-281220257: Sending inquiry when address is null

TC-281220258: Sending inquiry when city is invalid

TC-281220259: Sending inquiry when city is null

TC-2812202510: Sending inquiry when telephone is null

TC-2812202511: Sending inquiry when telephone is invalid

TC-2812202512: Sending inquiry when terms and conditions is unchecked

Prerequisites
Node.js (v14 or higher)

Chrome browser installed

Internet connection (to access the test website)

Installation
Clone or download the project

Install dependencies:

npm install

Run all tests:

npx mocha test/seaview.test.js

Test Results
Each test provides detailed console output including:

Test case identification

Form field interactions

Success/failure messages

Error details (if any)

Test execution time

Dependencies
selenium-webdriver: Browser automation

chai: Assertion library

mocha: Test framework

chromedriver: Chrome browser driver (dev dependency)