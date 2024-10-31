describe('Тесты Cypress', () => {
  beforeEach(() => {
    // перехват запроса списка ингредиентов
    cy.intercept('GET', '/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    // перехват запроса user
    cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    // перехват запроса ленты покупок
    cy.intercept('POST', '/api/orders', { fixture: 'orders.json' }).as(
      'getOrder'
    );

    // устанавливаем в хранилище новую связку access- и refresh-токенов
    const fakeAccessToken = 'fake_access_token';
    const fakeRefreshToken = 'fake_refresh_token';
    // Сохранение токенов в localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('accessToken', fakeAccessToken);
      win.localStorage.setItem('refreshToken', fakeRefreshToken);
    });
    // Установка токенов в cookie
    cy.setCookie('accessToken', fakeAccessToken);
    cy.setCookie('refreshToken', fakeRefreshToken);

    // переход на главную страницу
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  describe('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    it('Тестируем добавление булки', () => {
      cy.get('[data-cy=bun]').contains('Добавить').click();
      cy.get('[data-cy=constructor-bun-top]')
        .contains('Краторная булка')
        .should('exist');
      cy.get('[data-cy=constructor-bun-bottom]')
        .contains('Краторная булка')
        .should('exist');
    });

    it('Тестируем добавление ингредиентов', () => {
      cy.get('[data-cy=main]').contains('Добавить').click();
      cy.get('[data-cy=sauce]').contains('Добавить').click();
      cy.get('[data-cy=constructor-ingredients]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
      cy.get('[data-cy=constructor-ingredients]')
        .contains('Соус Spicy-X')
        .should('exist');
    });
  });

  describe('Тестирование работы модальных окон', () => {
    it('открытие модального окна ингредиента', () => {
      cy.contains('Детали ингредиента').should('not.exist');
      cy.contains('Краторная булка').click();
      cy.contains('Детали ингредиента').should('exist');
      cy.get('#modals').contains('Краторная булка').should('exist');
    });

    it('закрытие по клику на крестик', () => {
      cy.contains('Краторная булка').click();
      cy.contains('Детали ингредиента').should('exist');
      cy.get('[data-cy=close-modal-button]').click();
      cy.contains('Детали ингредиента').should('not.exist');
    });
    it('закрытие по клику на оверлей', () => {
      cy.contains('Краторная булка').click();
      cy.contains('Детали ингредиента').should('exist');
      cy.get('[data-cy=modal-overlay]').click({ force: true });
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    it('Проверка отображения имени пользователя', () => {
      cy.get('[data-cy=user-name]').contains('Helen').should('exist');
    });

    it('создание заказа', () => {
      //добавление ингредиентов в конструктор бургера
      cy.get('[data-cy=bun]').contains('Добавить').click();
      cy.get('[data-cy=main]').contains('Добавить').click();
      cy.get('[data-cy=sauce]').contains('Добавить').click();

      cy.get('[data-cy=constructor-bun-top]')
        .contains('Краторная булка')
        .should('exist');
      cy.get('[data-cy=constructor-ingredients]')
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
      cy.get('[data-cy=constructor-ingredients]')
        .contains('Соус Spicy-X')
        .should('exist');
      cy.get('[data-cy=constructor-bun-bottom]')
        .contains('Краторная булка')
        .should('exist');

      // проверка отображения модального окна с верным номером заказа при клике на кнопку оформления заказ
      //Вызывается клик по кнопке «Оформить заказ».
      cy.get('[data-cy=order-button]').contains('Оформить заказ').click();
      //Проверяется, что модальное окно открылось и номер заказа верный.
      cy.get('[data-cy=modal]').should('be.visible');
      cy.get('[data-cy=modal]').contains('123456').should('exist');
      //Закрывается модальное окно и проверяется успешность закрытия.
      cy.get('[data-cy=close-modal-button]').click();
      cy.get('[data-cy=modal]').should('not.exist');

      // Проверка очистки конструктора бургера от добавленных ингредиентов;
      cy.get('[data-cy=constructor-ingredients]').contains('Выберите булки');
      cy.get('[data-cy=constructor-ingredients]').contains('Выберите начинку');
    });
  });
  afterEach(() => {
    // Очистка localStorage
    cy.window().then((win) => {
      win.localStorage.clear();
    });
    // Удаление cookies
    cy.clearCookies();
  });
});
