describe('Search Infinite Loop Test', () => {
  beforeEach(() => {
    // Intercept API requests to monitor them
    cy.intercept('GET', '/api/events?description_like=king*').as('kingSearch');
    cy.intercept('GET', '/api/events?description_like=war*').as('warSearch');
  });

  it('should not cause infinite API requests when searching for "king"', () => {
    // Visit the home page
    cy.visit('/');
    
    // Type in the search box
    cy.get('.inputBarHome').type('king');
    
    // Submit the search
    cy.get('.submitButton').click();
    
    // Wait for initial search requests
    cy.wait('@kingSearch');
    cy.wait('@kingSearch');
    
    // Wait additional time to see if more requests are made
    cy.wait(3000);
    
    // Check how many requests were made
    cy.get('@kingSearch.all').then((interceptions: any[]) => {
      const requestCount = interceptions.length;
      cy.log(`Total API requests for "king": ${requestCount}`);
      
      // A normal search should make 2 requests: one for count, one for paginated results
      // If we have more than 5 requests, that's suspicious
      // If we have more than 10 requests, that's definitely an infinite loop
      expect(requestCount).to.be.lessThan(10);
      
      // Log the requests for debugging
      interceptions.forEach((interception: any, index: number) => {
        cy.log(`Request ${index + 1}: ${interception.request.url}`);
      });
    });
  });

  it('should not cause infinite API requests when searching for "war"', () => {
    // Visit the home page
    cy.visit('/');
    
    // Type in the search box
    cy.get('.inputBarHome').type('war');
    
    // Submit the search
    cy.get('.submitButton').click();
    
    // Wait for initial search requests
    cy.wait('@warSearch');
    cy.wait('@warSearch');
    
    // Wait additional time to see if more requests are made
    cy.wait(3000);
    
    // Check how many requests were made
    cy.get('@warSearch.all').then((interceptions: any[]) => {
      const requestCount = interceptions.length;
      cy.log(`Total API requests for "war": ${requestCount}`);
      
      // A normal search should make 2 requests: one for count, one for paginated results
      // If we have more than 5 requests, that's suspicious
      // If we have more than 10 requests, that's definitely an infinite loop
      expect(requestCount).to.be.lessThan(10);
      
      // Log the requests for debugging
      interceptions.forEach((interception: any, index: number) => {
        cy.log(`Request ${index + 1}: ${interception.request.url}`);
      });
    });
  });

  it('should handle pagination without infinite loops', () => {
    // Visit the home page
    cy.visit('/');
    
    // Search for "king"
    cy.get('.inputBarHome').type('king');
    cy.get('.submitButton').click();
    
    // Wait for initial search
    cy.wait('@kingSearch');
    cy.wait('@kingSearch');
    
    // Wait for results to load
    cy.get('.searchItems').should('be.visible');
    
    // Click on page 2 if pagination exists
    cy.get('body').then(($body) => {
      if ($body.find('.pagination').length > 0) {
        cy.get('.pagination').find('a').contains('2').click();
        
        // Wait for pagination request
        cy.wait('@kingSearch');
        
        // Wait additional time to check for infinite loops
        cy.wait(2000);
        
        // Check total requests
        cy.get('@kingSearch.all').then((interceptions: any[]) => {
          const requestCount = interceptions.length;
          cy.log(`Total API requests after pagination: ${requestCount}`);
          
          // Should have 3-4 requests: 2 initial + 1-2 for pagination
          expect(requestCount).to.be.lessThan(10);
        });
      }
    });
  });

  it('should verify search results are displayed correctly', () => {
    // Visit the home page
    cy.visit('/');
    
    // Search for "king"
    cy.get('.inputBarHome').type('king');
    cy.get('.submitButton').click();
    
    // Wait for search to complete
    cy.wait('@kingSearch');
    cy.wait('@kingSearch');
    
    // Verify search results are displayed
    cy.get('.searchItems').should('be.visible');
    
    // Verify we have results (not empty state)
    cy.get('body').then(($body) => {
      if ($body.find('.searchItems').text().includes('No results found')) {
        cy.log('No results found for "king"');
      } else {
        // Should have search results
        cy.get('.searchItems').should('contain', 'king');
      }
    });
  });
}); 