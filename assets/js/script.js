// ==================================================================================================

// allSideMenu.forEach((item) => {
//   const li = item.parentElement;

//   item.addEventListener("click", function () {
//     allSideMenu.forEach((i) => {
//       i.parentElement.classList.remove("active");
//     });
//     li.classList.add("active");
//   });
// });

// // TOGGLE SIDEBAR
// const menuBar = document.querySelector('#content nav .bx.bx-menu');
// const sidebar = document.getElementById('sidebar');

// menuBar.addEventListener('click', function () {
// 	sidebar.classList.toggle('hide');
// })

// const searchButton = document.querySelector(
//   "#content nav form .form-input button"
// );
// const searchButtonIcon = document.querySelector(
//   "#content nav form .form-input button .bx"
// );
// const searchForm = document.querySelector("#content nav form");

// searchButton.addEventListener("click", function (e) {
//   if (window.innerWidth < 576) {
//     e.preventDefault();
//     searchForm.classList.toggle("show");
//     if (searchForm.classList.contains("show")) {
//       searchButtonIcon.classList.replace("bx-search", "bx-x");
//     } else {
//       searchButtonIcon.classList.replace("bx-x", "bx-search");
//     }
//   }
// });

// if (window.innerWidth < 768) {
//   sidebar.classList.add("hide");
// } else if (window.innerWidth > 576) {
//   searchButtonIcon.classList.replace("bx-x", "bx-search");
//   searchForm.classList.remove("show");
// }

// window.addEventListener("resize", function () {
//   if (this.innerWidth > 576) {
//     searchButtonIcon.classList.replace("bx-x", "bx-search");
//     searchForm.classList.remove("show");
//   }
// });

// Ditambah Dari sini data CHART
// Fungsi untuk memuat data dari file JSON

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".wrapper");
  const carousel = document.querySelector(".carousel");
  const firstCardWidth = carousel.querySelector(".card").offsetWidth;
  const arrowBtns = document.querySelectorAll(".wrapper i");
  const carouselChildrens = [...carousel.children];
  // Burger Option
  const burger = document.querySelector(".burger");
  const navbar = document.querySelector(".navbar");

  burger.addEventListener("click", () => {
    navbar.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });

  // Navigasi
  const dataLink = document.getElementById("data-link");
  const tableSection = document.getElementById("table");
  const dashboardLink = document.getElementById("dashboard-link");
  const dashboardSection = document.getElementById("dashboard");

  dataLink.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah perilaku default dari link
    // Menampilkan bagian tabel dan menyembunyikan bagian lainnya
    tableSection.style.display = "block";
    document
      .querySelectorAll("main > section:not(#table)")
      .forEach(function (section) {
        section.style.display = "none";
      });
  });

  dashboardLink.addEventListener("click", function (event) {
    event.preventDefault(); // Mencegah perilaku default dari link
    // Menampilkan bagian tabel dan menyembunyikan bagian lainnya
    dashboardSection.style.display = "block";
    document
      .querySelectorAll("main > section:not(#dashboard)")
      .forEach(function (section) {
        section.style.display = "none";
      });
  });
  let isDragging = false,
    isAutoPlay = true,
    startX,
    startScrollLeft,
    timeoutId;

  // Get the number of cards that can fit in the carousel at once
  let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

  // Insert copies of the last few cards to beginning of carousel for infinite scrolling
  carouselChildrens
    .slice(-cardPerView)
    .reverse()
    .forEach((card) => {
      carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
    });

  // Insert copies of the first few cards to end of carousel for infinite scrolling
  carouselChildrens.slice(0, cardPerView).forEach((card) => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  // Scroll the carousel at appropriate postition to hide first few duplicate cards on Firefox
  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");

  // Add event listeners for the arrow buttons to scroll the carousel left and right
  arrowBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      carousel.scrollLeft +=
        btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
  });

  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  const infiniteScroll = () => {
    // If the carousel is at the beginning, scroll to the end
    if (carousel.scrollLeft === 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
    // If the carousel is at the end, scroll to the beginning
    else if (
      Math.ceil(carousel.scrollLeft) ===
      carousel.scrollWidth - carousel.offsetWidth
    ) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over carousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
  };

  const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the carousel after every 2500 ms
    timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
  };
  autoPlay();

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infiniteScroll);
  wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
  wrapper.addEventListener("mouseleave", autoPlay);
});

document.addEventListener("DOMContentLoaded", function () {
  const rowsPerPage = 10;
  let currentPage = 1;
  let totalPages = 1;
  let data = [];
  let filteredData = [];

  fetch("./Superstore.json")
    .then((response) => response.json())
    .then((jsonData) => {
      data = jsonData;
      filteredData = data;
      totalPages = Math.ceil(data.length / rowsPerPage);
      displayPage(currentPage);
    })
    .catch((error) => console.error("Error fetching data:", error));

  function displayPage(page) {
    const tableBody = document.querySelector("#Superstore-table tbody");
    tableBody.innerHTML = "";

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);

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
});

document.addEventListener("DOMContentLoaded", () => {
  function fetchData(url, callback) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data loaded:", data); // Tambahkan log ini
        callback(data);
      })
      .catch((error) => console.error("Error loading data:", error));
  }

  // Doughnut Chart 1
  const doughnut1ctx = document.getElementById("doughnut1").getContext("2d");
  new Chart(doughnut1ctx, {
    type: "doughnut",
    data: {
      labels: ["Buyer", "Discount Hunter", "Royal Buyer"],
      datasets: [
        {
          label: "Total Customers by Type",
          data: [788, 695, 609],
          backgroundColor: [
            "rgb(124, 191, 125)",
            "rgb(34, 110, 30)",
            "rgb(34, 34, 34)",
          ],
          borderColor: [
            "rgba(124, 191, 125, 0.8)",
            "rgba(34, 110, 30, 0.8)",
            "rgba(34, 34, 34, 0.8)",
          ],
          hoverBackgroundColor: [
            "rgba(124, 191, 125, 0.7)",
            "rgba(34, 110, 30, 0.7)",
            "rgba(34, 34, 34, 0.7)",
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: { size: 14 },
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            },
          },
        },
      },
    },
  });

  // Line Chart
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  new Chart(lineCtx, {
    type: "line",
    data: {
      labels: [
        "K1,2014",
        "K2, 2014",
        "K3, 2014",
        "K4, 2014",
        "K1, 2015",
        "K2, 2015",
        "K3, 2015",
        "K4, 2015",
        "K1, 2016",
        "K2, 2016",
        "K3, 2016",
        "K4, 2016",
        "K1, 2017",
        "K2, 2017",
        "K3, 2017",
        "K4, 2017",
      ],
      datasets: [
        {
          label: "Royal Buyer",
          backgroundColor: "rgb(34, 110, 30)",
          borderColor: "rgb(34, 110, 30, 1)",
          data: [
            81988989, 80083122, 86601961, 73532886, 59845573, 53687387,
            56905252, 37562782, 115512690, 127033339, 81220828, 100739376,
            173770316, 76615459, 117363898, 95512161,
          ],
        },
        {
          label: "Buyer",
          backgroundColor: "rgb(124, 191, 125)",
          borderColor: "rgb(124, 191, 125)",
          data: [
            42146534.29, 38960471.66, 43434069.03, 45398879.46, 37701435.21,
            35439018.55, 43338250.74, 48893304.37, 54569253.6, 50006688.33,
            47182921.75, 53851244.23, 76299477.29, 49672335.69, 65381652.7,
            56555675.31,
          ],
        },
        {
          label: "Diskon",
          backgroundColor: "rgb(34, 34, 34)",
          borderColor: "rgb(34, 34, 34, 1)",
          data: [
            -18816289.62, -11819324.96, -26809504.66, -30759837, -16196171.28,
            -13311986.47, -32941454.38, -13517143.02, -35345382.36,
            -19192834.75, -30616512.01, -21702652.05, -44887770.79,
            -58537857.09, -61042935, -20548990.24,
          ],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            font: { size: 14 },
          },
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.label}: ${tooltipItem.raw}`;
            },
          },
        },
      },
    },
  });
});

// Quantity Chart
const quantityChartCtx = document
  .getElementById("quantityChart")
  .getContext("2d");
new Chart(quantityChartCtx, {
  type: "bar",
  data: {
    labels: ["Office Supplies", "Furniture", "Technology"],
    datasets: [
      {
        label: "Buyer",
        backgroundColor: "rgb(124, 191, 125)",
        data: [15431, 4200, 4896],
      },
      {
        label: "Discount Hunter",
        backgroundColor: "rgba(34, 110, 30)",
        data: [4391, 2872, 1060],
      },
      {
        label: "Royal Buyer",
        backgroundColor: "rgb(34, 34, 34)",
        data: [3084, 954, 983],
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Best Seller Chart
const bestSellerChartCtx = document
  .getElementById("bestSellerChart")
  .getContext("2d");
new Chart(bestSellerChartCtx, {
  type: "bar",
  data: {
    labels: ["Bookcase", "Chairs", "Phones", "Table", "Binders"],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgb(124, 191, 125)",
        data: [
          199349619.64, 168189548.99, 144787328.64, 128666146.75, 97257981.27,
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Best Profit Chart
const bestProfitChartCtx = document
  .getElementById("bestProfitChart")
  .getContext("2d");
new Chart(bestProfitChartCtx, {
  type: "bar",
  data: {
    labels: ["Paper", "Binders", "Phones", "Storage", "Furnishings"],
    datasets: [
      {
        label: "Profit",
        backgroundColor: "rgb(124, 191, 125)",
        data: [
          738495793.87, 489329791.65, 442118609.11, 433206872.84, 428677331.12,
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Customer Region Chart
const customerRegionChartCtx = document
  .getElementById("customerRegionChart")
  .getContext("2d");
new Chart(customerRegionChartCtx, {
  type: "bar",
  data: {
    labels: ["West", "East", "Central", "South"],
    datasets: [
      {
        label: "Buyer",
        backgroundColor: "rgb(124, 191, 125)",
        data: [2316, 1736, 1241, 1006],
      },
      {
        label: "Discount Hunter",
        backgroundColor: "rgba(34, 34, 34)",
        data: [461, 704, 807, 330],
      },
      {
        label: "Royal Buyer",
        backgroundColor: "rgb(34, 110, 30)",
        data: [426, 407, 275, 224],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Best Seller City Chart
const bestSellerCityChartCtx = document
  .getElementById("bestSellerCityChart")
  .getContext("2d");
new Chart(bestSellerCityChartCtx, {
  type: "bar",
  data: {
    labels: [
      "Houston",
      "New York City",
      "Los Angeles",
      "Philadelphia",
      "San Francisco",
    ],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgb(124, 191, 125)",
        data: [
          106.91459961, 96.55275552, 91.90595666, 78.34267868, 51.66008364,
        ],
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + value + "M";
          },
        },
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return "$" + tooltipItem.raw + "M";
        },
      },
    },
  },
});

// Top Profitable City Chart
const topProfitableCityChartCtx = document
  .getElementById("topProfitableCityChart")
  .getContext("2d");
new Chart(topProfitableCityChartCtx, {
  type: "bar",
  data: {
    labels: [
      "New York City",
      "Los Angeles",
      "Seattle",
      "San Francisco",
      "Columbus",
    ],
    datasets: [
      {
        label: "Profit",
        backgroundColor: "rgb(124, 191, 125)",
        data: [652.43, 395.42, 354.43, 274.26, 111.73],
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y", // Ensures the labels are displayed on the y-axis
    scales: {
      x: {
        // Scales x for the horizontal axis
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return "$" + (value / 1000).toFixed(2) + "M";
          },
        },
      },
      y: {
        // Scales y for the vertical axis
        beginAtZero: true,
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return "$" + (tooltipItem.raw / 1000).toFixed(2) + "M";
        },
      },
    },
  },
});

// Doughnut Chart 2
const doughnut2ctx = document.getElementById("doughnut2").getContext("2d");
new Chart(doughnut2ctx, {
  type: "doughnut",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Distribusi Order by Segment",
        data: [5.191, 3.02, 1.782],
        backgroundColor: [
          "rgb(124, 191, 125)",
          "rgb(158, 208, 159)",
          "rgb(200, 228, 200)",
        ],
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
  },
});

// Sales by Segment Chart
const salesbySegmentChartCtx = document
  .getElementById("salesbySegmentChart")
  .getContext("2d");
new Chart(salesbySegmentChartCtx, {
  type: "bar",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgb(124, 191, 125)",
        data: [546712785.48, 302178954.41, 179106920.55],
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

// Profit by Segment Chart
const profitbySegmentChartCtx = document
  .getElementById("profitbySegmentChart")
  .getContext("2d");
new Chart(profitbySegmentChartCtx, {
  type: "bar",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Profit",
        backgroundColor: "rgb(124, 191, 125)",
        data: [2236557753.26, 1358000000, 842935000],
        borderWidth: 1,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const bestDiscountChartCtx = document
  .getElementById("bestDiscountChart")
  .getContext("2d");

const labels = [
  "0.2",
  "0.7",
  "0.8",
  "0.3",
  "0.4",
  "0.6",
  "0.1",
  "0.5",
  "0.15",
  "0.32",
];
const dataBuyer = [2435, 0, 0, 18, 21, 0, 77, 0, 30, 0];
const dataDiskonHunter = [689, 418, 300, 207, 181, 138, 6, 66, 18, 27];
const dataRoyalBuyer = [533, 0, 0, 1, 4, 0, 11, 0, 4, 0];

const bestDiscountChart = new Chart(bestDiscountChartCtx, {
  type: "bar",
  data: {
    labels: labels,
    datasets: [
      {
        label: "Buyer",
        backgroundColor: "rgb(124, 191, 125)",
        data: dataBuyer,
      },
      {
        label: "Diskon Hunter",
        backgroundColor: "rgba(34, 110, 30)",
        data: dataDiskonHunter,
      },
      {
        label: "Royal Buyer",
        backgroundColor: "rgb(34, 34, 34)",
        data: dataRoyalBuyer,
      },
    ],
  },
  options: {
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const customerSegmentChartCtx = document
  .getElementById("customerSegmentChart")
  .getContext("2d");
const customerSegmentChart = new Chart(customerSegmentChartCtx, {
  type: "bar",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Consumer",
        backgroundColor: "rgb(124, 191, 125)",
        data: [409, 0, 0],
      },
      {
        label: "Corporate",
        backgroundColor: "rgba(34, 34, 34)",
        data: [0, 246, 0],
      },
      {
        label: "Home Office",
        backgroundColor: "rgb(34, 110, 30)",
        data: [0, 0, 148],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
// Sampai sini js CHART
