describe('Simple Search Test - Infinite Loop Detection', () => {
  it('should not cause infinite API requests when searching', () => {
    // Intercept all API requests to the events endpoint
    cy.intercept('GET', '/api/events*').as('apiRequest');
    
    // Visit the home page
    cy.visit('/');
    
    // Wait a moment for any initial requests
    cy.wait(1000);
    
    // Type in the search box
    cy.get('.inputBarHome').type('king');
    
    // Wait for debounced autocomplete requests
    cy.wait(500);
    
    // Submit the search
    cy.get('.submitButton').click({ force: true });
    
    // Wait for search to complete
    cy.wait(2000);
    
    // Count all API requests made
    cy.get('@apiRequest.all').then((interceptions) => {
      const requestCount = interceptions.length;
      cy.log(`Total API requests made: ${requestCount}`);
      
      // Log all requests for debugging
      interceptions.forEach((interception, index) => {
        cy.log(`Request ${index + 1}: ${interception.request.url}`);
      });
      
      // A reasonable number of requests should be:
      // - 1-2 for autocomplete (debounced)
      // - 2 for search (count + paginated results)
      // - Total: 3-4 requests maximum
      expect(requestCount).to.be.lessThan(10);
      
      // If we have more than 5 requests, that's suspicious
      if (requestCount > 5) {
        cy.log(`⚠️  WARNING: High number of API requests detected: ${requestCount}`);
      }
    });
  });

  it('should handle search without excessive requests', () => {
    // Intercept API requests
    cy.intercept('GET', '/api/events*').as('apiRequest');
    
    // Visit the home page
    cy.visit('/');
    
    // Type a search term
    cy.get('.inputBarHome').type('war');
    
    // Wait for debounced autocomplete
    cy.wait(500);
    
    // Submit search
    cy.get('.submitButton').click({ force: true });
    
    // Wait for search completion
    cy.wait(2000);
    
    // Check request count
    cy.get('@apiRequest.all').then((interceptions) => {
      const requestCount = interceptions.length;
      cy.log(`Total API requests for "war": ${requestCount}`);
      
      // Should be reasonable number of requests
      expect(requestCount).to.be.lessThan(10);
    });
  });
}); 