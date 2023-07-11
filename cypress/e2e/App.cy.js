describe('App auth', () => {
    it('auth', () => {
        cy.visit('/auth')
        cy.compareSnapshot('login', 0.0);
    })
})

describe('e2e', () => {
    beforeEach(() => {
        cy.window().then((win) => {
            win.localStorage.setItem('auth', '{"hostId":"123","hostPassword":"123"}');
        });
    });

    it('home', () => {
        cy.visit('/')
        cy.wait(1000)
        cy.compareSnapshot('home', 0.0);
    })

    it('media', () => {
        cy.visit('/media')
        cy.wait(3000)
        cy.compareSnapshot('media', 0.0);
    })

    it('queues', () => {
        cy.visit('/queues')
        cy.wait(1000)
        cy.compareSnapshot('queues', 0.0);
    })

    it('queues', () => {
        cy.visit('/queues')
        cy.wait(1000)
        cy.compareSnapshot('queues', 0.0);
    })

    it('queue', () => {
        cy.visit('/queues')
        cy.wait(1000)
        cy.get("//*[@id=\"root\"]/div/div/a/div").click()
        cy.wait(1000)
        cy.compareSnapshot('queue', 0.0);
    })

    it('add-queue', () => {
        cy.visit('/queues')
        cy.wait(1000)
        cy.get("//*[@id=\"root\"]/div/div/a/div").click()
        cy.wait(1000)
        cy.get('//*[@id="root"]/div/div[1]/button[3]').click()
        cy.compareSnapshot('add-queue', 0.0);
    })
})