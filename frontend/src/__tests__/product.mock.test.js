import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import UserPage from "../components/UserPage";
import * as ProductService from "../services/ProductService";

jest.mock("../services/ProductService");

describe("UserPage Mock Tests", () => {
    const mockProducts = [
        { id: 1, title: "Product A", description: "Desc A", quantity: 5 },
        { id: 2, title: "Product B", description: "Desc B", quantity: 10 },
    ];

    // Helper to render with proper router
    const renderWithRouter = (initialRoute = "/users/123") => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route path="/users/:id" element={<UserPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Clear localStorage if your component uses it
        localStorage.clear();
    });

    test("Mock: fetch products successfully", async () => {
        // Mock the service call
        ProductService.getProducts.mockResolvedValue({ data: mockProducts });

        await act(async () => {
            renderWithRouter();
        });

        // Wait for products to load
        await waitFor(() => {
            expect(screen.getAllByTestId("product-item")).toHaveLength(2);
        });

        // Verify service was called with correct ID
        expect(ProductService.getProducts).toHaveBeenCalledWith("123");

        // Verify product data is displayed
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("Desc A")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    test("Mock: create product successfully", async () => {
        // Start with empty products
        ProductService.getProducts.mockResolvedValue({ data: [] });
        const newProduct = { id: 3, title: "Product C", description: "Desc C", quantity: 15 };
        ProductService.createProduct.mockResolvedValue({ data: newProduct });

        await act(async () => {
            renderWithRouter();
        });

        // Wait for initial render
        await waitFor(() => {
            expect(screen.getByText("No items yet.")).toBeInTheDocument();
        });

        // Open modal
        fireEvent.click(screen.getByTestId("add-product-btn"));

        // Fill form
        fireEvent.change(screen.getByTestId("product-name"), {
            target: { value: newProduct.title }
        });
        fireEvent.change(screen.getByTestId("product-description"), {
            target: { value: newProduct.description }
        });
        fireEvent.change(screen.getByTestId("product-quantity"), {
            target: { value: newProduct.quantity.toString() }
        });

        // Submit
        fireEvent.click(screen.getByTestId("submit-btn"));

        await waitFor(() => {
            expect(ProductService.createProduct).toHaveBeenCalledWith(
                "123",
                expect.objectContaining({
                    title: newProduct.title,
                    description: newProduct.description,
                    quantity: newProduct.quantity.toString(),
                })
            );
        });

        // Check for success message (toast)
        // Note: Your toast uses data-testid="success-message"
        await waitFor(() => {
            expect(screen.getByTestId("success-message")).toBeInTheDocument();
            expect(screen.getByTestId("success-message")).toHaveTextContent("Product created successfully!");
        });
    });

    test("Mock: update product successfully", async () => {
        // Start with one product
        ProductService.getProducts.mockResolvedValue({ data: [mockProducts[0]] });
        const updatedProduct = { ...mockProducts[0], title: "Updated A" };
        ProductService.updateProduct.mockResolvedValue({ data: updatedProduct });

        await act(async () => {
            renderWithRouter();
        });

        // Wait for product to load
        await waitFor(() => {
            expect(screen.getAllByTestId("product-item")).toHaveLength(1);
        });

        // Click edit button
        fireEvent.click(screen.getByTestId("edit-btn"));

        // Change title
        fireEvent.change(screen.getByTestId("product-name"), {
            target: { value: updatedProduct.title }
        });

        // Submit
        fireEvent.click(screen.getByTestId("submit-btn"));

        await waitFor(() => {
            expect(ProductService.updateProduct).toHaveBeenCalledWith(
                updatedProduct.id,
                expect.objectContaining({ title: updatedProduct.title })
            );
        });

        // Check for success message
        await waitFor(() => {
            expect(screen.getByTestId("success-message")).toBeInTheDocument();
            expect(screen.getByTestId("success-message")).toHaveTextContent("Product updated successfully!");
        });
    });

    test("Mock: delete product successfully", async () => {
        // Start with one product
        ProductService.getProducts.mockResolvedValue({ data: [mockProducts[0]] });
        ProductService.deleteProduct.mockResolvedValue({});

        // Mock window.confirm
        window.confirm = jest.fn(() => true);

        await act(async () => {
            renderWithRouter();
        });

        // Wait for product to load - IMPORTANT: Use queryByTestId for length check
        await waitFor(() => {
            const items = screen.queryAllByTestId("product-item");
            expect(items.length).toBe(1);
        });

        // Click delete button
        fireEvent.click(screen.getByTestId("delete-btn"));

        await waitFor(() => {
            expect(ProductService.deleteProduct).toHaveBeenCalledWith(mockProducts[0].id);
        });

        // Check for success message
        await waitFor(() => {
            expect(screen.getByTestId("success-message")).toBeInTheDocument();
            expect(screen.getByTestId("success-message")).toHaveTextContent("Product deleted successfully!");
        });
    });

    test("Mock: fetch products failure", async () => {
        // Mock console.error to avoid test output noise
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => { });

        // Mock service to reject
        ProductService.getProducts.mockRejectedValue(new Error("Network Error"));

        await act(async () => {
            renderWithRouter();
        });

        // Wait and verify the service was called
        await waitFor(() => {
            expect(ProductService.getProducts).toHaveBeenCalledWith("123");
        });

        // Check that console.error was called
        expect(consoleErrorSpy).toHaveBeenCalled();

        // Restore console.error
        consoleErrorSpy.mockRestore();
    });
});