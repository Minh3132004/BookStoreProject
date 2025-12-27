import BookModel from "./BookModel";

class CartItemModel {
   idCart?: any;
   quantity?: number;
   book?: BookModel;
   idUser?: number;

   constructor(idCart?: any, quantity?: number, book?: BookModel, idUser?: number) {
      this.idCart = idCart;
      this.quantity = quantity;
      this.book = book;
      this.idUser = idUser;
   }
}

export default CartItemModel;