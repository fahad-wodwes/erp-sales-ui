import React, { useState, useEffect } from "react";
import "./App.css";
import InputField from "./InputField";
import SearchSelect from "./SearchSelect";

// Mock data - normally would be imported from data.json
const mockData = {
  customers: [
    { id: "001", name: "Customer A", code: "C001", number: "1234" },
    { id: "002", name: "Customer B", code: "C002", number: "5678" },
    { id: "003", name: "Customer C", code: "C003", number: "9012" },
  ],
  salespeople: [
    { id: "001", name: "Salesperson A" },
    { id: "002", name: "Salesperson B" },
    { id: "003", name: "Salesperson C" },
  ],
  installers: [
    { id: "001", name: "Installer A" },
    { id: "002", name: "Installer B" },
    { id: "003", name: "Installer C" },
  ],
  warehouses: [
    { id: "001", name: "Warehouse A" },
    { id: "002", name: "Warehouse B" },
    { id: "003", name: "Warehouse C" },
  ],
  products: [
    { id: "001", code: "P001", name: "Product A", price: 1000, unit: "pcs" },
    { id: "002", code: "P002", name: "Product B", price: 2000, unit: "pcs" },
    { id: "003", code: "P003", name: "Product C", price: 3000, unit: "pcs" },
  ],
};

function App() {
  // Sales header state
  const [salesData, setSalesData] = useState({
    salesNumber: "",
    salesDate: "",
    customerCode: "",
    customerNumber: "",
    subtotalBeforeTax: 0,
    discountAmount: 0,
    taxAmount: 0,
    salesperson: "",
    paymentDate: "",
    installer: "",
    customerName: "",
    defaultWarehouse: "",
    isLoan: false,
    totalAmount: 0,
    paidAmount: 0,
    unpaidAmount: 0,
    settlementDate: "",
    notes: "",
    taxType: "exempt", // 'exempt', 'external', 'internal'
  });

  // Sales detail items state
  const [salesItems, setSalesItems] = useState([
    {
      id: 1,
      productCode: "",
      unitPrice: 0,
      quantity: 0,
      subtotal: 0,
      warehouse: "",
      productName: "",
      unit: "",
      notes: "",
    },
  ]);

  // Suggestions state for different fields
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [productSuggestions, setProductSuggestions] = useState([]);

  // Update dependent fields when necessary
  useEffect(() => {
    // Calculate and update subtotal before tax
    const newSubtotal = salesItems.reduce((total, item) => total + item.subtotal, 0);

    // Calculate tax amount based on tax type and subtotal
    let taxAmount = 0;
    if (salesData.taxType === "external" || salesData.taxType === "internal") {
      taxAmount = (newSubtotal - salesData.discountAmount) * 0.05; // Assuming 5% tax
    }

    // Calculate total amount
    const totalAmount = newSubtotal - salesData.discountAmount + taxAmount;

    // Calculate unpaid amount
    const unpaidAmount = totalAmount - salesData.paidAmount;

    setSalesData((prev) => ({
      ...prev,
      subtotalBeforeTax: newSubtotal,
      taxAmount,
      totalAmount,
      unpaidAmount,
    }));
  }, [salesItems, salesData.discountAmount, salesData.paidAmount, salesData.taxType]);

  // Handle customer search and suggestion filtering
  const searchCustomers = (query, field) => {
    if (!query.trim()) {
      setCustomerSuggestions([]);
      return;
    }

    const filtered = mockData.customers.filter((customer) => {
      if (field === "customerName") {
        return customer.name.toLowerCase().includes(query.toLowerCase());
      } else if (field === "customerCode") {
        return customer.code.toLowerCase().includes(query.toLowerCase());
      } else if (field === "customerNumber") {
        return customer.number.includes(query);
      }
      return false;
    });

    setCustomerSuggestions(filtered);
  };

  // Handle product search and suggestion filtering
  const searchProducts = (query) => {
    if (!query.trim()) {
      setProductSuggestions([]);
      return;
    }

    const filtered = mockData.products.filter((product) => {
      return product.code.toLowerCase().includes(query.toLowerCase()) || product.name.toLowerCase().includes(query.toLowerCase());
    });

    setProductSuggestions(filtered);
  };

  // Handle customer suggestion selection
  const handleCustomerSelect = (customer) => {
    setSalesData((prev) => ({
      ...prev,
      customerCode: customer.code,
      customerNumber: customer.number || "",
      customerName: customer.name,
    }));
    setCustomerSuggestions([]);
  };

  // Handle product suggestion selection for a specific item
  const handleProductSelect = (product, itemId) => {
    setSalesItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            productCode: product.code,
            productName: product.name,
            unitPrice: product.price,
            unit: product.unit,
            subtotal: product.price * item.quantity,
          };
        }
        return item;
      })
    );
    setProductSuggestions([]);
  };

  // Handle changes in sales header fields
  const handleDataChange = (field, value) => {
    setSalesData((prev) => ({ ...prev, [field]: value }));

    // Handle search fields
    if (field === "customerCode" || field === "customerNumber" || field === "customerName") {
      searchCustomers(value, field);
    }
  };

  // Handle changes in sales item fields
  const handleItemChange = (id, field, value) => {
    setSalesItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          // For price and quantity, recalculate subtotal
          if (field === "unitPrice" || field === "quantity") {
            const numValue = parseFloat(value) || 0;
            const updatedItem = {
              ...item,
              [field]: numValue,
            };

            // Update subtotal
            if (field === "unitPrice") {
              updatedItem.subtotal = numValue * item.quantity;
            } else if (field === "quantity") {
              updatedItem.subtotal = item.unitPrice * numValue;
            }

            return updatedItem;
          }

          // For product code, search for product suggestions
          if (field === "productCode") {
            searchProducts(value);
          }

          // For other fields, just update the value
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    // Here you would typically send data to your backend
    console.log("Submitting sales data:", { header: salesData, items: salesItems });
    alert("Sales order submitted!");
  };

  // Handle adding a new item row
  const handleAddItem = () => {
    const newItem = {
      id: salesItems.length + 1,
      productCode: "",
      unitPrice: 0,
      quantity: 0,
      subtotal: 0,
      warehouse: "",
      productName: "",
      unit: "",
      notes: "",
    };
    setSalesItems([...salesItems, newItem]);
  };

  // Handle removing an item row
  const handleRemoveItem = (id) => {
    if (salesItems.length > 1) {
      setSalesItems(salesItems.filter((item) => item.id !== id));
    } else {
      alert("At least one item row must be retained");
    }
  };

  // Handle form reset
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all fields?")) {
      setSalesData({
        salesNumber: "",
        salesDate: "",
        customerCode: "",
        customerNumber: "",
        subtotalBeforeTax: 0,
        discountAmount: 0,
        taxAmount: 0,
        salesperson: "",
        paymentDate: "",
        installer: "",
        customerName: "",
        defaultWarehouse: "",
        isLoan: false,
        totalAmount: 0,
        paidAmount: 0,
        unpaidAmount: 0,
        settlementDate: "",
        notes: "",
        taxType: "exempt",
      });

      setSalesItems([
        {
          id: 1,
          productCode: "",
          unitPrice: 0,
          quantity: 0,
          subtotal: 0,
          warehouse: "",
          productName: "",
          unit: "",
          notes: "",
        },
      ]);
    }
  };

  return (
    <div className="sales-app">
      <div className="sales-container">
        {/* Sales Header Section */}
        <div className="section-header">
          <span className="section-title">Sales Header</span>
        </div>

        <div className="sales-header">
          <div className="tax-options">
            <div className="tax-label">Tax Type</div>
            <div className="tax-radios">
              <label>
                <input type="radio" name="taxType" checked={salesData.taxType === "exempt"} onChange={() => handleDataChange("taxType", "exempt")} />
                Exempt
              </label>
              <label>
                <input type="radio" name="taxType" checked={salesData.taxType === "external"} onChange={() => handleDataChange("taxType", "external")} />
                External
              </label>
              <label>
                <input type="radio" name="taxType" checked={salesData.taxType === "internal"} onChange={() => handleDataChange("taxType", "internal")} />
                Internal
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <InputField label="Sales Number" labelClass="blue-label" value={salesData.salesNumber} onChange={(value) => handleDataChange("salesNumber", value)} />
            </div>
            <div className="form-group">
              <InputField label="Sales Date" labelClass="blue-label" value={salesData.salesDate} onChange={(value) => handleDataChange("salesDate", value)} />
            </div>
            <div className="form-group">
              <InputField label="Customer Code" labelClass="red-label" value={salesData.customerCode} onChange={(value) => handleDataChange("customerCode", value)} suggestions={customerSuggestions} onSuggestionSelect={handleCustomerSelect} displayField="code" secondaryField="name" required />
            </div>
            <div className="form-group">
              <InputField label="Customer Number" labelClass="red-label" value={salesData.customerNumber} onChange={(value) => handleDataChange("customerNumber", value)} suggestions={customerSuggestions} onSuggestionSelect={handleCustomerSelect} displayField="number" secondaryField="name" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <InputField
                label="Subtotal Before Tax"
                value={salesData.subtotalBeforeTax.toString()}
                onChange={() => {}} // No-op since it's read-only
                readOnly
              />
            </div>
            <div className="form-group">
              <InputField label="Discount Amount" value={salesData.discountAmount.toString()} onChange={(value) => handleDataChange("discountAmount", parseFloat(value) || 0)} />
            </div>
            <div className="form-group">
              <InputField
                label="Tax Amount"
                value={salesData.taxAmount.toString()}
                onChange={() => {}} // No-op since it's read-only
                readOnly
              />
            </div>
            <div className="form-group">
              <SearchSelect label="Salesperson" labelClass="blue-label" value={salesData.salesperson} onChange={(value) => handleDataChange("salesperson", value)} options={mockData.salespeople} displayField="name" valueField="id" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <InputField label="Payment Date" labelClass="blue-label" value={salesData.paymentDate} onChange={(value) => handleDataChange("paymentDate", value)} />
            </div>
            <div className="form-group">
              <SearchSelect label="Installer" value={salesData.installer} onChange={(value) => handleDataChange("installer", value)} options={mockData.installers} displayField="name" valueField="id" />
            </div>
            <div className="form-group">
              <InputField label="Name" value={salesData.customerName} onChange={(value) => handleDataChange("customerName", value)} suggestions={customerSuggestions} onSuggestionSelect={handleCustomerSelect} displayField="name" secondaryField="code" />
            </div>
            <div className="form-group">
              <SearchSelect label="Default Warehouse" labelClass="blue-label" value={salesData.defaultWarehouse} onChange={(value) => handleDataChange("defaultWarehouse", value)} options={mockData.warehouses} displayField="name" valueField="id" />
              <div className="checkbox-container">
                <label>
                  <input type="checkbox" checked={salesData.isLoan} onChange={(e) => handleDataChange("isLoan", e.target.checked)} />
                  Is Loan
                </label>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <InputField
                label="Total Amount"
                value={salesData.totalAmount.toString()}
                onChange={() => {}} // No-op since it's read-only
                readOnly
              />
            </div>
            <div className="form-group">
              <InputField label="Paid Amount" value={salesData.paidAmount.toString()} onChange={(value) => handleDataChange("paidAmount", parseFloat(value) || 0)} />
            </div>
            <div className="form-group">
              <InputField
                label="Unpaid Amount"
                value={salesData.unpaidAmount.toString()}
                onChange={() => {}} // No-op since it's read-only
                readOnly
              />
            </div>
            <div className="form-group">
              <InputField label="Settlement Date" value={salesData.settlementDate} onChange={(value) => handleDataChange("settlementDate", value)} />
            </div>
          </div>

          <div className="form-row notes-row">
            <div className="form-group full-width">
              <InputField label="Notes" value={salesData.notes} onChange={(value) => handleDataChange("notes", value)} />
            </div>
          </div>
        </div>

        {/* Sales Detail Section */}
        <div className="section-header detail-header">
          <span className="section-title">Sales Detail</span>
        </div>

        <div className="sales-detail">
          <table>
            <thead>
              <tr>
                <th className="item-num">Item No.</th>
                <th className="product-code">Product Code</th>
                <th className="unit-price">Unit Price</th>
                <th className="quantity">Quantity</th>
                <th className="subtotal">Subtotal</th>
                <th className="warehouse">Warehouse</th>
                <th className="product-name">Product Name</th>
                <th className="unit">Unit</th>
                <th className="item-notes">Notes</th>
              </tr>
            </thead>
            <tbody>
              {salesItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="item-num">{index + 1}</td>
                  <td>
                    <SearchSelect
                      placeholder="Select Product"
                      value={item.productCode}
                      onChange={(value) => {
                        const selectedProduct = mockData.products.find((p) => p.code === value);
                        if (selectedProduct) {
                          handleItemChange(item.id, "productCode", selectedProduct.code);
                          handleItemChange(item.id, "productName", selectedProduct.name);
                          handleItemChange(item.id, "unitPrice", selectedProduct.price);
                          handleItemChange(item.id, "unit", selectedProduct.unit);
                        } else {
                          handleItemChange(item.id, "productCode", value);
                        }
                      }}
                      options={mockData.products}
                      displayField="name"
                      secondaryField="code"
                      valueField="code"
                    />
                  </td>
                  <td>
                    <input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)} />
                  </td>
                  <td>
                    <input type="number" value={item.quantity} onChange={(e) => handleItemChange(item.id, "quantity", parseFloat(e.target.value) || 0)} />
                  </td>
                  <td>
                    <input type="text" value={item.subtotal} readOnly className="readonly" />
                  </td>
                  <td>
                    <SearchSelect placeholder="Select Warehouse" value={item.warehouse} onChange={(value) => handleItemChange(item.id, "warehouse", value)} options={mockData.warehouses} displayField="name" valueField="id" />
                  </td>
                  <td>
                    <input type="text" value={item.productName} readOnly className="readonly" />
                  </td>
                  <td>
                    <input type="text" value={item.unit} readOnly className="readonly" />
                  </td>
                  <td>
                    <input type="text" value={item.notes} onChange={(e) => handleItemChange(item.id, "notes", e.target.value)} />
                  </td>
                  <td className="action-column">
                    <button className="delete-btn" onClick={() => handleRemoveItem(item.id)} title="Delete Item">
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="table-controls">
            <button className="add-row-btn" onClick={handleAddItem}>
              Add Item
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn submit-btn" onClick={handleSubmit}>
            Submit
          </button>
          <button className="action-btn save-btn">Save</button>
          <button className="action-btn print-btn">Print</button>
          <button className="action-btn reset-btn" onClick={handleReset}>
            Reset
          </button>
          <button className="action-btn close-btn">Close</button>
        </div>
      </div>
    </div>
  );
}

export default App;
