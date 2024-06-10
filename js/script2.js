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

  // Fungsi untuk memproses data sesuai kebutuhan chart
  function processData(data, chartType) {
    console.log("Processing data for chart type:", chartType);

    switch (chartType) {
      case "doughnut1":
        const OutlierLabels = ["Royal Buyer", "Buyer", "Diskon Hunter"];
        const OutlierColors = [
          "rgb(34, 110, 30)",
          "rgb(124, 191, 125)",
          "rgb(34, 34, 34)",
        ];
        const OutlierCount = OutlierLabels.reduce((acc, label) => {
          acc[label] = 0;
          return acc;
        }, {});

        data.forEach((item) => {
          if (item.Outlier === "Outlier Bawah") OutlierCount["Diskon Hunter"]++;
          if (item.Outlier === "Outlier Atas") OutlierCount["Royal Buyer"]++;
          if (item.Outlier === "Bukan Outlier") OutlierCount["Buyer"]++;
        });

        return {
          labels: OutlierLabels,
          datasets: [
            {
              label: "Total Customers by Type Customers",
              data: Object.values(OutlierCount),
              borderWidth: 1,
              backgroundColor: OutlierColors,
            },
          ],
        };
      default:
        return {};
    }
  }

  // Fungsi untuk menginisialisasi atau memperbarui chart
  function initializeChart(ctx, chartType, data) {
    const processedData = processData(data, chartType);
    console.log("Processed data:", processedData); // Tambahkan log ini
    return new Chart(ctx, {
      type: "doughnut",
      data: processedData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: "rgb(237, 237, 237)", // Warna angka yang ditampilkan
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce(
                (sum, current) => sum + current,
                0
              );
              const percentage = ((value / total) * 100).toFixed(1);
              return percentage + "%";
            },
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
            borderColor: "rgb(237, 237, 237)", // Tambahkan warna border
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

  // Fungsi untuk memproses data untuk line chart
  function processLineData(data) {
    // Extract unique years from the data and sort them
    const years = Array.from(
      new Set(
        data.map((item) =>
          new Date(item["Order_Date"]).getFullYear().toString()
        )
      )
    ).sort();

    // Initialize the profit data structure
    const profitData = {
      "Royal Buyer": new Array(years.length).fill(0),
      Buyer: new Array(years.length).fill(0),
      "Diskon Hunter": new Array(years.length).fill(0),
    };

    // Aggregate the profit by year and outlier type
    data.forEach((item) => {
      const orderDate = new Date(item["Order_Date"]);
      const year = orderDate.getFullYear().toString();
      const yearIndex = years.indexOf(year);
      const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));

      if (yearIndex !== -1) {
        if (item.Outlier === "Outlier Bawah") {
          profitData["Diskon Hunter"][yearIndex] += profit;
        } else if (item.Outlier === "Outlier Atas") {
          profitData["Royal Buyer"][yearIndex] += profit;
        } else if (item.Outlier === "Bukan Outlier") {
          profitData["Buyer"][yearIndex] += profit;
        }
      }
    });

    console.log("Processed Profit Data:", profitData);

    // Sort the data by profit for each year
    const sortedYears = years.map((year, index) => {
      return {
        year,
        "Royal Buyer": profitData["Royal Buyer"][index],
        Buyer: profitData["Buyer"][index],
        "Diskon Hunter": profitData["Diskon Hunter"][index],
      };
    });

    // Return the processed data
    return {
      labels: years,
      datasets: [
        {
          label: "Royal Buyer",
          backgroundColor: "rgb(34, 110, 30)",
          borderColor: "rgb(34, 110, 30)",
          data: sortedYears.map((item) => item["Royal Buyer"]),
          fill: false,
        },
        {
          label: "Buyer",
          backgroundColor: "rgb(124, 191, 125)",
          borderColor: "rgb(124, 191, 125)",
          data: sortedYears.map((item) => item.Buyer),
          fill: false,
        },
        {
          label: "Diskon Hunter",
          backgroundColor: "rgb(34, 34, 34)",
          borderColor: "rgb(34, 34, 34)",
          data: sortedYears.map((item) => item["Diskon Hunter"]),
          fill: false,
        },
      ],
    };
  }

  function processBarData(data) {
    const categoryLabels = ["Office Supplies", "Furniture", "Technology"];
    const quantityData = {
      Buyer: [0, 0, 0],
      "Discount Hunter": [0, 0, 0],
      "Royal Buyer": [0, 0, 0],
    };

    data.forEach((item) => {
      const categoryIndex = categoryLabels.indexOf(item.Category);
      if (categoryIndex !== -1) {
        if (item.Outlier === "Outlier Bawah")
          quantityData["Discount Hunter"][categoryIndex] += item.Quantity;
        if (item.Outlier === "Outlier Atas")
          quantityData["Royal Buyer"][categoryIndex] += item.Quantity;
        if (item.Outlier === "Bukan Outlier")
          quantityData["Buyer"][categoryIndex] += item.Quantity;
      }
    });

    return {
      labels: categoryLabels,
      datasets: [
        {
          label: "Buyer",
          backgroundColor: "rgb(124, 191, 125)",
          data: quantityData["Buyer"],
        },
        {
          label: "Discount Hunter",
          backgroundColor: "rgba(34, 110, 30)",
          data: quantityData["Discount Hunter"],
        },
        {
          label: "Royal Buyer",
          backgroundColor: "rgb(34, 34, 34)",
          data: quantityData["Royal Buyer"],
        },
      ],
    };
  }

  function processBestSellerData(data) {
    const subCategorySales = {};
    data.forEach((item) => {
      const subCategoryName = item["Sub-Category"];
      const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
      if (!subCategorySales[subCategoryName]) {
        subCategorySales[subCategoryName] = 0;
      }
      subCategorySales[subCategoryName] += sales;
    });

    const topSubCategories = Object.keys(subCategorySales)
      .map((subCategory) => ({
        subCategory,
        sales: subCategorySales[subCategory],
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      labels: topSubCategories.map((item) => item.subCategory),
      datasets: [
        {
          label: "Sales",
          backgroundColor: "rgb(124, 191, 125)",
          data: topSubCategories.map((item) => item.sales),
          borderWidth: 1,
        },
      ],
    };
  }

  function processBestProfitData(data) {
    const cityProfit = {};
    data.forEach((item) => {
      const cityName = item.City;
      const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));
      if (!cityProfit[cityName]) {
        cityProfit[cityName] = 0;
      }
      cityProfit[cityName] += profit;
    });

    const topCities = Object.keys(cityProfit)
      .map((city) => ({ city, profit: cityProfit[city] }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5);

    return {
      labels: topCities.map((item) => item.city),
      datasets: [
        {
          label: "Profit",
          backgroundColor: "rgb(124, 191, 125)",
          data: topCities.map((item) => item.profit),
          borderWidth: 1,
        },
      ],
    };
  }

  function processCustomerRegionData(data) {
    const regions = ["West", "East", "Central", "South"];
    const customerData = {
      Buyer: new Array(regions.length).fill(0),
      "Discount Hunter": new Array(regions.length).fill(0),
      "Royal Buyer": new Array(regions.length).fill(0),
    };

    const uniqueCustomers = {};

    data.forEach((item) => {
      const region = item.Region;
      const customerId = item["Customer_ID"];
      const outlier = item.Outlier;

      if (!uniqueCustomers[customerId]) {
        uniqueCustomers[customerId] = { region: region, outlier: outlier };
      }
    });

    Object.values(uniqueCustomers).forEach((customer) => {
      const regionIndex = regions.indexOf(customer.region);
      if (regionIndex !== -1) {
        if (customer.outlier === "Outlier Bawah")
          customerData["Discount Hunter"][regionIndex]++;
        if (customer.outlier === "Outlier Atas")
          customerData["Royal Buyer"][regionIndex]++;
        if (customer.outlier === "Bukan Outlier")
          customerData["Buyer"][regionIndex]++;
      }
    });

    return {
      labels: regions,
      datasets: [
        {
          label: "Buyer",
          backgroundColor: "rgb(124, 191, 125)",
          data: customerData["Buyer"],
        },
        {
          label: "Discount Hunter",
          backgroundColor: "rgba(34, 34, 34)",
          data: customerData["Discount Hunter"],
        },
        {
          label: "Royal Buyer",
          backgroundColor: "rgb(34, 110, 30)",
          data: customerData["Royal Buyer"],
        },
      ],
    };
  }

  function processBestSellerCityData(data) {
    const citySales = {};

    data.forEach((item) => {
      const cityName = item.City;
      const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
      if (!citySales[cityName]) {
        citySales[cityName] = 0;
      }
      citySales[cityName] += sales;
    });

    const topCities = Object.keys(citySales)
      .map((city) => ({ city, sales: citySales[city] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return {
      labels: topCities.map((item) => item.city),
      datasets: [
        {
          label: "Sales",
          backgroundColor: "rgb(124, 191, 125)",
          data: topCities.map((item) => item.sales),
          borderWidth: 1,
        },
      ],
    };
  }

  // penggunaan
  const doughnut1ctx = document.getElementById("doughnut1").getContext("2d");
  const lineCtx = document.getElementById("lineChart").getContext("2d");
  const quantityChartCtx = document
    .getElementById("quantityChart")
    .getContext("2d");
  const bestSellerChartCtx = document
    .getElementById("bestSellerChart")
    .getContext("2d");
  const bestProfitChartCtx = document
    .getElementById("bestProfitChart")
    .getContext("2d");
  const customerRegionChartCtx = document
    .getElementById("customerRegionChart")
    .getContext("2d");
  const bestSellerCityChartCtx = document
    .getElementById("bestSellerCityChart")
    .getContext("2d");

  fetchData("./Superstore.json", (data) => {
    // Inisialisasi doughnut chart
    initializeChart(doughnut1ctx, "doughnut1", data);

    // Inisialisasi line chart
    const lineData = processLineData(data);
    new Chart(lineCtx, {
      type: "line",
      data: lineData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: "Total Profit (year)",
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return "Rp " + tooltipItem.raw.toLocaleString();
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "Rp " + value.toLocaleString();
              },
            },
          },
        },
      },
    });

    // Inisialisasi bar chart
    const barData = processBarData(data);
    new Chart(quantityChartCtx, {
      type: "bar",
      data: barData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Inisialisasi best seller chart
    const bestSellerData = processBestSellerData(data);
    new Chart(bestSellerChartCtx, {
      type: "bar",
      data: bestSellerData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Inisialisasi best profit chart berdasarkan City
    const bestProfitData = processBestProfitData(data);
    new Chart(bestProfitChartCtx, {
      type: "bar",
      data: bestProfitData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    // Inisialisasi customer region chart
    const customerRegionData = processCustomerRegionData(data);
    new Chart(customerRegionChartCtx, {
      type: "bar",
      data: customerRegionData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          title: {
            display: true,
            text: "Total Customer by Region",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const bestSellerCityData = processBestSellerCityData(data);
    new Chart(bestSellerCityChartCtx, {
      type: "bar",
      data: bestSellerCityData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value.toFixed(2);
              },
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return "$" + tooltipItem.raw.toFixed(2);
              },
            },
          },
        },
      },
    });
  });
});

// TAMBAHAN
const topProfitableCityChartCtx = document
  .getElementById("topProfitableCityChart")
  .getContext("2d");
const topProfitableCityChart = new Chart(topProfitableCityChartCtx, {
  type: "bar",
  data: {
    labels: [
      "New York City",
      "Los Angeles",
      "Seattle San",
      "San Fransisco",
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
    indexAxis: "y",
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, values) {
            return "$" + value.toFixed(2);
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return "$" + tooltipItem.raw.toFixed(2);
          },
        },
      },
    },
  },
});

const doughnut2ctx = document.getElementById("doughnut2").getContext("2d");
const doughnut2chart = new Chart(doughnut2ctx, {
  type: "doughnut",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Distribusi Order by Segment",
        data: [2.586, 1.514, 909],
        borderWidth: 1,
        backgroundColor: [
          "rgb(124, 191, 125)",
          "rgb(34, 110, 30)",
          "rgb(34, 34, 34)",
        ],
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

const salesbySegmentChartCtx = document
  .getElementById("salesbySegmentChart")
  .getContext("2d");
const salesbySegmentChart = new Chart(salesbySegmentChartCtx, {
  type: "bar",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Sales",
        backgroundColor: "rgb(124, 191, 125)",
        data: [546.712, 302.178, 179.106],
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

const profitbySegmentChartCtx = document
  .getElementById("profitbySegmentChart")
  .getContext("2d");
const profitbySegmentChart = new Chart(profitbySegmentChartCtx, {
  type: "bar",
  data: {
    labels: ["Consumer", "Corporate", "Home Office"],
    datasets: [
      {
        label: "Profit",
        backgroundColor: "rgb(124, 191, 125)",
        data: [2.236, 1.358, 842.935],
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

// Sampai sini js CHART
