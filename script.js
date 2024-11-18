// Select elements
const feeForm = document.getElementById("feeForm");
const recordTable = document.getElementById("recordTable");
const totalFee = document.getElementById("totalFee");

let totalCollected = 0;

// Load stored data from localStorage or initialize as empty array
let records = JSON.parse(localStorage.getItem("studentFeeRecords")) || [];

// Function to populate the table with existing data
function populateTable() {
    records.forEach((record) => {
        addRecordToTable(record.Name, record.RollNumber, record.FeeAmount, false);
        totalCollected += record.FeeAmount;
    });
    totalFee.textContent = totalCollected.toFixed(2);
}

// Add event listener for form submission
feeForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const roll = document.getElementById("roll").value;
    const fee = parseFloat(document.getElementById("fee").value);

    // Validate inputs
    if (!name || !roll || isNaN(fee) || fee <= 0) {
        alert("Please fill all fields correctly.");
        return;
    }

    // Add record to table
    addRecordToTable(name, roll, fee, true);

    // Save record to array and localStorage
    records.push({ Name: name, RollNumber: roll, FeeAmount: fee });
    localStorage.setItem("studentFeeRecords", JSON.stringify(records));

    // Update total fee
    totalCollected += fee;
    totalFee.textContent = totalCollected.toFixed(2);

    // Clear form
    feeForm.reset();
});

// Function to add a record to the table
function addRecordToTable(name, roll, fee, isNew) {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${name}</td>
        <td>${roll}</td>
        <td>₹${fee.toFixed(2)}</td>
        <td><button class="deleteBtn">Delete</button></td>
    `;

    // Append row to table
    recordTable.appendChild(row);

    // Add delete functionality
    row.querySelector(".deleteBtn").addEventListener("click", () => {
        // Update total
        totalCollected -= fee;
        totalFee.textContent = totalCollected.toFixed(2);

        // Remove row
        row.remove();

        // Remove record from array
        records = records.filter((record) => !(record.Name === name && record.RollNumber === roll && record.FeeAmount === fee));
        localStorage.setItem("studentFeeRecords", JSON.stringify(records));
    });
}

// Function to export data to Excel
function exportToExcel() {
    if (records.length === 0) {
        alert("No records to export!");
        return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert records array to a worksheet
    const ws = XLSX.utils.json_to_sheet(records);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Fee Records");

    // Write the workbook and download
    XLSX.writeFile(wb, "Student_Fee_Records.xlsx");
}

// Add an Export button dynamically
const exportButton = document.createElement("button");
exportButton.textContent = "Export to Excel";
exportButton.style.marginTop = "20px";
exportButton.style.padding = "10px 20px";
exportButton.style.backgroundColor = "#007BFF";
exportButton.style.color = "#fff";
exportButton.style.border = "none";
exportButton.style.borderRadius = "5px";
exportButton.style.cursor = "pointer";
exportButton.addEventListener("click", exportToExcel);

// Append the button below the total section
document.querySelector(".total").appendChild(exportButton);

// Populate the table with existing data on page load
populateTable();
