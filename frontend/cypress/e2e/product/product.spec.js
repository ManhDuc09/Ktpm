import ProductPage from '../../pages/ProductPage';

describe('Product CRUD Tests', () => {
    const productPage = new ProductPage();

    beforeEach(() => {
        productPage.visit();
    });

    it('Create Product', () => {
        const product = { name: 'POM Test', description: 'Test', quantity: '5' };
        productPage.clickAddNew();
        productPage.fillProductForm(product);
        productPage.submitForm();
        productPage.getSuccessMessage().should('contain', 'Product created successfully');
        productPage.getProductInList(product.name).should('exist');
    });

    it('Update Product', () => {
        productPage.clickEdit('POM Test');
        const updatedProduct = { name: 'POM Updated', description: 'test', quantity: '10' };
        productPage.fillProductForm(updatedProduct);
        productPage.submitForm();
        productPage.getProductInList(updatedProduct.name).should('exist');
    });

    it('Delete Product', () => {
        productPage.clickDelete('POM Updated');
        cy.on('window:confirm', () => true);
        productPage.getProductInList('POM Updated').should('not.exist');
    });
});
