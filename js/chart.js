document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "./Superstore.json";

  // Fetch data from the provided URL and execute the callback with the data
  function fetchData(url, callback) {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data loaded:", data);
        callback(data);
      })
      .catch((error) => console.error("Error loading data:", error));
  }

  // Process data for different chart types
  function processData(data, chartType) {
    console.log("Processing data for chart type:", chartType);

    const chartProcessors = {
      doughnut1: processDoughnutData,
      line: processLineData,
      bar: processBarData,
      bestSeller: processBestSellerData,
      bestProfit: processBestProfitData,
      customerRegion: processCustomerRegionData,
      bestSellerCity: processBestSellerCityData,
    };

    return chartProcessors[chartType] ? chartProcessors[chartType](data) : {};
  }

  // Doughnut chart data processing
  function processDoughnutData(data) {
    const labels = ["Royal Buyer", "Buyer", "Diskon Hunter"];
    const colors = [
      "rgb(34, 110, 30)",
      "rgb(124, 191, 125)",
      "rgb(34, 34, 34)",
    ];
    const counts = { "Royal Buyer": 0, Buyer: 0, "Diskon Hunter": 0 };

    data.forEach((item) => {
      if (item.Outlier === "Outlier Bawah") counts["Diskon Hunter"]++;
      else if (item.Outlier === "Outlier Atas") counts["Royal Buyer"]++;
      else counts["Buyer"]++;
    });

    return {
      labels,
      datasets: [
        {
          label: "Total Customers by Type",
          data: Object.values(counts),
          borderWidth: 1,
          backgroundColor: colors,
        },
      ],
    };
  }

  // Line chart data processing
  function processLineData(data) {
    const years = ["2014", "2015", "2016", "2017"];
    const profitData = {
      "Royal Buyer": Array(years.length).fill(0),
      Buyer: Array(years.length).fill(0),
      "Diskon Hunter": Array(years.length).fill(0),
    };

    data.forEach((item) => {
      const year = new Date(item.Order_Date).getFullYear().toString();
      const yearIndex = years.indexOf(year);
      const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));

      if (yearIndex !== -1) {
        if (item.Outlier === "Outlier Bawah")
          profitData["Diskon Hunter"][yearIndex] += profit;
        else if (item.Outlier === "Outlier Atas")
          profitData["Royal Buyer"][yearIndex] += profit;
        else profitData["Buyer"][yearIndex] += profit;
      }
    });

    return {
      labels: years,
      datasets: [
        {
          label: "Royal Buyer",
          backgroundColor: "rgb(34, 110, 30)",
          borderColor: "rgb(34, 110, 30)",
          data: profitData["Royal Buyer"],
          fill: false,
        },
        {
          label: "Buyer",
          backgroundColor: "rgb(124, 191, 125)",
          borderColor: "rgb(124, 191, 125)",
          data: profitData["Buyer"],
          fill: false,
        },
        {
          label: "Diskon Hunter",
          backgroundColor: "rgb(34, 34, 34)",
          borderColor: "rgb(34, 34, 34)",
          data: profitData["Diskon Hunter"],
          fill: false,
        },
      ],
    };
  }

  // Bar chart data processing
  function processBarData(data) {
    const labels = ["Office Supplies", "Furniture", "Technology"];
    const quantityData = {
      Buyer: [0, 0, 0],
      "Discount Hunter": [0, 0, 0],
      "Royal Buyer": [0, 0, 0],
    };

    data.forEach((item) => {
      const categoryIndex = labels.indexOf(item.Category);
      if (categoryIndex !== -1) {
        if (item.Outlier === "Outlier Bawah")
          quantityData["Discount Hunter"][categoryIndex] += item.Quantity;
        else if (item.Outlier === "Outlier Atas")
          quantityData["Royal Buyer"][categoryIndex] += item.Quantity;
        else quantityData["Buyer"][categoryIndex] += item.Quantity;
      }
    });

    return {
      labels,
      datasets: [
        {
          label: "Buyer",
          backgroundColor: "rgb(124, 191, 125)",
          data: quantityData["Buyer"],
        },
        {
          label: "Discount Hunter",
          backgroundColor: "rgb(34, 110, 30)",
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

  // Best seller chart data processing
  function processBestSellerData(data) {
    const salesData = {};
    data.forEach((item) => {
      const subCategory = item["Sub-Category"];
      const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
      salesData[subCategory] = (salesData[subCategory] || 0) + sales;
    });

    const topSubCategories = Object.entries(salesData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([subCategory, sales]) => ({ subCategory, sales }));

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

  // Best profit chart data processing
  function processBestProfitData(data) {
    const profitData = {};
    data.forEach((item) => {
      const city = item.City;
      const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));
      profitData[city] = (profitData[city] || 0) + profit;
    });

    const topCities = Object.entries(profitData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city, profit]) => ({ city, profit }));

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

  // Customer region chart data processing
  function processCustomerRegionData(data) {
    const regions = ["West", "East", "Central", "South"];
    const customerData = {
      Buyer: Array(regions.length).fill(0),
      "Discount Hunter": Array(regions.length).fill(0),
      "Royal Buyer": Array(regions.length).fill(0),
    };

    const uniqueCustomers = {};

    data.forEach((item) => {
      const customerId = item["Customer_ID"];
      if (!uniqueCustomers[customerId]) {
        uniqueCustomers[customerId] = {
          region: item.Region,
          outlier: item.Outlier,
        };
      }
    });

    Object.values(uniqueCustomers).forEach((customer) => {
      const regionIndex = regions.indexOf(customer.region);
      if (regionIndex !== -1) {
        if (customer.outlier === "Outlier Bawah")
          customerData["Discount Hunter"][regionIndex]++;
        else if (customer.outlier === "Outlier Atas")
          customerData["Royal Buyer"][regionIndex]++;
        else customerData["Buyer"][regionIndex]++;
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
          backgroundColor: "rgb(34, 34, 34)",
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

  // Best seller city chart data processing
  function processBestSellerCityData(data) {
    const salesData = {};
    data.forEach((item) => {
      const city = item.City;
      const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
      salesData[city] = (salesData[city] || 0) + sales;
    });

    const topCities = Object.entries(salesData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city, sales]) => ({ city, sales }));

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

  // Initialize or update the chart
  function initializeChart(ctx, chartType, data) {
    const processedData = processData(data, chartType);
    console.log("Processed data:", processedData);
    return new Chart(ctx, {
      type: chartType.includes("doughnut") ? "doughnut" : "bar",
      data: processedData,
      options: getChartOptions(chartType),
      plugins: [ChartDataLabels],
    });
  }

  // Get chart options based on chart type
  function getChartOptions(chartType) {
    const options = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          enabled: true,
        },
        datalabels: {
          color: "rgb(237, 237, 237)",
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, current) => sum + current,
              0
            );
            return `${((value / total) * 100).toFixed(1)}%`;
          },
        },
      },
      elements: {
        arc: {
          borderWidth: 2,
          borderColor: "rgb(237, 237, 237)",
        },
      },
    };

    if (chartType === "line") {
      options.plugins.title = {
        display: true,
        text: "Total Profit (year)",
      };
      options.scales = {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `Rp ${value.toLocaleString()}`,
          },
        },
      };
    } else {
      options.indexAxis = "y";
      options.scales = {
        y: {
          beginAtZero: true,
        },
      };
    }

    return options;
  }

  // Chart contexts
  const contexts = {
    doughnut1: document.getElementById("doughnut1").getContext("2d"),
    lineChart: document.getElementById("lineChart").getContext("2d"),
    quantityChart: document.getElementById("quantityChart").getContext("2d"),
    bestSellerChart: document
      .getElementById("bestSellerChart")
      .getContext("2d"),
    bestProfitChart: document
      .getElementById("bestProfitChart")
      .getContext("2d"),
    customerRegionChart: document
      .getElementById("customerRegionChart")
      .getContext("2d"),
    bestSellerCityChart: document
      .getElementById("bestSellerCityChart")
      .getContext("2d"),
  };

  // Fetch data and initialize charts
  fetchData(API_URL, (data) => {
    initializeChart(contexts.doughnut1, "doughnut1", data);
    new Chart(contexts.lineChart, {
      type: "line",
      data: processData(data, "line"),
      options: getChartOptions("line"),
    });
    new Chart(contexts.quantityChart, {
      type: "bar",
      data: processData(data, "bar"),
      options: getChartOptions("bar"),
    });
    new Chart(contexts.bestSellerChart, {
      type: "bar",
      data: processData(data, "bestSeller"),
      options: getChartOptions("bestSeller"),
    });
    new Chart(contexts.bestProfitChart, {
      type: "bar",
      data: processData(data, "bestProfit"),
      options: getChartOptions("bestProfit"),
    });
    new Chart(contexts.customerRegionChart, {
      type: "bar",
      data: processData(data, "customerRegion"),
      options: getChartOptions("customerRegion"),
    });
    new Chart(contexts.bestSellerCityChart, {
      type: "bar",
      data: processData(data, "bestSellerCity"),
      options: getChartOptions("bestSellerCity"),
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
