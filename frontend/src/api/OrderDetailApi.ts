import { endpointBE } from "../layout/utils/Constant";
import OrderDetail from "../model/OrderDetail";
import { my_request } from "./Request";

// Lấy 1 đơn hàng chi tiết bởi mã đơn hàng
export const get1OrderDetail = async (idOrder: number) => {
    const endpoint = endpointBE + `/orders/${idOrder}/listOrderDetails`;
    const response = await my_request(endpoint);
    const responseData = response._embedded.orderDetails;
    const orderDetail: OrderDetail[] = await Promise.all(responseData.map((orderDetail: OrderDetail) => 
        new OrderDetail(
            orderDetail.idOrderDetail,
            orderDetail.quantity,
            orderDetail.price,
            orderDetail.review,
        )
    ));

    console.log(orderDetail);
    
    return orderDetail;
}