import Footer from './layout/header-footer/Footer';
import { Route, Routes, useLocation } from 'react-router-dom';
import RegisterPage from './layout/user/RegisterPage';
import { ToastContainer } from 'react-toastify';
import ActiveAccount from './layout/user/ActiveAccount';
import LoginPage from './layout/user/LoginPage';
import { ForgotPassword } from './layout/user/ForgotPassword';
import { Error403Page } from './layout/pages/errorpage/403Page';
import { Error404Page } from './layout/pages/errorpage/404Page';
import PolicyPage from './layout/pages/PolicyPage';
import HomePage from './layout/pages/HomePage';
import FilterableBookList from './layout/products/FilterableBookList';
import AboutPage from './layout/about/About';
import Navbar from './layout/header-footer/Navbar';
import BookDetail from './layout/products/BookDetail';
import MyFavoriteBooksPage from './layout/pages/MyFavoriteBooksPage';
import AdminDashboard from './layout/admin/AdminDashboard';
import UserManagement from './layout/admin/UserManagement';
import GenreManagement from './layout/admin/GenreManagement';
import AdminLayout from './layout/admin/AdminLayout';
import CartPage from './layout/pages/CartPage';
import ProfilePage from "./layout/user/ProfilePage";
import { BookTable } from './layout/admin/book/BookTable';
import BookManagementPage from './layout/admin/BookManagementPage';
import { PaymentSuccessPage } from './layout/pages/PaymentSuccessPage';
import { useState } from "react";
import OrderManagementPage from './layout/admin/OrderManagement';
import { OrderDetailPage } from './layout/user/components/OrderDetailPage';
import FeedbackPage from './layout/admin/FeedbackManagement';
import { FeedbackCustomerPage } from './layout/pages/feedback/FeedbackCustomerPage';
import { MyPurchasedBooks } from './layout/pages/myPurchased/MyPurchasedBooks';
import CouponManagementPage from './layout/admin/CouponManagement';

const MyRoutes = () => {
    const [reloadAvatar, setReloadAvatar] = useState(0);
    const location = useLocation();
    const isAdminPath = location.pathname.startsWith("/admin");

    return (
        <>
            {/* Nếu không phải admin thì hiện Navbar */}
            {!isAdminPath && <Navbar key={reloadAvatar} />}

            <Routes>
                {/* Customer Routes */}
                <Route path='/' element={<HomePage />} />
                <Route path='/error-403' element={<Error403Page />} />
                <Route path='/error-404' element={<Error404Page />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/active/:email/:activationCode' element={<ActiveAccount />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/policy' element={<PolicyPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/products' element={<FilterableBookList />} />
                <Route path='/book/:idBook' element={<BookDetail />} />
                <Route path='/my-favorite-books' element={<MyFavoriteBooksPage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/payment-success' element={<PaymentSuccessPage />} />
                <Route path="/my-reviews" element={<MyPurchasedBooks />} />
                <Route path='/order/:idOrder' element={<OrderDetailPage />} />
                <Route path="/feedback" element={<FeedbackCustomerPage />} />

                {/* Admin Routes */}
                <Route path='/admin' element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path='dashboard' element={<AdminDashboard />} />
                    <Route path='users' element={<UserManagement />} />
                    <Route path='genres' element={<GenreManagement />} />
                    <Route path='books' element={<BookManagementPage />} />
                    <Route path='orders' element={<OrderManagementPage />} />
                    <Route path='feedback' element={<FeedbackPage />} />
                    <Route path='coupon' element={<CouponManagementPage />} />
                </Route>

                {!isAdminPath && (
                    <Route path='*' element={<Error404Page />} />
                )}
            </Routes>

            {/* Nếu không phải admin thì hiện Footer */}
            {!isAdminPath && <Footer />}
        </>
    );
};


function App() {
    return (
        <div className="App">
            <MyRoutes />
            <ToastContainer
                position='bottom-center'
                autoClose={3000}
                pauseOnFocusLoss={false}
            />
        </div>
    );
}

export default App;
