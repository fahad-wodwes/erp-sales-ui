import React, { useState, useEffect } from "react";

import mockData from "../store/data.json";
import SalesHeader from "./SalesHeader";
import SalesDetail from "./SalesDetail";

const SalesForm = () => {
  // states
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
    taxType: "免稅",
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

  // Suggestions for Customer
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

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
        return customer.id.toLowerCase().includes(query.toLowerCase());
      } else if (field === "customerNumber") {
        return customer.number.includes(query);
      }
      return false;
    });

    setCustomerSuggestions(filtered);
  };

  // Handle customer suggestion selection
  const handleCustomerSelect = (customer) => {
    setSalesData((prev) => ({
      ...prev,
      customerCode: customer.id,
      customerNumber: customer.number || "",
      customerName: customer.name,
    }));
    setCustomerSuggestions([]);
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

          // For other fields, just update the value
          return { ...item, [field]: value };
        }
        return item;
      })
    );
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

  // Update dependent fields when necessary
  useEffect(() => {
    // Calculate and update subtotal before tax
    const newSubtotal = salesItems.reduce((total, item) => total + item.subtotal, 0);

    // Calculate tax amount based on tax type and subtotal
    let taxAmount = 0;
    if (salesData.taxType === "外加" || salesData.taxType === "內含") {
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

  return (
    <>
      {/* Sales Header Section */}
      <SalesHeader salesData={salesData} handleDataChange={handleDataChange} customerSuggestions={customerSuggestions} handleCustomerSelect={handleCustomerSelect} />

      {/* Sales Detail Section */}
      <SalesDetail salesItems={salesItems} handleItemChange={handleItemChange} handleAddItem={handleAddItem} handleRemoveItem={handleRemoveItem} />
    </>
  );
};

export default SalesForm;
