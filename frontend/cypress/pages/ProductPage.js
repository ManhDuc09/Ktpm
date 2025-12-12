/* global cy, Cypress */

class ProductPage {

    visit() {
        cy.window().then((win) => {
            win.localStorage.setItem(
                'user',
                JSON.stringify({ id: 1, name: 'Test User' })
            );
        });
        cy.intercept('GET', '**/api/products/*').as('getProducts');
        cy.visit('/users/1');
        cy.wait('@getProducts');
    }

    clickAddNew() {
        cy.get('[data-testid="add-product-btn"]').click();
    }

    fillProductForm(product) {
        cy.get('[data-testid="product-name"]').type(product.name);
        cy.get('[data-testid="product-description"]').type(product.description);
        cy.get('[data-testid="product-quantity"]').type(product.quantity);
    }

    submitForm() {
        cy.get('[data-testid="submit-btn"]').click();
    }

    getSuccessMessage() {
        return cy.get('[data-testid="success-message"]');
    }

    getProductInList(name) {
        return cy.contains('[data-testid="product-item"]', name);
    }

    clickEdit(name) {
        this.getProductInList(name)
            .within(() => {
                cy.get('[data-testid="edit-btn"]').click();
            });
    }

    clickDelete(name) {
        this.getProductInList(name)
            .within(() => {
                cy.get('[data-testid="delete-btn"]').click();
            });
    }
}

export default ProductPage;
