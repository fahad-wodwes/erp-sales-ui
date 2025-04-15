import React from "react";
import InputField from "./ui/InputField";
import SearchSelect from "./ui/SearchSelect";
import mockData from "../store/data.json";
import IconSales from "./icons/Sales";

const SalesHeader = ({ salesData, handleDataChange, customerSuggestions, handleCustomerSelect }) => {
  return (
    <>
      {/* Section header */}
      <div className="section-header">
        <span className="section-title">
          <IconSales /> 銷售主檔
        </span>
      </div>

      {/* Sales header form */}
      <div className="section-container sales-header">
        <div className="sales-grid">
          <div>
            <div className="form-row">
              <div className="form-group">
                <InputField label="銷售單號" labelClass="blue-label" value={salesData.salesNumber} onChange={(value) => handleDataChange("salesNumber", value)} />
              </div>
              <div className="form-group">
                <InputField label="銷售日期" labelClass="blue-label" value={salesData.salesDate} onChange={(value) => handleDataChange("salesDate", value)} />
              </div>
              <div className="form-group">
                <InputField label="客戶編號" labelClass="red-label" value={salesData.customerCode} onChange={(value) => handleDataChange("customerCode", value)} suggestions={customerSuggestions} onSuggestionSelect={handleCustomerSelect} displayField="id" secondaryField="name" required />
              </div>
              <div className="form-group">
                <InputField label="客戶資料" labelClass="red-label" value={salesData.customerNumber} onChange={(value) => handleDataChange("customerNumber", value)} suggestions={customerSuggestions} onSuggestionSelect={handleCustomerSelect} displayField="number" secondaryField="name" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <InputField label="未稅小計" value={salesData.subtotalBeforeTax.toString()} onChange={() => {}} readOnly />
              </div>
              <div className="form-group">
                <InputField label="折讓金額" value={salesData.discountAmount.toString()} onChange={(value) => handleDataChange("discountAmount", parseFloat(value) || 0)} />
              </div>
              <div className="form-group">
                <InputField label="稅額" value={salesData.taxAmount.toString()} onChange={() => {}} readOnly />
              </div>
              <div className="form-group">
                <SearchSelect label="銷售人員" labelClass="blue-label" value={salesData.salesperson} onChange={(value) => handleDataChange("salesperson", value)} options={mockData.salespeople} displayField="name" valueField="id" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <InputField label="帳款日期" labelClass="blue-label" value={salesData.paymentDate} onChange={(value) => handleDataChange("paymentDate", value)} />
              </div>
              <div className="form-group">
                <SearchSelect label="安裝人員" value={salesData.installer} onChange={(value) => handleDataChange("installer", value)} options={mockData.installers} displayField="name" valueField="id" />
              </div>
              <div className="form-group">
                <InputField label="姓名" value={salesData.customerName} onChange={(value) => handleDataChange("customerName", value)} suggestions={customerSuggestions} onSuggestionSelect={handleCustomerSelect} displayField="name" secondaryField="id" />
              </div>
              <div className="form-group form-group-checkbox">
                <SearchSelect label="預設倉庫" labelClass="blue-label" value={salesData.defaultWarehouse} onChange={(value) => handleDataChange("defaultWarehouse", value)} options={mockData.warehouses} displayField="name" valueField="id" />
                <div className="checkbox-container">
                  <label>
                    是否借出
                    <input type="checkbox" checked={salesData.isLoan} onChange={(e) => handleDataChange("isLoan", e.target.checked)} />
                  </label>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <InputField label="金額合計" value={salesData.totalAmount.toString()} onChange={() => {}} readOnly />
              </div>
              <div className="form-group">
                <InputField label="已付金額" value={salesData.paidAmount.toString()} onChange={(value) => handleDataChange("paidAmount", parseFloat(value) || 0)} />
              </div>
              <div className="form-group">
                <InputField label="未結金額" value={salesData.unpaidAmount.toString()} onChange={() => {}} readOnly />
              </div>
              <div className="form-group">
                <InputField label="結清日期" value={salesData.settlementDate} onChange={(value) => handleDataChange("settlementDate", value)} />
              </div>
            </div>
          </div>
          <div className="tax-options">
            <div className="tax-label">稅別</div>
            <div className="tax-radios">
              <label>
                <input type="radio" name="taxType" checked={salesData.taxType === "免稅"} onChange={() => handleDataChange("taxType", "免稅")} />
                免稅
              </label>
              <label>
                <input type="radio" name="taxType" checked={salesData.taxType === "外加"} onChange={() => handleDataChange("taxType", "外加")} />
                外加
              </label>
              <label>
                <input type="radio" name="taxType" checked={salesData.taxType === "內含"} onChange={() => handleDataChange("taxType", "內含")} />
                內含
              </label>
            </div>
          </div>
        </div>

        <div className="form-row notes-row">
          <div className="form-group full-width">
            <InputField label="附記事項" value={salesData.notes} onChange={(value) => handleDataChange("notes", value)} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesHeader;
