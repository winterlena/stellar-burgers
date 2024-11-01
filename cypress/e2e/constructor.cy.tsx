const testUrl = 'http://localhost:4000';
const BUN = '[data-cy=bun]';
const BUN_TOP = '[data-cy=constructor-bun-top]';
const BUN_BOTTOM = '[data-cy=constructor-bun-bottom]';
const MAIN = '[data-cy=main]';
const SAUCE = '[data-cy=sauce]';
const CONSTRUCTOR_INGREDIENTS = '[data-cy=constructor-ingredients]';
const CLOSE_MODAL_BUTTON = '[data-cy=close-modal-button]';
const MODAL_OVERLAY = '[data-cy=modal-overlay]';
const USER_NAME = '[data-cy=user-name]';
const ORDER_BUTTON = '[data-cy=order-button]';
const MODAL = '[data-cy=modal]';

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
    cy.visit(testUrl);
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  });

  describe('Добавление ингредиента из списка ингредиентов в конструктор', () => {
    it('Тестируем добавление булки', () => {
      cy.get(BUN).contains('Добавить').click();
      cy.get(BUN_TOP).contains('Краторная булка').should('exist');
      cy.get(BUN_BOTTOM).contains('Краторная булка').should('exist');
    });

    it('Тестируем добавление ингредиентов', () => {
      cy.get(MAIN).contains('Добавить').click();
      cy.get(SAUCE).contains('Добавить').click();
      cy.get(CONSTRUCTOR_INGREDIENTS)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
      cy.get(CONSTRUCTOR_INGREDIENTS).contains('Соус Spicy-X').should('exist');
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
      cy.get(CLOSE_MODAL_BUTTON).click();
      cy.contains('Детали ингредиента').should('not.exist');
    });
    it('закрытие по клику на оверлей', () => {
      cy.contains('Краторная булка').click();
      cy.contains('Детали ингредиента').should('exist');
      cy.get(MODAL_OVERLAY).click({ force: true });
      cy.contains('Детали ингредиента').should('not.exist');
    });
  });

  describe('Тестирование создания заказа', () => {
    it('Проверка отображения имени пользователя', () => {
      cy.get(USER_NAME).contains('Helen').should('exist');
    });

    it('создание заказа', () => {
      //добавление ингредиентов в конструктор бургера
      cy.get(BUN).contains('Добавить').click();
      cy.get(MAIN).contains('Добавить').click();
      cy.get(SAUCE).contains('Добавить').click();

      cy.get(BUN_TOP).contains('Краторная булка').should('exist');
      cy.get(CONSTRUCTOR_INGREDIENTS)
        .contains('Биокотлета из марсианской Магнолии')
        .should('exist');
      cy.get(CONSTRUCTOR_INGREDIENTS).contains('Соус Spicy-X').should('exist');
      cy.get(BUN_BOTTOM).contains('Краторная булка').should('exist');

      // проверка отображения модального окна с верным номером заказа при клике на кнопку оформления заказ
      //Вызывается клик по кнопке «Оформить заказ».
      cy.get(ORDER_BUTTON).contains('Оформить заказ').click();
      // Дождаться завершения запроса
      cy.wait('@getOrder');
      //Проверяется, что модальное окно открылось и номер заказа верный.
      cy.get(MODAL).should('be.visible');
      cy.get(MODAL).contains('123456').should('exist');
      //Закрывается модальное окно и проверяется успешность закрытия.
      cy.get(CLOSE_MODAL_BUTTON).click();
      cy.get(MODAL).should('not.exist');

      // Проверка очистки конструктора бургера от добавленных ингредиентов;
      cy.get(CONSTRUCTOR_INGREDIENTS).contains('Выберите булки');
      cy.get(CONSTRUCTOR_INGREDIENTS).contains('Выберите начинку');
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
