
describe('Shop Test', () => 
{
    it('visits the shop frontend', () => {
        cy.visit('http://localhost:4400/')
    })

    it('clicks on offer-tasks', () => {
        cy.get('#offer-tasks-button').click()
        cy.contains('Offers overview:')
    })

    it('clicks on Edit button', () => {
        cy.get('#add-button').click()
        cy.contains('Edit offer:')
    })

    it('sets the price of jeans to 42.99', () => {
        cy.get('#productNameInput').type('jeans')
        cy.get('#price').type('forty')
        cy.get('#submitOfferButton').click()

        cy.contains('Edit offer:')

        cy.wait(4000)

        cy.get('#price').clear()
        cy.get('#price').type('42.99')
        cy.get('#submitOfferButton').click()

        cy.contains('Offers overview:')
    })

    it('validates the jeans price in the database', () => {
        cy.request('GET', 'http://localhost:3100/query/product-jeans')
        .then((response) => {
            const product: any = response.body;
            console.log('query jeans got \n' + JSON.stringify(product, null, 3));
            expect(product.price).equal('42.99');
        })
    })
})