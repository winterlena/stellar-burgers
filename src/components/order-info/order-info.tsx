import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getOrdersByNumberThunk,
  selectOrderSelector
} from '../../services/slices/orderSlice';
import { getSelectIngredients } from '../../services/slices/ingredientSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const id = Number(number);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOrdersByNumberThunk(id));
  }, []);
  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(selectOrderSelector);

  const ingredients: TIngredient[] = useSelector(getSelectIngredients).filter(
    (ingredient) => orderData?.ingredients.includes(ingredient._id)
  );

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
