import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserPage from "../components/UserPage";
import * as ProductService from "../services/ProductService";
import { BrowserRouter as Router } from "react-router-dom";

jest.mock("../services/ProductService");

// Mock useParams from react-router-dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: () => ({ id: "123" })
}));

describe("UserPage Mock Tests", () => {
    const mockProducts = [
        { id: 1, title: "Product A", description: "Desc A", quantity: 5 },
        { id: 2, title: "Product B", description: "Desc B", quantity: 10 },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Mock: fetch products successfully", async () => {
        ProductService.getProducts.mockResolvedValue({ data: mockProducts });
        console.log(UserPage);

        render(
            <Router>
                <UserPage />
            </Router>
        );

        await waitFor(() => {
            const items = screen.getAllByTestId("product-item");
            expect(items.length).toBe(2);
            expect(ProductService.getProducts).toHaveBeenCalledWith("123");
        });
    });

    test("Mock: create product successfully", async () => {
        ProductService.getProducts.mockResolvedValue({ data: [] });
        const newProduct = { id: 3, title: "Product C", description: "Desc C", quantity: 15 };
        ProductService.createProduct.mockResolvedValue({ data: newProduct });

        render(
            <Router>
                <UserPage />
            </Router>
        );

        // Open modal
        fireEvent.click(screen.getByTestId("add-product-btn"));
        fireEvent.change(screen.getByTestId("product-name"), { target: { value: newProduct.title } });
        fireEvent.change(screen.getByTestId("product-description"), { target: { value: newProduct.description } });
        fireEvent.change(screen.getByTestId("product-quantity"), { target: { value: newProduct.quantity } });
        fireEvent.click(screen.getByTestId("submit-btn"));

        await waitFor(() => {
            expect(ProductService.createProduct).toHaveBeenCalledWith(
                "123",
                expect.objectContaining({
                    title: "Product C",
                    description: "Desc C",
                    quantity: "15",
                })
            );
            expect(screen.getByText(/Product created successfully/i)).toBeInTheDocument();
        });
    });

    test("Mock: update product successfully", async () => {
        ProductService.getProducts.mockResolvedValue({ data: [mockProducts[0]] });
        const updatedProduct = { ...mockProducts[0], title: "Updated A" };
        ProductService.updateProduct.mockResolvedValue({ data: updatedProduct });

        render(
            <Router>
                <UserPage />
            </Router>
        );

        await waitFor(() => expect(screen.getAllByTestId("product-item").length).toBe(1));

        fireEvent.click(screen.getByTestId("edit-btn"));
        fireEvent.change(screen.getByTestId("product-name"), { target: { value: updatedProduct.title } });
        fireEvent.click(screen.getByTestId("submit-btn"));

        await waitFor(() => {
            expect(ProductService.updateProduct).toHaveBeenCalledWith(
                updatedProduct.id,
                expect.objectContaining({ title: updatedProduct.title })
            );
            expect(screen.getByText(/Product updated successfully/i)).toBeInTheDocument();
        });
    });

    test("Mock: delete product successfully", async () => {
        ProductService.getProducts.mockResolvedValue({ data: [mockProducts[0]] });
        ProductService.deleteProduct.mockResolvedValue({});

        window.confirm = jest.fn(() => true);

        render(
            <Router>
                <UserPage />
            </Router>
        );

        await waitFor(() => expect(screen.getAllByTestId("product-item").length).toBe(1));

        fireEvent.click(screen.getByTestId("delete-btn"));

        await waitFor(() => {
            expect(ProductService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
            expect(screen.getByText(/Product deleted successfully/i)).toBeInTheDocument();
        });
    });

    test("Mock: fetch products failure", async () => {
        ProductService.getProducts.mockRejectedValue(new Error("Network Error"));

        render(
            <Router>
                <UserPage />
            </Router>
        );

        await waitFor(() => {
            expect(ProductService.getProducts).toHaveBeenCalledWith("123");
        });
    });
});
