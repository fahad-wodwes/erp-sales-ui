import React from "react";
import SearchSelect from "./ui/SearchSelect";
import mockData from "../store/data.json";
import IconCaretRight from "./icons/CaretRight";
import IconSalesDetail from "./icons/SalesDetail";

const SalesDetail = ({ salesItems, handleItemChange, handleAddItem, handleRemoveItem }) => {
  const handleProductChange = (item, value) => {
    {
      const selectedProduct = mockData.products.find((p) => p.id === value);
      if (selectedProduct) {
        handleItemChange(item.id, "productCode", selectedProduct.id);
        handleItemChange(item.id, "productName", selectedProduct.name);
        handleItemChange(item.id, "unitPrice", selectedProduct.price);
        handleItemChange(item.id, "unit", selectedProduct.unit);
      } else {
        handleItemChange(item.id, "productCode", value);
      }
    }
  };

  return (
    <>
      {/* Section header */}
      <div className="section-header detail-header">
        <span className="section-title">
          <IconSalesDetail /> 銷售明細
        </span>
      </div>

      {/* sales detail */}
      <div className="section-container sales-detail">
        <table>
          <thead>
            <tr>
              <th className="expand"></th>
              <th className="item-num">項次</th>
              <th className="product-code">產品編號</th>
              <th className="unit-price">單價</th>
              <th className="quantity">數量</th>
              <th className="subtotal">小計</th>
              <th className="warehouse">倉庫</th>
              <th className="product-name">品名規格</th>
              <th className="unit">單位</th>
              <th className="item-notes">附</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {salesItems.map((item, index) => (
              <tr key={item.id}>
                <th className="expand">
                  <IconCaretRight />
                </th>
                <td className="item-num">{index + 1}</td>
                <td>
                  <SearchSelect placeholder="選擇產品" value={item.productCode} onChange={(value) => handleProductChange(item, value)} options={mockData.products} displayField="name" secondaryField="id" valueField="id" />
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
                  <SearchSelect placeholder="選擇倉庫" value={item.warehouse} onChange={(value) => handleItemChange(item.id, "warehouse", value)} options={mockData.warehouses} displayField="name" valueField="id" />
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
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Table controls */}
        <div className="table-controls">
          {/* Add row button */}
          <button className="add-row-btn" onClick={handleAddItem}>
            新增項目
          </button>
        </div>
      </div>
    </>
  );
};

export default SalesDetail;
