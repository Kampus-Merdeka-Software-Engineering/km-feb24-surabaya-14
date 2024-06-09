function fetchData(url, callback) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data loaded:", data);
      callback(data);
    })
    .catch((error) => console.error("Error loading data:", error));
}

function processDoughnut1Data(data) {
  const labels = ["Royal Buyer", "Buyer", "Diskon Hunter"];
  const count = { "Royal Buyer": 0, Buyer: 0, "Diskon Hunter": 0 };

  data.forEach((item) => {
    if (item.Outlier === "Outlier Bawah") count["Diskon Hunter"]++;
    if (item.Outlier === "Outlier Atas") count["Royal Buyer"]++;
    if (item.Outlier === "Bukan Outlier") count["Buyer"]++;
  });

  return { labels, data: Object.values(count) };
}

function processDoughnut2Data(data) {
  const labels = ["Consumer", "Corporate", "Home Office"];
  const count = { Consumer: 0, Corporate: 0, "Home Office": 0 };

  const uniqueOrderIDs = new Set(data.map((d) => d["Order ID"]));
  uniqueOrderIDs.forEach((orderID) => {
    const orderItems = data.filter((d) => d["Order ID"] === orderID);
    count[orderItems[0].Segment]++;
  });

  return { labels, data: Object.values(count) };
}

function processSalesBySegmentData(data) {
  const labels = ["Consumer", "Corporate", "Home Office"];
  const count = { Consumer: 0, Corporate: 0, "Home Office": 0 };

  data.forEach((item) => {
    const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
    count[item.Segment] += sales;
  });

  return { labels, data: Object.values(count) };
}

function processProfitBySegmentData(data) {
  const labels = ["Consumer", "Corporate", "Home Office"];
  const count = { Consumer: 0, Corporate: 0, "Home Office": 0 };

  data.forEach((item) => {
    const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));
    count[item.Segment] += profit;
  });

  return { labels, data: Object.values(count) };
}

function processLineData(data) {
  const years = ["2014", "2015", "2016", "2017"];
  const profitData = {
    "Royal Buyer": new Array(years.length).fill(0),
    Buyer: new Array(years.length).fill(0),
    "Diskon Hunter": new Array(years.length).fill(0),
  };

  data.forEach((item) => {
    const orderDate = new Date(item["Order_Date"]);
    const year = orderDate.getFullYear().toString();
    const yearIndex = years.indexOf(year);
    const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));

    if (yearIndex !== -1) {
      if (item.Outlier === "Outlier Bawah")
        profitData["Diskon Hunter"][yearIndex] += profit;
      if (item.Outlier === "Outlier Atas")
        profitData["Royal Buyer"][yearIndex] += profit;
      if (item.Outlier === "Bukan Outlier")
        profitData["Buyer"][yearIndex] += profit;
    }
  });

  return {
    labels: years,
    datasets: [
      { label: "Royal Buyer", data: profitData["Royal Buyer"] },
      { label: "Buyer", data: profitData["Buyer"] },
      { label: "Diskon Hunter", data: profitData["Diskon Hunter"] },
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

  return { labels: categoryLabels, datasets: quantityData };
}

function processBestSellerData(data) {
  const subCategorySales = {};
  data.forEach((item) => {
    const subCategoryName = item["Sub-Category"];
    const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
    subCategorySales[subCategoryName] =
      (subCategorySales[subCategoryName] || 0) + sales;
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
      { label: "Sales", data: topSubCategories.map((item) => item.sales) },
    ],
  };
}

function processBestProfitData(data) {
  const cityProfit = {};
  data.forEach((item) => {
    const cityName = item.City;
    const profit = parseFloat(item.Profit.replace(/[$,]/g, ""));
    cityProfit[cityName] = (cityProfit[cityName] || 0) + profit;
  });

  const topCities = Object.keys(cityProfit)
    .map((city) => ({ city, profit: cityProfit[city] }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  return {
    labels: topCities.map((item) => item.city),
    datasets: [{ label: "Profit", data: topCities.map((item) => item.profit) }],
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

  return { labels: regions, datasets: customerData };
}

function processBestSellerCityData(data) {
  const citySales = {};

  data.forEach((item) => {
    const cityName = item.City;
    const sales = parseFloat(item.Sales.replace(/[$,]/g, ""));
    citySales[cityName] = (citySales[cityName] || 0) + sales;
  });

  const topCities = Object.keys(citySales)
    .map((city) => ({ city, sales: citySales[city] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return {
    labels: topCities.map((item) => item.city),
    datasets: [{ label: "Sales", data: topCities.map((item) => item.sales) }],
  };
}

//Chart Initialization Functions
let chartInstances = {};

function initializeChart(ctx, type, data, config) {
  if (chartInstances[type]) {
    chartInstances[type].destroy();
  }
  const processedData = config.processData(data);
  chartInstances[type] = new Chart(ctx, {
    type: config.type,
    data: {
      labels: processedData.labels,
      datasets: [
        {
          label: config.label,
          data: processedData.data,
          borderWidth: 1,
          backgroundColor: config.colors,
        },
      ],
    },
    options: config.options,
    plugins: [ChartDataLabels],
  });
}

function initializeLineChart(ctx, data) {
  if (chartInstances.lineChart) {
    chartInstances.lineChart.destroy();
  }
  const lineData = processLineData(data);
  chartInstances.lineChart = new Chart(ctx, {
    type: "line",
    data: lineData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: { display: true, text: "Total Profit (year)" },
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
}

function initializeBarChart(ctx, data, processDataFunc, label) {
  if (chartInstances[label]) {
    chartInstances[label].destroy();
  }
  const processedData = processDataFunc(data);
  chartInstances[label] = new Chart(ctx, {
    type: "bar",
    data: {
      labels: processedData.labels,
      datasets: [
        {
          label: label,
          data: processedData.datasets[0].data,
          backgroundColor: "rgb(124, 191, 125)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      scales: { y: { beginAtZero: true } },
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
}

//chart style configuration
const chartConfigs = {
  doughnut1: {
    type: "doughnut",
    label: "Total Customers by Type Customers",
    colors: ["rgb(34, 110, 30)", "rgb(124, 191, 125)", "rgb(34, 34, 34)"],
    processData: processDoughnut1Data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
        datalabels: {
          color: "rgb(237, 237, 237)",
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, current) => sum + current,
              0
            );
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
      elements: {
        arc: { borderWidth: 2, borderColor: "rgb(237, 237, 237)" },
      },
    },
  },
  doughnut2: {
    type: "doughnut",
    label: "Distribusi Order by Segment",
    colors: ["rgb(124, 191, 125)", "rgb(34, 110, 30)", "rgb(34, 34, 34)"],
    processData: processDoughnut2Data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
        datalabels: {
          color: "rgb(237, 237, 237)",
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, current) => sum + current,
              0
            );
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
      elements: {
        arc: { borderWidth: 2, borderColor: "rgb(237, 237, 237)" },
      },
    },
  },
  salesbySegment: {
    type: "bar",
    label: "Sales",
    colors: ["rgb(124, 191, 125)", "rgb(34, 110, 30)", "rgb(34, 34, 34)"],
    processData: processSalesBySegmentData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
        datalabels: {
          color: "rgb(237, 237, 237)",
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, current) => sum + current,
              0
            );
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
      scales: { y: { beginAtZero: true } },
      elements: {
        arc: { borderWidth: 2, borderColor: "rgb(237, 237, 237)" },
      },
    },
  },
  profitbySegment: {
    type: "bar",
    label: "Profit",
    colors: ["rgb(124, 191, 125)", "rgb(34, 110, 30)", "rgb(34, 34, 34)"],
    processData: processProfitBySegmentData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" },
        tooltip: { enabled: true },
        datalabels: {
          color: "rgb(237, 237, 237)",
          formatter: (value, context) => {
            const total = context.chart.data.datasets[0].data.reduce(
              (sum, current) => sum + current,
              0
            );
            return ((value / total) * 100).toFixed(1) + "%";
          },
        },
      },
      scales: { y: { beginAtZero: true } },
      elements: {
        arc: { borderWidth: 2, borderColor: "rgb(237, 237, 237)" },
      },
    },
  },
};

document.addEventListener("DOMContentLoaded", () => {
  const chartContexts = {
    doughnut1: document.getElementById("doughnut1").getContext("2d"),
    doughnut2: document.getElementById("doughnut2").getContext("2d"),
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
    salesbySegmentChart: document
      .getElementById("salesbySegmentChart")
      .getContext("2d"),
    profitbySegmentChart: document
      .getElementById("profitbySegmentChart")
      .getContext("2d"),
  };

  fetchData("./Superstore.json", (data) => {
    initializeChart(
      chartContexts.doughnut1,
      "doughnut1",
      data,
      chartConfigs.doughnut1
    );
    initializeChart(
      chartContexts.doughnut2,
      "doughnut2",
      data,
      chartConfigs.doughnut2
    );
    initializeChart(
      chartContexts.salesbySegmentChart,
      "salesbySegment",
      data,
      chartConfigs.salesbySegment
    );
    initializeChart(
      chartContexts.profitbySegmentChart,
      "profitbySegment",
      data,
      chartConfigs.profitbySegment
    );

    initializeLineChart(chartContexts.lineChart, data);

    initializeBarChart(
      chartContexts.quantityChart,
      data,
      processBarData,
      "Quantity by Category and Customer Type"
    );
    initializeBarChart(
      chartContexts.bestSellerChart,
      data,
      processBestSellerData,
      "Best Sellers by Sub-Category"
    );
    initializeBarChart(
      chartContexts.bestProfitChart,
      data,
      processBestProfitData,
      "Best Profit by City"
    );
    initializeBarChart(
      chartContexts.customerRegionChart,
      data,
      processCustomerRegionData,
      "Customer Distribution by Region and Type"
    );
    initializeBarChart(
      chartContexts.bestSellerCityChart,
      data,
      processBestSellerCityData,
      "Sales by City"
    );
  });
});
