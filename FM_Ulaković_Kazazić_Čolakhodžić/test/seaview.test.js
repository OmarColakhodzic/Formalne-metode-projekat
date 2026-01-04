const { Builder, Browser, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');
const fs = require('fs');

describe("Seaview Apartments Inquiry Form Tests", function () {
    let driver;

    const nameSelectors = ['input[name*="name"]', 'input[name*="ime"]', 'input[placeholder*="ime"]',
        'input[placeholder*="name"]', 'input[id*="name"]', 'input[id*="ime"]',
        'input[type="text"]:not([class*="datepicker"])'];

    const emailSelectors = ['input[type="email"]', 'input[name*="email"]', 'input[name*="mail"]',
        'input[placeholder*="email"]', 'input[placeholder*="mail"]',
        'input[id*="email"]', 'input[id*="mail"]'];

    const addressSelectors = [
        'input[name="adresa"]', 'input[name="address"]', 'input[name="street"]', 'input[name="ulica"]',
        'input[name*="adresa"]', 'input[name*="address"]', 'input[name*="street"]', 'input[name*="ulica"]',
        'input[id="adresa"]', 'input[id="address"]', 'input[id="street"]', 'input[id*="adresa"]',
        'input[id*="address"]', 'input[id*="street"]', 'input[placeholder*="Adresa"]',
        'input[placeholder*="adresa"]', 'input[placeholder*="Address"]', 'input[placeholder*="address"]',
        'input[placeholder*="Ulica"]', 'input[placeholder*="ulica"]', 'input[placeholder*="Street"]',
        'input[placeholder*="street"]', 'input[ng-model*="adresa"]', 'input[ng-model*="address"]',
        'input[ng-model*="street"]', 'input[ng-model*="ulica"]', '[formcontrolname*="adresa"]',
        '[formcontrolname*="address"]', '[formcontrolname*="street"]', '[formcontrolname*="ulica"]',
        'input.form-control:nth-of-type(3)', 'input[type="text"].form-control:nth-child(3)',
        'form input[type="text"]:nth-of-type(3)',
        'input[type="text"]:not([type="email"]):not([name*="ime"]):not([name*="name"]):not([name*="email"]):not([class*="datepicker"])'];

    const citySelectors = [
        'input[name*="grad"]', 'input[placeholder*="grad"]', 'input[id*="grad"]',
        'input[name*="city"]', 'input[placeholder*="city"]', 'input[id*="city"]',
        'input[ng-model*="grad"]', 'input[ng-model*="city"]', '[formcontrolname*="grad"]',
        '[formcontrolname*="city"]', 'input.form-control:nth-of-type(4)',
        'input[type="text"].form-control:nth-child(4)'];

    const phoneSelectors = [
        'input[type="tel"]', 'input[name="telefon"]', 'input[name="phone"]', 'input[name="telephone"]',
        'input[name="tel"]', 'input[name="mobitel"]', 'input[name="mobile"]', 'input[name*="telefon"]',
        'input[name*="phone"]', 'input[name*="tel"]', 'input[name*="mobitel"]', 'input[name*="mobile"]',
        'input[id="telefon"]', 'input[id="phone"]', 'input[id="tel"]', 'input[id="mobitel"]',
        'input[id*="telefon"]', 'input[id*="phone"]', 'input[id*="tel"]', 'input[id*="mobitel"]',
        'input[placeholder*="Telefon"]', 'input[placeholder*="telefon"]', 'input[placeholder*="Phone"]',
        'input[placeholder*="phone"]', 'input[placeholder*="Tel"]', 'input[placeholder*="tel"]',
        'input[placeholder*="Mobitel"]', 'input[placeholder*="mobitel"]', 'input[placeholder*="Mobile"]',
        'input[placeholder*="mobile"]', 'input[ng-model*="telefon"]', 'input[ng-model*="phone"]',
        'input[ng-model*="tel"]', 'input[ng-model*="mobitel"]', '[formcontrolname*="telefon"]',
        '[formcontrolname*="phone"]', '[formcontrolname*="tel"]', '[formcontrolname*="mobitel"]',
        'input.form-control:nth-of-type(5)', 'input[type="text"].form-control:nth-child(5)',
        'form input[type="text"]:nth-of-type(5)', 'input[type="text"][name*="phone"]',
        'input[type="text"][name*="tel"]'];

    const messageSelectors = ['textarea', 'textarea[name*="message"]', 'textarea[name*="napomena"]',
        'textarea[placeholder*="napomena"]', 'textarea[placeholder*="message"]',
        'textarea[id*="message"]', 'textarea[id*="napomena"]'];

    const submitSelectors = ['button[class*="btn-sendenquiry"]', 'button.btn-sendenquiry',
        'button[ng-click*="sendInquiry"]', 'button[ng-click*="submit"]',
        '.btn-sendenquiry', 'button[type="submit"]',
        '.modal-footer button.btn-primary', '.modal-footer button:last-child',
        'button[class*="btn"]:last-child'];

    const xpaths = [
        "//button[contains(., 'POŠALJI UPIT')]",
        "//button[contains(., 'SEND INQUIRY')]",
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'pošalji upit')]",
        "//button[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'send inquiry')]"];

    const textPatterns = [
        /pošalji upit/i, /posalji upit/i, /send inquiry/i,
        /POŠALJI UPIT/, /SEND INQUIRY/, /pošalji/i, /posalji/i, /send/i];

    beforeEach(async function () {
        this.timeout(60000);
        console.log("Opening Chrome Browser...");

        let options = new chrome.Options();
        options.addArguments('--no-sandbox', '--disable-dev-shm-usage', '--window-size=1920,1080');

        driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();

        console.log("Navigating to website...");
        await driver.get("https://seaview-apartmani.com/hr");
        await driver.wait(until.elementLocated(By.tagName('body')), 10000);
        console.log("Website loaded successfully");
    });

    async function safeClick(element) {
        await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", element);
        await driver.sleep(1000);
        await driver.executeScript("arguments[0].click();", element);
    }

    async function checkForSuccessMessage() {
        try {
            await driver.sleep(3000);
            const successSelectors = ['.alert-success', '.success', '.thank-you', '.notification-success',
                '.success-message', '.confirmation', '[class*="success"]',
                '[class*="thank"]', '[class*="hvala"]'];

            for (let selector of successSelectors) {
                try {
                    let elements = await driver.findElements(By.css(selector));
                    for (let element of elements) {
                        if (await element.isDisplayed()) {
                            let text = await element.getText();
                            if (text.toLowerCase().includes('thank you') || text.toLowerCase().includes('hvala') ||
                                text.toLowerCase().includes('uspješno') || text.toLowerCase().includes('successfully') ||
                                text.toLowerCase().includes('success')) {
                                return { found: true, message: text };
                            }
                        }
                    }
                } catch (e) { }
            }

            try {
                let bodyText = await driver.findElement(By.tagName('body')).getText();
                if (bodyText.toLowerCase().includes('thank you') || bodyText.toLowerCase().includes('hvala') ||
                    bodyText.toLowerCase().includes('uspješno poslano') || bodyText.toLowerCase().includes('successfully sent')) {
                    return { found: true, message: 'Success message found in page body' };
                }
            } catch (e) { }
        } catch (error) { }
        return { found: false, message: '' };
    }

    async function findAndFillField(selectors, value, fieldName) {
        for (let selector of selectors) {
            try {
                let fields = await driver.findElements(By.css(selector));
                for (let field of fields) {
                    if (await field.isDisplayed() && await field.isEnabled()) {
                        await field.click();
                        await field.clear();
                        await field.sendKeys(value);
                        await driver.sleep(300);
                        console.log(`${fieldName} entered`);
                        return true;
                    }
                }
            } catch (e) { }
        }
        console.log(`⚠ Could not find ${fieldName} field`);
        return false;
    }

    async function findAndClickButton(selectors, textPatterns, buttonName) {
        for (let selector of selectors) {
            try {
                let elements = await driver.findElements(By.css(selector));
                for (let element of elements) {
                    if (await element.isDisplayed()) {
                        const btnText = await element.getText();
                        for (let pattern of textPatterns) {
                            if (btnText && pattern.test(btnText)) {
                                console.log(`Found ${buttonName}: "${btnText}"`);
                                return element;
                            }
                        }
                    }
                }
            } catch (e) { }
        }
        return null;
    }

    it("TC-281220251: Sending inquiry with valid data", async function () {
        this.timeout(120000);
        console.log("Test Case 1: Sending inquiry with valid data");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST PASSED - Success message found: "${result.message}"`);
                } else {
                    console.log("❌ TEST FAILED - No 'Hvala vam' or 'Thank you' message found!");
                    throw new Error("Test failed: No 'Hvala vam' or 'Thank you' message displayed after form submission");
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220252: Sending inquiry with invalid name and surname length", async function () {
        this.timeout(120000);
        console.log("Test Case 2: Sending inquiry with invalid name and surname length");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "awdfsdgfnhfhdgsfeghhgfaddaweghzhgefdwfgrhtffvdcsawrtwrhtbvdqQRTRHVDCSARWGRHFDVDCSCFEGRHTNFGBFVDSERHTJZNGBFVSERHTHNVSEGWRHTJRMnmjherdfngmjhtrfdfbgnjthregsdfdjztrfsdvfbgnhmzjthrgdvbgfnhrgsdnfrsfvrgreubceicnuejcneuicnecbeucenoicej", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220253: Sending inquiry when name and surname is null", async function () {
        this.timeout(120000);
        console.log("Test Case 3: Sending inquiry when name and surname is null");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220254: Sending inquiry when email is null", async function () {
        this.timeout(120000);
        console.log("Test Case 4: Sending inquiry  when email is null");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220255: Sending inquiry when email is invalid", async function () {
        this.timeout(120000);
        console.log("Test Case 5: Sending inquiry when email is invalid");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "mail", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220256: Sending inquiry when address is invalid", async function () {
        this.timeout(120000);
        console.log("Test Case 6: Sending inquiry when address is invalid");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "#$%", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220257: Sending inquiry when address is null", async function () {
        this.timeout(120000);
        console.log("Test Case 7: Sending inquiry when address is null");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220258: Sending inquiry when city is invalid", async function () {
        this.timeout(120000);
        console.log("Test Case 8: Sending inquiry when city is invalid");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "#$%", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-281220259: Sending inquiry when city is null", async function () {
        this.timeout(120000);
        console.log("Test Case 9: Sending inquiry when city is null");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-2812202510: Sending inquiry when telephone is null", async function () {
        this.timeout(120000);
        console.log("Test Case 10: Sending inquiry when telephone is null");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-2812202511: Sending inquiry when telephone is invalid", async function () {
        this.timeout(120000);
        console.log("Test Case 11: Sending inquiry when telephone is invalid");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "awdfsdgfnhfhdgsfeghhgfaddaweghzhgefdwfgrhtffvdcsawrtwrhtbvdqQRTRHVDCSARWGRHFDVDCSCFEGRHTNFGBFVDSERHTJZNGBFVSERHTHNVSEGWRHTJRMnmjherdfngmjhtrfdfbgnjthregsdfdjztrfsdvfbgnhmzjthrgdvbgfnhrgsdnfrsfvrgreubceicnuejcneuicnecbeucenoicej", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "#$%", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");

            console.log("Checking terms and conditions checkbox...");
            try {
                let allCheckboxes = await driver.findElements(By.css('input[type="checkbox"]'));
                let termsCheckbox = null;

                for (let checkbox of allCheckboxes) {
                    try {
                        if (await checkbox.isDisplayed()) {
                            let parentText = await driver.executeScript("return arguments[0].closest('div, label, span, p').innerText || '';", checkbox);
                            if (parentText.includes('Prihvaćam') || parentText.includes('uvjet') || parentText.includes('terms') || parentText.includes('odredbe')) {
                                termsCheckbox = checkbox;
                                break;
                            }
                        }
                    } catch (e) { }
                }

                if (!termsCheckbox && allCheckboxes.length > 0) {
                    for (let i = allCheckboxes.length - 1; i >= 0; i--) {
                        try {
                            if (await allCheckboxes[i].isDisplayed()) {
                                termsCheckbox = allCheckboxes[i];
                                break;
                            }
                        } catch (e) { }
                    }
                }

                if (termsCheckbox && !(await termsCheckbox.isSelected())) {
                    await termsCheckbox.click();
                    console.log("✓ Terms and conditions checkbox checked");
                }
            } catch (error) {
                console.log("Error checking terms checkbox:", error.message);
            }

            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    it("TC-2812202512: Sending inquiry when terms and conditions in unchecked", async function () {
        this.timeout(120000);
        console.log("Test Case 12: Sending inquiry when terms and conditions in unchecked");

        try {
            let sendInquiryBtn = await driver.wait(until.elementLocated(By.css('button.book-now, button.btn-reserve')), 10000);
            console.log("Click on send inquiry button");
            await safeClick(sendInquiryBtn);
            await driver.sleep(3000);

            let apartmentCheckboxes = await driver.findElements(By.css('input[name="apartment_id"], input[type="radio"][name*="apartment"]'));
            let apartmentSelected = false;

            for (let i = 0; i < apartmentCheckboxes.length && !apartmentSelected; i++) {
                try {
                    let parentElement = await driver.executeScript("return arguments[0].closest('div, li, tr');", apartmentCheckboxes[i]);
                    if (parentElement) {
                        let parentText = await parentElement.getText();
                        if (parentText.includes('Dostupno')) {
                            await driver.executeScript("arguments[0].click();", apartmentCheckboxes[i]);
                            apartmentSelected = true;
                            await driver.sleep(1000);
                        }
                    }
                } catch (error) { }
            }

            if (!apartmentSelected && apartmentCheckboxes.length > 0) {
                await driver.executeScript("arguments[0].click();", apartmentCheckboxes[0]);
                apartmentSelected = true;
            }

            if (!apartmentSelected) throw new Error("No apartments available for selection");
            console.log("Apartment selected");

            await driver.sleep(2000);
            try {
                let nextBtn = await driver.findElement(By.xpath("//button[contains(text(),'Dalje') or contains(text(),'Next')]"));
                if (await nextBtn.isEnabled()) {
                    await driver.executeScript("arguments[0].click();", nextBtn);
                    await driver.sleep(3000);
                }
            } catch (error) { }

            await findAndFillField(nameSelectors, "Test Testić", "Name");

            await findAndFillField(emailSelectors, "test@gmail.com", "Email");

            await findAndFillField(addressSelectors, "Testna adresa 123", "Address");

            await findAndFillField(citySelectors, "Zagreb", "City");

            await findAndFillField(phoneSelectors, "+385912345678", "Phone");

            await findAndFillField(messageSelectors, "Ovo je test upit za rezervaciju.", "Note");


            console.log("Clicking 'Pošalji upit' button...");
            await driver.sleep(3000);

            let submitBtn = await findAndClickButton(submitSelectors, textPatterns, "submit button");

            if (!submitBtn) {
                for (let xpath of xpaths) {
                    try {
                        let elements = await driver.findElements(By.xpath(xpath));
                        for (let element of elements) {
                            if (await element.isDisplayed()) {
                                submitBtn = element;
                                break;
                            }
                        }
                        if (submitBtn) break;
                    } catch (e) { }
                }
            }

            if (submitBtn) {
                console.log("Submit button found! Attempting to click...");
                await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});", submitBtn);
                await driver.sleep(1000);

                if (!(await submitBtn.isEnabled())) {
                    console.log("⚠ Submit button is disabled!");
                    throw new Error("Submit button is disabled - check required fields");
                }

                try {
                    await submitBtn.click();
                    console.log("✓ Normal click successful");
                } catch (clickError) {
                    await driver.executeScript(`arguments[0].click();`, submitBtn);
                    console.log("✓ JavaScript click attempted");
                }

                console.log("Waiting for form submission...");
                await driver.sleep(5000);

                console.log("Checking for 'Hvala vam' or 'Thank you' message...");
                const result = await checkForSuccessMessage();

                if (result.found) {
                    console.log(` TEST FAILED - Success message found: "${result.message}" - OVO JE OČEKIVANO!`);
                    throw new Error("Test failed as expected - 'Hvala vam' or 'Thank you' message was displayed");
                } else {
                    console.log(` TEST PASSED - No success message found, which is good for this test!`);
                }
            } else {
                console.log(" Could not find submit button!");
                throw new Error("Submit button not found");
            }

            console.log("✓ Test completed - form filled and submitted");
        } catch (error) {
            console.log("Test failed with error:", error.message);
            throw error;
        }
    });

    afterEach(async function () {
        this.timeout(10000);
        if (driver) {
            try {
                await driver.quit();
                console.log("Browser closed successfully");
            } catch (error) {
                console.log("Error closing browser:", error.message);
            }
        }
    });
});

//npx mocha test/seaview.test.js