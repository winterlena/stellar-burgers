import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  clearIngredients,
  getStateBurger
} from '../../services/slices/burgerConstructorSlice';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderState,
  fetchCreateOrder,
  selectLoading,
  selectOrderSelector
} from '../../services/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../services/slices/userSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(getStateBurger);

  const orderRequest = useSelector(selectLoading);

  const orderModalData = useSelector(selectOrderSelector);

  const navigate = useNavigate();
  const userData = useSelector(getUserData);

  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!userData) {
      navigate('/login'), { replace: true };
      return;
    }
    const ingredientsId = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];
    dispatch(fetchCreateOrder(ingredientsId))
      .unwrap()
      .then(() => {
        dispatch(clearIngredients());
      });
  };
  const closeOrderModal = () => {
    dispatch(clearOrderState());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
