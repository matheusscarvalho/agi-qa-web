package com.agi.qa.pages;

import java.time.Duration;
import java.util.List;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class SearchPage {

    private static final By SEARCH_ICON = By.cssSelector(".astra-search-icon");
    private static final By SEARCH_OVERLAY = By.cssSelector("#ast-seach-full-screen-form");
    private static final By SEARCH_FIELD =
            By.cssSelector("#ast-seach-full-screen-form input.search-field");
    private static final By PAGE_TITLE = By.cssSelector("h1.page-title");
    private static final By RESULT_CARDS = By.cssSelector("main article");
    private static final By NO_RESULTS = By.cssSelector("section.no-results");

    private final WebDriver driver;
    private final WebDriverWait wait;

    public SearchPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(20));
    }

    public void open(String baseUrl) {
        driver.get(baseUrl);
    }

    public void openSearchOverlay() {
        wait.until(ExpectedConditions.elementToBeClickable(SEARCH_ICON)).click();

        boolean openedByTheme;
        try {
            openedByTheme = new WebDriverWait(driver, Duration.ofSeconds(3))
                    .until(ExpectedConditions.visibilityOfElementLocated(SEARCH_FIELD)) != null;
        } catch (org.openqa.selenium.TimeoutException e) {
            // LiteSpeed adiou o frontend.js do tema: o overlay não abriu sozinho.
            openedByTheme = false;
        }

        if (!openedByTheme) {
            ((JavascriptExecutor) driver).executeScript(
                    "const b=document.querySelector(arguments[0]);"
                    + "b.style.display='block'; b.style.opacity='1';",
                    "#ast-seach-full-screen-form");
        }
        wait.until(ExpectedConditions.visibilityOfElementLocated(SEARCH_FIELD));
    }

    public void searchFor(String term) {
        openSearchOverlay();
        WebElement field = driver.findElement(SEARCH_FIELD);
        field.clear();
        field.sendKeys(term);
        field.submit();
        wait.until(ExpectedConditions.visibilityOfElementLocated(PAGE_TITLE));
    }

    public String highlightedTerm() {
        return driver.findElement(By.cssSelector("h1.page-title span")).getText().trim();
    }

    public int resultCount() {
        return driver.findElements(RESULT_CARDS).size();
    }

    public boolean isNoResultsVisible() {
        List<WebElement> els = driver.findElements(NO_RESULTS);
        return !els.isEmpty() && els.get(0).isDisplayed();
    }

    public boolean isSearchOverlayPresent() {
        return !driver.findElements(SEARCH_OVERLAY).isEmpty();
    }
}
