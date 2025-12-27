import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { endpointBE } from "../utils/Constant";
import UserModel from "../../model/UserModel";
import { getUsers } from "./helpers/userHelpers";
import RequireAdmin from "./RequireAdmin";
import { toast } from "react-toastify";
//  Import từ helpers
import {
    formatDateToInput,
    formatDateDisplay,
    getToken,
    handleErrorResponse,
    logRequest,
    logResponse,
    debugRequest,
    debugResponse
} from "./helpers/userManagementHelpers";
//  Import từ utils
import {
    checkExistEmail,
    checkExistUsername,
    checkPassword,
    checkRepeatPassword,
    checkPhoneNumber,
    validateDateOfBirth
} from "../utils/Validation";

export interface UserFormData {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    deliveryAddress: string;
}

// Helper để reset form
const getEmptyUserForm = (): UserFormData => ({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    deliveryAddress: "",
});

// Component Form Modal - Tách ra ngoài để tránh re-render
const UserFormModal = React.memo(({
    isEdit,
    formData,
    setFormData,
    onSubmit,
    onClose,
    isSubmitting,
    errorUsername,
    errorEmail,
    errorPassword,
    errorPhoneNumber
}: {
    isEdit: boolean;
    formData: UserFormData;
    setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
    onSubmit: (e: FormEvent) => void;
    onClose: () => void;
    isSubmitting: boolean;
    errorUsername: string;
    errorEmail: string;
    errorPassword: string;
    errorPhoneNumber: string;
}) => {
    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
                    maxWidth: "600px",
                    width: "90%",
                    maxHeight: "90vh",
                    overflow: "auto",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    style={{
                        padding: "20px 24px",
                        borderBottom: "1px solid #e9ecef",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        borderRadius: "12px 12px 0 0",
                    }}
                >
                    <h5 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                        {isEdit ? " Chỉnh sửa người dùng" : " Thêm người dùng mới"}
                    </h5>
                    <button
                        type="button"
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "24px",
                            cursor: "pointer",
                            padding: 0,
                        }}
                        onClick={onClose}
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div style={{ padding: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                    Tên tài khoản <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="Nhập tên tài khoản"
                                    required
                                    disabled={isEdit}
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: errorUsername ? "2px solid #dc3545" : "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                        backgroundColor: isEdit ? "#f5f5f5" : "white",
                                        cursor: isEdit ? "not-allowed" : "text",
                                    }}
                                />
                                {errorUsername && <small style={{ color: "#dc3545", fontSize: "12px" }}>{errorUsername}</small>}
                                <small style={{ color: "#666", fontSize: "12px", display: "block", marginTop: "4px" }}>≥8 ký tự, chữ cái, số và _</small>
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                    Email <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Nhập email"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: errorEmail ? "2px solid #dc3545" : "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                    }}
                                />
                                {errorEmail && <small style={{ color: "#dc3545", fontSize: "12px" }}>{errorEmail}</small>}
                            </div>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                Mật khẩu {!isEdit && <span style={{ color: "red" }}>*</span>}
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder={isEdit ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"}
                                required={!isEdit}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: errorPassword ? "2px solid #dc3545" : "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                }}
                            />
                            {errorPassword && <small style={{ color: "#dc3545", fontSize: "12px" }}>{errorPassword}</small>}
                            <small style={{ color: "#666", fontSize: "12px", display: "block", marginTop: "4px" }}>
                                {isEdit ? "Chỉ nhập nếu muốn đổi mật khẩu" : "≥8 ký tự, bao gồm chữ và số"}
                            </small>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                    Tên <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    placeholder="Nhập tên"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                    Họ <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    placeholder="Nhập họ"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                    Số điện thoại <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="Nhập số điện thoại"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: errorPhoneNumber ? "2px solid #dc3545" : "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                    }}
                                />
                                {errorPhoneNumber && <small style={{ color: "#dc3545", fontSize: "12px" }}>{errorPhoneNumber}</small>}
                                <small style={{ color: "#666", fontSize: "12px", display: "block", marginTop: "4px" }}></small>
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                    Ngày sinh <span style={{ color: "red" }}>*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "10px 12px",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        boxSizing: "border-box",
                                    }}
                                />
                                <small style={{ color: "#666", fontSize: "12px" }}></small>
                            </div>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                Giới tính
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                }}
                            >
                                <option value="">-- Chọn giới tính --</option>
                                <option value="M">Nam</option>
                                <option value="F">Nữ</option>
                                <option value="K">Khác</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: 500, color: "#333" }}>
                                Địa chỉ giao hàng
                            </label>
                            <textarea
                                value={formData.deliveryAddress}
                                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                                placeholder="Nhập địa chỉ giao hàng"
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "10px 12px",
                                    border: "1px solid #ddd",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    fontFamily: "inherit",
                                    resize: "vertical",
                                }}
                            ></textarea>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: "16px 24px",
                            borderTop: "1px solid #e9ecef",
                            display: "flex",
                            gap: "12px",
                            justifyContent: "flex-end",
                            backgroundColor: "#f8f9fa",
                            borderRadius: "0 0 12px 12px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            style={{
                                padding: "10px 24px",
                                border: "1px solid #ddd",
                                borderRadius: "6px",
                                backgroundColor: "white",
                                color: "#333",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                fontWeight: 500,
                                opacity: isSubmitting ? 0.6 : 1,
                            }}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                padding: "10px 24px",
                                border: "none",
                                borderRadius: "6px",
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                fontWeight: 500,
                                opacity: isSubmitting ? 0.7 : 1,
                            }}
                        >
                            {isSubmitting ? "⏳ Đang xử lý..." : isEdit ? "✓ Cập nhật" : "✓ Thêm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

UserFormModal.displayName = 'UserFormModal';

const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<UserModel[]>([]);
    const [allUsers, setAllUsers] = useState<UserModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [keyword, setKeyword] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingUser, setEditingUser] = useState<UserModel | null>(null);
    const [newUser, setNewUser] = useState<UserFormData>(getEmptyUserForm());
    const [editUser, setEditUser] = useState<UserFormData>(getEmptyUserForm());
    const [isSubmitting, setIsSubmitting] = useState(false);

    //  Error states cho validation
    const [errorUsername, setErrorUsername] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorPassword, setErrorPassword] = useState("");
    const [errorRepeatPassword, setErrorRepeatPassword] = useState("");
    const [errorPhoneNumber, setErrorPhoneNumber] = useState("");

    const loadUsers = async (page = currentPage) => {
        setLoading(true);
        try {
            const { items, page: pi } = await getUsers(page, pageSize, "idUser,asc");
            setUsers(items);
            setCurrentPage(pi.number);
            setTotalPages(pi.totalPages);
            
            if (page === 0 && pi.totalPages > 0) {
                try {
                    const allUsersData: UserModel[] = [];
                    for (let p = 0; p < pi.totalPages; p++) {
                        const { items: pageItems } = await getUsers(p, 100, "idUser,asc");
                        allUsersData.push(...pageItems);
                    }
                    setAllUsers(allUsersData);
                } catch (err) {
                    console.error("Lỗi khi lấy toàn bộ user:", err);
                    setAllUsers(items);
                }
            }
        } catch (e) {
            console.error(e);
            toast.error(" Không tải được danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = useMemo(() => {
        if (!keyword.trim()) return users;
        const k = keyword.toLowerCase();
        const dataToSearch = allUsers.length > 0 ? allUsers : users;
        return dataToSearch.filter(u =>
            (u.username || '').toLowerCase().includes(k) ||
            (u.email || '').toLowerCase().includes(k) ||
            (u.firstName || '').toLowerCase().includes(k) ||
            (u.lastName || '').toLowerCase().includes(k)||
            (u.phoneNumber || '').includes(k)
        );
    }, [users, allUsers, keyword]);

    const onToggleStatus = async (user: UserModel) => {
        const nextStatus = !user.enabled;
        const token = getToken();
        
        if (!token) return;

        try {
            const response = await fetch(`${endpointBE}/users/${user.idUser}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ enabled: nextStatus })
            });

            if (response.ok || response.status === 204) {
                toast.success(` ${nextStatus ? "Mở khóa" : "Khóa"} tài khoản "${user.username}" thành công!`);
                await loadUsers(currentPage);
            } else {
                const errorMsg = await handleErrorResponse(response);
                toast.error(` ${nextStatus ? "Mở khóa" : "Khóa"} tài khoản thất bại!\n${errorMsg}`);
            }
        } catch (error) {
            console.error(error);
            toast.error(" Đã xảy ra lỗi khi cập nhật trạng thái!");
        }
    };

    const validateUserForm = async (userData: UserFormData, isEdit: boolean): Promise<string | null> => {
        // Reset lỗi
        setErrorUsername("");
        setErrorEmail("");
        setErrorPassword("");
        setErrorPhoneNumber("");

        // Kiểm tra tên tài khoản
        if (!userData.username.trim()) {
            setErrorUsername("Tên tài khoản không được bỏ trống!");
            return "Tên tài khoản không được bỏ trống!";
        }
        
        // Nếu là tạo mới, check username tồn tại
        if (!isEdit) {
            const usernameError = await checkExistUsername(setErrorUsername, userData.username);
            if (usernameError) {
                return "Username không hợp lệ hoặc đã tồn tại!";
            }
        }

        // Kiểm tra email
        if (!userData.email.trim()) {
            setErrorEmail("Email không được bỏ trống!");
            return "Email không được bỏ trống!";
        }
        
        // Nếu là tạo mới, check email tồn tại
        if (!isEdit) {
            const emailError = await checkExistEmail(setErrorEmail, userData.email);
            if (emailError) {
                return "Email không hợp lệ hoặc đã tồn tại!";
            }
        }

        // Kiểm tra mật khẩu
        if (!isEdit && !userData.password.trim()) {
            setErrorPassword("Mật khẩu không được bỏ trống!");
            return "Mật khẩu không được bỏ trống!";
        }

        if (userData.password.trim()) {
            const passwordError = checkPassword(setErrorPassword, userData.password);
            if (passwordError) {
                return "Mật khẩu không hợp lệ!";
            }
        }

        // Kiểm tra tên
        if (!userData.firstName.trim()) {
            return "Tên không được bỏ trống!";
        }

        // Kiểm tra họ
        if (!userData.lastName.trim()) {
            return "Họ không được bỏ trống!";
        }

        // Kiểm tra số điện thoại
        if (!userData.phoneNumber.trim()) {
            setErrorPhoneNumber("Số điện thoại không được bỏ trống!");
            return "Số điện thoại không được bỏ trống!";
        }

        const phoneError = checkPhoneNumber(setErrorPhoneNumber, userData.phoneNumber);
        if (phoneError) {
            return "Số điện thoại không hợp lệ!";
        }

        // Kiểm tra ngày sinh
        if (!userData.dateOfBirth.trim()) {
            return "Ngày sinh không được bỏ trống!";
        }

        if (!validateDateOfBirth(userData.dateOfBirth)) {
            return "Ngày sinh không hợp lệ! Độ tuổi phải từ 13-120!";
        }

        return null;
    };

    const handleAddUser = async (e: FormEvent) => {
        e.preventDefault();

        const validationError = await validateUserForm(newUser, false);
        if (validationError) {
            toast.error(` ${validationError}`);
            return;
        }

        const token = getToken();
        if (!token) return;

        setIsSubmitting(true);

        try {
            const requestBody: any = {
                username: newUser.username.trim(),
                email: newUser.email.trim(),
                password: newUser.password.trim(),
                firstName: newUser.firstName.trim(),
                lastName: newUser.lastName.trim(),
                phoneNumber: newUser.phoneNumber.trim() || "",
                gender: newUser.gender ? newUser.gender.charAt(0) : '\0', //  Backend yêu cầu char
                deliveryAddress: newUser.deliveryAddress.trim() || "",
                enabled: false, //  Set enabled = false, chờ xác nhận email
            };

            // Xử lý dateOfBirth - gửi dạng ISO string
            if (newUser.dateOfBirth) {
                const dobDate = new Date(newUser.dateOfBirth + 'T00:00:00');
                if (!isNaN(dobDate.getTime())) {
                    requestBody.dateOfBirth = dobDate.toISOString();
                }
            }

            logRequest("Thêm người dùng mới", requestBody);

            // Debug request
            debugRequest(token, `${endpointBE}/user/add-user`);

            const response = await fetch(`${endpointBE}/user/add-user`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(requestBody),
            });

            // Debug response
            debugResponse(response.status, response.statusText);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error(" Token không hợp lệ! Vui lòng đăng nhập lại.");
                    localStorage.removeItem("token");
                    return;
                }
                const errorMsg = await handleErrorResponse(response);
                throw new Error(errorMsg);
            }

            const responseData = await response.json();
            logResponse("Thêm người dùng", responseData);

            //  Hiển thị thông báo chờ xác nhận email
            toast.info(
                `⏳ Người dùng ${newUser.email} đã được tạo!\n Một email xác nhận sẽ được gửi tới ${newUser.email}\n Người dùng cần click vào link trong email để kích hoạt tài khoản.`,
                { autoClose: 5000 }
            );
            
            // Reset form - sử dụng helper
            setNewUser(getEmptyUserForm());
            setShowAddForm(false);
            
            // Reload danh sách
            await loadUsers(0);
        } catch (error: any) {
            console.error(" Lỗi thêm user:", error);
            toast.error(` ${error.message || "Thêm người dùng thất bại!"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenEditForm = (user: UserModel) => {
        setEditingUser(user);
        // Convert gender char từ backend: N -> Nam, Ữ -> Nữ, K -> Khác
        let genderDisplay = "";
        if (user.gender === 'N') genderDisplay = "N";
        else if (user.gender === 'Ữ') genderDisplay = "Ữ";
        else if (user.gender === 'K') genderDisplay = "K";
        
        setEditUser({
            username: user.username || "",
            email: user.email || "",
            password: "",
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phoneNumber: user.phoneNumber || "",
            dateOfBirth: formatDateToInput(user.dateOfBirth),
            gender: genderDisplay,
            deliveryAddress: user.deliveryAddress || "",
        });
        setShowEditForm(true);
    };

    const handleUpdateUser = async (e: FormEvent) => {
        e.preventDefault();

        if (!editingUser) return;

        const validationError = await validateUserForm(editUser, true);
        if (validationError) {
            toast.error(` ${validationError}`);
            return;
        }

        const token = getToken();
        if (!token) return;

        setIsSubmitting(true);

        try {
            const updateData: any = {
                email: editUser.email.trim(),
                firstName: editUser.firstName.trim(),
                lastName: editUser.lastName.trim(),
                phoneNumber: editUser.phoneNumber.trim() || "",
                gender: editUser.gender ? editUser.gender.charAt(0) : '\0', //  Backend yêu cầu char
                deliveryAddress: editUser.deliveryAddress.trim() || "",
            };

            // Xử lý dateOfBirth
            if (editUser.dateOfBirth) {
                const dobDate = new Date(editUser.dateOfBirth + 'T00:00:00');
                if (!isNaN(dobDate.getTime())) {
                    updateData.dateOfBirth = dobDate.toISOString();
                }
            }

            // Chỉ thêm password nếu người dùng nhập
            if (editUser.password.trim()) {
                updateData.password = editUser.password.trim();
            }

            logRequest(`Cập nhật người dùng ID ${editingUser.idUser}`, updateData);

            const endpoint = `${endpointBE}/user/${editingUser.idUser}/update-by-admin`;
            debugRequest(token, endpoint);

            const response = await fetch(endpoint, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            debugResponse(response.status, response.statusText);

            if (!response.ok) {
                if (response.status === 401) {
                    toast.error(" Token không hợp lệ! Vui lòng đăng nhập lại.");
                    localStorage.removeItem("token");
                    return;
                }
                const errorMsg = await handleErrorResponse(response);
                throw new Error(errorMsg);
            }

            const responseData = await response.json();
            logResponse("Cập nhật người dùng", responseData);

            toast.success(" Cập nhật người dùng thành công!");
            
            setShowEditForm(false);
            setEditingUser(null);
            
            // Reload danh sách
            await loadUsers(currentPage);
        } catch (error: any) {
            console.error(" Lỗi cập nhật user:", error);
            toast.error(` ${error.message || "Cập nhật người dùng thất bại!"}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='container my-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
                <h3>Quản lý tài khoản</h3>
                <div className='d-flex gap-2'>
                    <input
                        className='form-control'
                        placeholder='Tìm theo tên, email, username...'
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setCurrentPage(0);
                        }}
                        style={{ width: 300 }}
                    />
                    <button
                        className='btn btn-primary'
                        onClick={() => setShowAddForm(true)}
                    >
                        + Thêm người dùng
                    </button>
                </div>
            </div>

            <div className='card'>
                <div className='table-responsive'>
                    <table className='table table-striped align-middle'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên tài khoản</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Ngày sinh</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr><td colSpan={8} className='text-center'>⏳ Đang tải...</td></tr>
                            )}
                            {!loading && filtered.length === 0 && (
                                <tr><td colSpan={8} className='text-center'>Không có dữ liệu</td></tr>
                            )}
                            {!loading && filtered.map(u => (
                                <tr key={u.idUser}>
                                    <td>{u.idUser}</td>
                                    <td>{u.username}</td>
                                    <td>{`${u.firstName || ''} ${u.lastName || ''}`.trim() || '-'}</td>
                                    <td>{u.email || '-'}</td>
                                    <td>{u.phoneNumber || '-'}</td>
                                    <td>{formatDateDisplay(u.dateOfBirth)}</td>
                                    <td>
                                        <span className={`badge ${u.enabled ? 'bg-success' : 'bg-danger'}`}>
                                            {u.enabled ? 'Đang hoạt động' : 'Đã khóa'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className='d-flex gap-1'>
                                            <button
                                                className='btn btn-sm btn-outline-primary'
                                                onClick={() => handleOpenEditForm(u)}
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className={`btn btn-sm ${u.enabled ? 'btn-outline-danger' : 'btn-outline-success'}`}
                                                onClick={() => onToggleStatus(u)}
                                                title={u.enabled ? 'Khóa' : 'Mở khóa'}
                                            >
                                                {u.enabled ? '🔒' : '🔓'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex align-items-center justify-content-center gap-2 p-3">
                    {!keyword.trim() ? (
                        <>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={currentPage === 0}
                                onClick={() => loadUsers(currentPage - 1)}
                            >
                                ← Trước
                            </button>
                            <span className="text-muted">
                                Trang {currentPage + 1} / {totalPages}
                            </span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                disabled={currentPage >= totalPages - 1}
                                onClick={() => loadUsers(currentPage + 1)}
                            >
                                Sau →
                            </button>
                        </>
                    ) : (
                        <span className="text-muted">
                             Tìm thấy {filtered.length} kết quả
                        </span>
                    )}
                </div>
            </div>

            {showAddForm && (
                <UserFormModal
                    isEdit={false}
                    formData={newUser}
                    setFormData={setNewUser}
                    onSubmit={handleAddUser}
                    onClose={() => {
                        setShowAddForm(false);
                        setNewUser(getEmptyUserForm());
                        setErrorUsername("");
                        setErrorEmail("");
                        setErrorPassword("");
                        setErrorPhoneNumber("");
                    }}
                    isSubmitting={isSubmitting}
                    errorUsername={errorUsername}
                    errorEmail={errorEmail}
                    errorPassword={errorPassword}
                    errorPhoneNumber={errorPhoneNumber}
                />
            )}

            {showEditForm && (
                <UserFormModal
                    isEdit={true}
                    formData={editUser}
                    setFormData={setEditUser}
                    onSubmit={handleUpdateUser}
                    onClose={() => {
                        setShowEditForm(false);
                        setEditingUser(null);
                        setEditUser(getEmptyUserForm());
                        setErrorUsername("");
                        setErrorEmail("");
                        setErrorPassword("");
                        setErrorPhoneNumber("");
                    }}
                    isSubmitting={isSubmitting}
                    errorUsername={errorUsername}
                    errorEmail={errorEmail}
                    errorPassword={errorPassword}
                    errorPhoneNumber={errorPhoneNumber}
                />
            )}
        </div>
    );
};

const UserManagementPage = RequireAdmin(UserManagement);
export default UserManagementPage;


