describe('Backend Test', () => {
    it('visits the shop backend', () => {
      cy.visit('http://localhost:3100/')
    })

    it('visits the warehouse frontend', () => {
      cy.visit('http://localhost:3100/reset')    
    })

    it('posts a product stored event', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:04',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 10,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 10);
        })
    })

    it('repeats the post without a change', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:04',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 10,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 10);
        })
    })

    it('sends an update with another 18 socks', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:07',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 18,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 18);
        })
    })

    it('resets the database and sends the events in reverse order', () => {
        cy.visit('http://localhost:3100/reset');

        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:07',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 18,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 18);
        })

        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:04',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 10 ,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 18);
        })
        
    })
    

    /*

    it('repeats a product stored event', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:04',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 10,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 10);
        })
    })

    it('sends an update with another 20 socks', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'black_socks',
            time: '11:05',
            tags: [],
            payload: {
                product: 'black_socks',
                amount: 10,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 20);
        })
    })

    it('sends an add offer for black_socks', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'addOffer',
            blockId: 'black_socks_price',
            time: '11:14',
            tags: [],
            payload: {
                product: 'black_socks',
                price: '$42',
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('amount', 20);
            expect(product).have.property('price', '$42');
        })
    })

    it('sends an place order command', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'placeOrder',
            blockId: 'o1121',
            time: '11:21',
            tags: [],
            payload: {
                code: 'o1121',
                product: 'black_socks',
                customer: 'Carli Customer',
                address: 'Wonderland 1',
                state: 'new order',
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'black_socks')
            expect(product).have.property('customer', 'Carli Customer');
            expect(product).have.property('state', 'new order');
        })

        cy.request('GET', 'http://localhost:3100/query/customers')
        .then((response) => {
            const customerList: any[] = response.body;
            console.log('query customers response is \n' + JSON.stringify(customerList, null, 3));
            expect(customerList.length).gt(0);
        })
    })




    it('posts a product stored event', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'productStored',
            blockId: 'red_shoes',
            time: '09:00',
            tags: [],
            payload: {
                product: 'red_shoes',
                amount: 17,
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'red_shoes')
            expect(product).have.property('amount', 17);
        })
    })

    it('sends an add offer for red_shoes', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'addOffer',
            blockId: 'red_shoes_price',
            time: '09:14',
            tags: [],
            payload: {
                product: 'red_shoes',
                price: '$42',
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'red_shoes')
            expect(product).have.property('amount', 17);
            expect(product).have.property('price', '$42');
        })
    })

    it('sends an place order command', () => {
        cy.request('POST', 'http://localhost:3100/event', {
            eventType: 'placeOrder',
            blockId: 'o0925',
            time: '09:25',
            tags: [],
            payload: {
                code: 'o0925',
                product: 'red_shoes',
                customer: 'Carli Customer',
                address: 'Wonderland 1',
                state: 'picking',
            }
        })
        .then((response) => {
            const product = response.body;
            expect(product).have.property('product', 'red_shoes');
            expect(product).have.property('customer', 'Carli Customer');
            expect(product).have.property('address', "Wonderland 1")
            expect(product).have.property('state', 'picking');
        })

        cy.request('GET', 'http://localhost:3100/query/customers')
        .then((response) => {
            const customerList: any[] = response.body;
            console.log('query customers response is \n' + JSON.stringify(customerList, null, 3));
            expect(customerList.length).gt(0);
        })
    })
    */
})