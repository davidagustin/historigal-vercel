// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to search and verify no infinite loops
Cypress.Commands.add('searchAndVerifyNoInfiniteLoop', (searchTerm: string) => {
  let requestCount = 0;
  
  // Intercept API requests to count them
  cy.intercept('GET', `/api/events?description_like=${searchTerm}*`, (req) => {
    requestCount++;
    req.alias = 'searchRequest';
  }).as('searchRequest');

  // Visit the home page
  cy.visit('/');
  
  // Type in the search box
  cy.get('.inputBarHome').type(searchTerm);
  
  // Submit the search
  cy.get('.submitButton').click();
  
  // Wait for the search results page to load
  cy.url().should('include', '/');
  
  // Wait a bit for any potential additional requests
  cy.wait(2000);
  
  // Verify that we don't have an excessive number of requests
  // A normal search should make 2 requests: one for count, one for paginated results
  cy.get('@searchRequest.all').then((interceptions) => {
    const actualCount = interceptions.length;
    cy.log(`Total API requests made: ${actualCount}`);
    
    // Allow for some reasonable number of requests (2-4 is normal)
    // If we have more than 10 requests, that's definitely an infinite loop
    expect(actualCount).to.be.lessThan(10);
  });
});

// Custom command to count API requests
Cypress.Commands.add('countApiRequests', (endpoint: string) => {
  return cy.get(`@${endpoint.replace(/[^a-zA-Z0-9]/g, '')}.all`).then((interceptions) => {
    return interceptions.length;
  });
}); 