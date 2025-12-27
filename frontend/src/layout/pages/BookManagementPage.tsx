import React, { useState } from "react";
import { BookTable } from "../admin/book/BookTable";
import { Container, Typography, Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import BookModel from "../../model/BookModel";
import { BookForm } from "../admin/book/BookForm";

const BookManagementPage: React.FC = () => {
    const [keyCountReload, setKeyCountReload] = useState(0);
    const [selectedBook, setSelectedBook] = useState<BookModel | null>(null);
    const [openForm, setOpenForm] = useState(false);

    const handleOpenForm = () => {
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedBook(null);
    };

    const handleReload = () => {
        setKeyCountReload((prev) => prev + 1);
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" component="h1">
                    QUẢN LÝ SÁCH
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenForm}
                >
                    Thêm sách mới
                </Button>
            </Box>

            <BookTable
                keyCountReload={keyCountReload}
                setBookData={setSelectedBook}
                handleOpenForm={handleOpenForm}
                onDeleteSuccess={handleReload}
            />

            <BookForm
                open={openForm}
                onClose={handleCloseForm}
                bookData={selectedBook}
                onSuccess={handleReload}
            />
        </Container>
    );
};

export default BookManagementPage;