class Coupon {
    idCoupon: number;
    code: string;
    discountPercent: number;
    expiryDate: Date;
    isUsed: boolean;
    isActive: boolean;

    constructor(idCoupon: number, code: string, discountPercent: number, expiryDate: Date, isUsed: boolean, isActive: boolean) {
        this.idCoupon = idCoupon;
        this.code = code;
        this.discountPercent = discountPercent;
        this.expiryDate = expiryDate;
        this.isUsed = isUsed;
        this.isActive = isActive;
    }
}

export default Coupon;
