function fetchData(url, callback) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log("Data loaded:", data); // Tambahkan log ini
        callback(data);
      })
      .catch(error => console.error('Error loading data:', error));
  }
  
  // Fungsi untuk memproses data sesuai kebutuhan chart
  function processData(data, chartType) {
    console.log("Processing data for chart type:", chartType);
  
    switch (chartType) {
      case 'doughnut1':
        const OutlierLabels = ['Royal Buyer', 'Buyer', 'Diskon Hunter'];
        const OutlierColors = ['rgb(34, 110, 30)', 'rgb(124, 191, 125)', 'rgb(34, 34, 34)'];
        const OutlierCount = OutlierLabels.reduce((acc, label) => {
          acc[label] = 0;
          return acc;
        }, {});
  
        data.forEach(item => {
          if (item.Outlier === 'Outlier Bawah') OutlierCount['Diskon Hunter']++;
          if (item.Outlier  === 'Outlier Atas') OutlierCount['Royal Buyer']++;
          if (item.Outlier  === 'Bukan Outlier') OutlierCount['Buyer']++;
        });
  
        return {
          labels: OutlierLabels,
          datasets: [{
            label: 'Total Customers by Type Customers',
            data: Object.values(OutlierCount),
            borderWidth: 1,
            backgroundColor: OutlierColors
          }]
        };
      // Tambahkan case untuk chart lainnya di sini jika diperlukan
      default:
        return {};
    }
  }
  
  // Fungsi untuk menginisialisasi atau memperbarui chart
  function initializeChart(ctx, chartType, data) {
    const processedData = processData(data, chartType);
    console.log("Processed data:", processedData); // Tambahkan log ini
    return new Chart(ctx, {
      type: 'doughnut',
      data: processedData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            enabled: true,
          },
          datalabels: {
            color: 'rgb(237, 237, 237)', // Warna angka yang ditampilkan
            formatter: (value, context) => {
              const total = context.chart.data.datasets[0].data.reduce((sum, current) => sum + current, 0);
              const percentage = (value / total * 100).toFixed(1);
              return percentage + '%';
            }
          },
        },
        elements: {
          arc: {
            borderWidth: 2,
            borderColor: 'rgb(237, 237, 237)', // Tambahkan warna border
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }

   // Fungsi untuk memproses data untuk line chart
  function processLineData(data) {
    const years = ['2014', '2015', '2016', '2017'];
    const profitData = {
        'Royal Buyer': new Array(years.length).fill(0),
        'Buyer': new Array(years.length).fill(0),
        'Diskon Hunter': new Array(years.length).fill(0)
    };

    //buatkan saya menhitung data berdasarkan tahun saja
    
    data.forEach(item => {
        const orderDate = new Date(item['Order Date']);
        const year = orderDate.getFullYear().toString();
        const yearIndex = years.indexOf(year);
        const profit = parseFloat(item.Profit.replace(/[$,]/g, ''));
        
        if (yearIndex !== -1) {
            if (item.Outlier === 'Outlier Bawah') profitData['Diskon Hunter'][yearIndex] += profit;
            if (item.Outlier === 'Outlier Atas') profitData['Royal Buyer'][yearIndex] += profit;
            if (item.Outlier === 'Bukan Outlier') profitData['Buyer'][yearIndex] += profit;
        }
    });

    return {
        labels: years,
        datasets: [
            {
                label: 'Royal Buyer',
                backgroundColor: 'rgb(34, 110, 30)',
                borderColor: 'rgb(34, 110, 30, 1)',
                data: profitData['Royal Buyer'],
                fill: false
            },
            {
                label: 'Buyer',
                backgroundColor: 'rgb(124, 191, 125)',
                borderColor: 'rgb(124, 191, 125)',
                data: profitData['Buyer'],
                fill: false
            },
            {
                label: 'Diskon Hunter',
                backgroundColor: 'rgb(34, 34, 34)',
                borderColor: 'rgb(34, 34, 34, 1)',
                data: profitData['Diskon Hunter'],
                fill: false
            }
        ]
    };
}

function processBarData(data) {
    const categoryLabels = ['Office Supplies', 'Furniture', 'Technology'];
    const quantityData = {
        'Buyer': [0, 0, 0],
        'Discount Hunter': [0, 0, 0],
        'Royal Buyer': [0, 0, 0]
    };

    data.forEach(item => {
        const categoryIndex = categoryLabels.indexOf(item.Category);
        if (categoryIndex !== -1) {
            if (item.Outlier === 'Outlier Bawah') quantityData['Discount Hunter'][categoryIndex] += item.Quantity;
            if (item.Outlier === 'Outlier Atas') quantityData['Royal Buyer'][categoryIndex] += item.Quantity;
            if (item.Outlier === 'Bukan Outlier') quantityData['Buyer'][categoryIndex] += item.Quantity;
        }
    });

    return {
        labels: categoryLabels,
        datasets: [
            {
                label: 'Buyer',
                backgroundColor: 'rgb(124, 191, 125)',
                data: quantityData['Buyer']
            },
            {
                label: 'Discount Hunter',
                backgroundColor: 'rgba(34, 110, 30)',
                data: quantityData['Discount Hunter']
            },
            {
                label: 'Royal Buyer',
                backgroundColor: 'rgb(34, 34, 34)',
                data: quantityData['Royal Buyer']
            }
        ]
    };
}

function processBestSellerData(data) {
    const subCategorySales = {};
    data.forEach(item => {
        const subCategoryName = item['Sub-Category'];
        const sales = parseFloat(item.Sales.replace(/[$,]/g, ''));
        if (!subCategorySales[subCategoryName]) {
            subCategorySales[subCategoryName] = 0;
        }
        subCategorySales[subCategoryName] += sales;
    });

    const topSubCategories = Object.keys(subCategorySales)
        .map(subCategory => ({ subCategory, sales: subCategorySales[subCategory] }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

    return {
        labels: topSubCategories.map(item => item.subCategory),
        datasets: [{
            label: 'Sales',
            backgroundColor: 'rgb(124, 191, 125)',
            data: topSubCategories.map(item => item.sales),
            borderWidth: 1
        }]
    };
}

function processBestProfitData(data) {
    const cityProfit = {};
    data.forEach(item => {
        const cityName = item.City;
        const profit = parseFloat(item.Profit.replace(/[$,]/g, ''));
        if (!cityProfit[cityName]) {
            cityProfit[cityName] = 0;
        }
        cityProfit[cityName] += profit;
    });

    const topCities = Object.keys(cityProfit)
        .map(city => ({ city, profit: cityProfit[city] }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 5);

    return {
        labels: topCities.map(item => item.city),
        datasets: [{
            label: 'Profit',
            backgroundColor: 'rgb(124, 191, 125)',
            data: topCities.map(item => item.profit),
            borderWidth: 1
        }]
    };
}

function processCustomerRegionData(data) {
    const regions = ['West', 'East', 'Central', 'South'];
    const customerData = {
        'Buyer': new Array(regions.length).fill(0),
        'Discount Hunter': new Array(regions.length).fill(0),
        'Royal Buyer': new Array(regions.length).fill(0)
    };

    // Menggunakan objek untuk memastikan pelanggan unik berdasarkan ID
    const uniqueCustomers = {};

    data.forEach(item => {
        const region = item.Region;
        const customerId = item['Customer ID'];
        const outlier = item.Outlier;

        if (!uniqueCustomers[customerId]) {
            uniqueCustomers[customerId] = { region: region, outlier: outlier };
        }
    });

    // Menghitung jumlah pelanggan unik berdasarkan region dan tipe pelanggan
    Object.values(uniqueCustomers).forEach(customer => {
        const regionIndex = regions.indexOf(customer.region);
        if (regionIndex !== -1) {
            if (customer.outlier === 'Outlier Bawah') customerData['Discount Hunter'][regionIndex]++;
            if (customer.outlier === 'Outlier Atas') customerData['Royal Buyer'][regionIndex]++;
            if (customer.outlier === 'Bukan Outlier') customerData['Buyer'][regionIndex]++;
        }
    });

    return {
        labels: regions,
        datasets: [
            {
                label: 'Buyer',
                backgroundColor: 'rgb(124, 191, 125)',
                data: customerData['Buyer']
            },
            {
                label: 'Discount Hunter',
                backgroundColor: 'rgba(34, 34, 34)',
                data: customerData['Discount Hunter']
            },
            {
                label: 'Royal Buyer',
                backgroundColor: 'rgb(34, 110, 30)',
                data: customerData['Royal Buyer']
            }
        ]
    };
}

function processBestSellerCityData(data) {
    const citySales = {};

    data.forEach(item => {
        const cityName = item.City;
        const sales = parseFloat(item.Sales.replace(/[$,]/g, ''));
        if (!citySales[cityName]) {
            citySales[cityName] = 0;
        }
        citySales[cityName] += sales;
    });

    const topCities = Object.keys(citySales)
        .map(city => ({ city, sales: citySales[city] }))
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

    return {
        labels: topCities.map(item => item.city),
        datasets: [{
            label: 'Sales',
            backgroundColor: 'rgb(124, 191, 125)',
            data: topCities.map(item => item.sales),
            borderWidth: 1
        }]
    };
}

// penggunaan
const doughnut1ctx = document.getElementById('doughnut1').getContext('2d');
const lineCtx = document.getElementById('lineChart').getContext('2d');
const quantityChartCtx = document.getElementById('quantityChart').getContext('2d');
const bestSellerChartCtx = document.getElementById('bestSellerChart').getContext('2d');
const bestProfitChartCtx = document.getElementById('bestProfitChart').getContext('2d');
const customerRegionChartCtx = document.getElementById('customerRegionChart').getContext('2d');
const bestSellerCityChartCtx = document.getElementById('bestSellerCityChart').getContext('2d');

fetchData('./Superstore.json', data => {
    // Inisialisasi doughnut chart
    initializeChart(doughnut1ctx, 'doughnut1', data);

    // Inisialisasi line chart
    const lineData = processLineData(data);
    new Chart(lineCtx, {
        type: 'line',
        data: lineData,
        options: {
            responsive: true,
            maintainAspectRatio: true,
            title: {
                display: true,
                text: 'Total Profit (year)'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) { return 'Rp ' + value.toLocaleString(); }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return 'Rp ' + tooltipItem.yLabel.toLocaleString();
                    }
                }
            }
        }
    });

    // Inisialisasi bar chart
    const barData = processBarData(data);
    new Chart(quantityChartCtx, {
        type: 'bar',
        data: barData,
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Inisialisasi best seller chart
    const bestSellerData = processBestSellerData(data);
    new Chart(bestSellerChartCtx, {
        type: 'bar',
        data: bestSellerData,
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Inisialisasi best profit chart berdasarkan City
    const bestProfitData = processBestProfitData(data);
    new Chart(bestProfitChartCtx, {
        type: 'bar',
        data: bestProfitData,
        options: {
            indexAxis: 'y',
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

      // Inisialisasi customer region chart
      const customerRegionData = processCustomerRegionData(data);
      new Chart(customerRegionChartCtx, {
          type: 'bar',
          data: customerRegionData,
          options: {
              title: {
                  display: true,
                  text: 'Total Customer by Region'
              },
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
      const bestSellerCityData = processBestSellerCityData(data);
      new Chart(bestSellerCityChartCtx, {
          type: 'bar',
          data: bestSellerCityData,
          options: {
              indexAxis: 'y',
              scales: {
                  y: {
                      beginAtZero: true,
                      ticks: {
                          callback: function(value) {
                              return '$' + value.toFixed(2);
                          }
                      }
                  }
              },
              plugins: {
                  tooltip: {
                      callbacks: {
                          label: function(tooltipItem) {
                              return '$' + tooltipItem.raw.toFixed(2);
                          }
                      }
                  }
              }
          }
      });
});

// TAMBAHAN  
const topProfitableCityChartCtx = document.getElementById('topProfitableCityChart').getContext('2d');
const topProfitableCityChart = new Chart(topProfitableCityChartCtx, {
    type: 'bar',
    data: {
        labels: ['New York City', 'Los Angeles', 'Seattle San', 'San Fransisco', 'Columbus'],
        datasets: [
            {
                label: 'Profit',
                backgroundColor: 'rgb(124, 191, 125)',
                data: [652.43, 395.42, 354.43, 274.26, 111.73],
                borderWidth: 1
            }
        ]
    },
    options: {
        indexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value, index, values) {
                        return '$' + value.toFixed(2);
                    }
                }
            }
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return '$' + tooltipItem.raw.toFixed(2);
                    }
                }
            }
        }
    }
});

const doughnut2ctx = document.getElementById('doughnut2').getContext('2d');
const doughnut2chart = new Chart(doughnut2ctx, {
  type: 'doughnut',
  data: {
	labels: ['Consumer', 'Corporate', 'Home Office'],
	datasets: [{
	  label: 'Distribusi Order by Segment',
	  data: [2.586, 1.514, 909],
	  borderWidth: 1,
	  backgroundColor: [
      'rgb(124, 191, 125)',
      'rgb(34, 110, 30)',
      'rgb(34, 34, 34)'
    ],
	}],
  },
  options: {
	scales: {
	  y: {
		beginAtZero: true
	  }
	}
  }
});

const salesbySegmentChartCtx = document.getElementById('salesbySegmentChart').getContext('2d');
const salesbySegmentChart = new Chart(salesbySegmentChartCtx, {
    type: 'bar',
    data: {
        labels: ['Consumer', 'Corporate', 'Home Office'],
        datasets: [
			{
				label: 'Sales',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [546.712, 302.178, 179.106],
				borderWidth: 1
			  }]
    },
    options: {
		indexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const profitbySegmentChartCtx = document.getElementById('profitbySegmentChart').getContext('2d');
const profitbySegmentChart = new Chart(profitbySegmentChartCtx, {
    type: 'bar',
    data: {
        labels: ['Consumer', 'Corporate', 'Home Office'],
        datasets: [
			{
				label: 'Profit',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [2.236 , 1.358, 842.935],
				borderWidth: 1
			  }]
    },
    options: {
		indexAxis: 'y',
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});



// Sampai sini js CHART 