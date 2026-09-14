package com.agi.qa.tests;

import java.time.Duration;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.WebDriver;

public abstract class BaseTest {

    protected static final String BASE_URL =
            System.getProperty("baseUrl", "https://blogdoagi.com.br");

    protected WebDriver driver;

    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        if (!"false".equals(System.getProperty("headless"))) {
            options.addArguments("--headless=new");
        }
        options.addArguments("--window-size=1440,900", "--lang=pt-BR",
                "--disable-gpu", "--no-sandbox");
        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(2));
    }

    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
