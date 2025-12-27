class OrderDetail {
    idOrderDetail: number;
    quantity: number;
    price: number;
    review: boolean

    constructor(idOrderDetail: number, quantity: number, price: number, review: boolean) {
        this.idOrderDetail = idOrderDetail;
        this.quantity = quantity;
        this.price = price;
        this.review = review;
    }
}

export default OrderDetail;