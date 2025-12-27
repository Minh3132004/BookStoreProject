import React from "react";
import useScrollToTop from "../../hooks/ScrollToTop";
import BookCartList from "../products/BookCartList";

interface CartPageProps {}

const CartPage: React.FC<CartPageProps> = (props) => {
	useScrollToTop(); // Mỗi lần vào component này thì sẽ ở trên cùng

	return <BookCartList />;
};

export default CartPage;
