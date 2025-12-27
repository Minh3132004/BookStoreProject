import CartItemModel from "./CartItemModel";
import UserModel from "./UserModel";

class OrderModel {
   idOrder: number;
   deliveryAddress: string;
   totalPrice: number;
   totalPriceProduct: number;
   feeDelivery: number;
   feePayment: number;
   dateCreated: Date;
   status: string;
   paymentStatus : string;
   user?: UserModel;
   fullName?: string;
   phoneNumber?: string;
   note?: string;
   namePayment?: string;
   nameDelivery?: string;


   constructor (idOrder: number,
      deliveryAddress: string,
      totalPrice: number,
      totalPriceProduct: number,
      feeDelivery: number,
      feePayment: number,
      dateCreated: Date,
      status: string,
      paymentStatus: string,
      user: UserModel,
      fullName: string,
      phoneNumber: string,
      note: string,
      namePayment: string,
      nameDelivery: string) {
         this.idOrder = idOrder;
         this.deliveryAddress = deliveryAddress;
         this.totalPrice = totalPrice;
         this.totalPriceProduct = totalPriceProduct;
         this.feeDelivery = feeDelivery;
         this.feePayment = feePayment;
         this.dateCreated = dateCreated;
         this.status = status;
         this.paymentStatus = paymentStatus;
         this.user = user;
         this.fullName = fullName;
         this.phoneNumber = phoneNumber;
         this.note = note;
         this.namePayment = namePayment;
         this.nameDelivery = nameDelivery;
   }

}

export default OrderModel;
