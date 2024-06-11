document.addEventListener("DOMContentLoaded", function () {
  const rowsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;
  let data = [];
  let filteredData = [];
  let sortColumn = null;
  let sortDirection = null;

  fetch("./Superstore.json")
    .then((response) => response.json())
    .then((jsonData) => {
      data = jsonData;
      filteredData = data;
      totalPages = Math.ceil(filteredData.length / rowsPerPage);
      displayPage(currentPage);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function displayPage(page) {
    const tableBody = document.querySelector("#Superstore-table tbody");
    tableBody.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);

    pageData.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${item.Order_ID}</td>
                <td>${item.Order_Date}</td>
                <td>${item.Ship_Date}</td>
                <td>${item.Ship_Mode}</td>
                <td>${item.Customer_ID}</td>
                <td>${item.Customer_Name}</td>
                <td>${item.Product_ID}</td>
                <td>${item.Category}</td>
                <td>${item["Sub-Category"]}</td>
                <td>${item.Product_Name}</td>
                <td>${item.Sales}</td>
                <td>${item.Quantity}</td>
                <td>${item.Discount}</td>
                <td>${item.Profit}</td>
                <td>${item.Outlier}</td>
            `;
      tableBody.appendChild(row);
    });

    document.getElementById(
      "page-info"
    ).textContent = `Page ${page} of ${totalPages}`;
    document.getElementById("prev").disabled = page === 1;
    document.getElementById("next").disabled = page === totalPages;
  }

  document.getElementById("prev").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayPage(currentPage);
    }
  });

  document.getElementById("next").addEventListener("click", function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayPage(currentPage);
    }
  });

  document.getElementById("search").addEventListener("input", function (event) {
    const query = event.target.value.toLowerCase();
    filteredData = data.filter((item) => {
      return Object.values(item).some((value) =>
        value.toString().toLowerCase().includes(query)
      );
    });
    totalPages = Math.ceil(filteredData.length / rowsPerPage);
    currentPage = 1; // Reset ke halaman pertama setiap kali pencarian
    displayPage(currentPage);
  });

  const pageInfo = document.getElementById("page-info");
  const pageInput = document.getElementById("page-input");

  pageInfo.addEventListener("click", function () {
    pageInput.classList.remove("hidden");
    pageInfo.classList.add("hidden");
    pageInput.value = currentPage;
    pageInput.focus();
  });

  pageInput.addEventListener("blur", function () {
    handlePageChange();
  });

  pageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handlePageChange();
    }
  });

  function handlePageChange() {
    const pageInputValue = parseInt(pageInput.value);
    if (
      !isNaN(pageInputValue) &&
      pageInputValue >= 1 &&
      pageInputValue <= totalPages
    ) {
      currentPage = pageInputValue;
      displayPage(currentPage);
    }
    pageInput.classList.add("hidden");
    pageInfo.classList.remove("hidden");
  }
  function setupSorting() {
    document.querySelectorAll("#Superstore-table th").forEach((th) => {
      th.addEventListener("click", function () {
        const column = th.getAttribute("data-column");
        if (sortColumn === column) {
          sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
          sortColumn = column;
          sortDirection = "asc";
        }
        sortTableData();
        displayPage(currentPage);
        updateSortIndicators();
      });
    });
  }

  function sortTableData() {
    filteredData.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      // Convert to Date objects if sorting by date
      if (sortColumn.includes("Date")) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  function updateSortIndicators() {
    document.querySelectorAll("#Superstore-table th").forEach((th) => {
      th.classList.remove("sorted-asc", "sorted-desc");
      if (th.getAttribute("data-column") === sortColumn) {
        if (sortDirection === "asc") {
          th.classList.add("sorted-asc");
        } else {
          th.classList.add("sorted-desc");
        }
      }
    });
  }
});
