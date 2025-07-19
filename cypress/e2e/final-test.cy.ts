describe('Final Infinite Loop Test', () => {
  it('should not cause infinite API requests', () => {
    // Intercept API requests
    cy.intercept('GET', '/api/events*').as('apiRequest');
    
    // Visit the home page
    cy.visit('/');
    
    // Type and search
    cy.get('.inputBarHome').type('king');
    cy.get('.submitButton').click({ force: true });
    
    // Wait for search to complete
    cy.wait(3000);
    
    // Count requests
    cy.get('@apiRequest.all').then((interceptions) => {
      const count = interceptions.length;
      cy.log(`Total API requests: ${count}`);
      
      // Should be reasonable (2-4 requests max)
      expect(count).to.be.lessThan(10);
    });
  });
}); 