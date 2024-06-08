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
          if (item.Outlier === 'Outlier Bawah') OutlierCount['Royal Buyer']++;
          if (item.Outlier  === 'Outlier Atas') OutlierCount['Diskon Hunter']++;
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
        maintainAspectRatio: false,
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
    const quarters = ['K1,2014', 'K2, 2014', 'K3, 2014', 'K4, 2014', 'K1, 2015', 'K2, 2015', 'K3, 2015', 'K4, 2015', 'K1, 2016', 'K2, 2016', 'K3, 2016', 'K4, 2016', 'K1, 2017', 'K2, 2017', 'K3, 2017', 'K4, 2017'];
    const salesData = {
        'Royal Buyer': new Array(quarters.length).fill(0),
        'Buyer': new Array(quarters.length).fill(0),
        'Diskon Hunter': new Array(quarters.length).fill(0)
    };

    data.forEach(item => {
        const orderDate = new Date(item['Order Date']);
        const quarter = `K${Math.floor(orderDate.getMonth() / 3) + 1}, ${orderDate.getFullYear()}`;
        const quarterIndex = quarters.indexOf(quarter);
        const sales = parseFloat(item.Sales.replace(/[$,]/g, ''));
        
        if (quarterIndex !== -1) {
            if (item.Outlier === 'Outlier Bawah') salesData['Royal Buyer'][quarterIndex] += sales;
            if (item.Outlier === 'Outlier Atas') salesData['Diskon Hunter'][quarterIndex] += sales;
            if (item.Outlier === 'Bukan Outlier') salesData['Buyer'][quarterIndex] += sales;
        }
    });

    return {
        labels: quarters,
        datasets: [
            {
                label: 'Royal Buyer',
                backgroundColor: 'rgb(34, 110, 30)',
                borderColor: 'rgb(34, 110, 30, 1)',
                data: salesData['Royal Buyer']
            },
            {
                label: 'Buyer',
                backgroundColor: 'rgb(124, 191, 125)',
                borderColor: 'rgb(124, 191, 125)',
                data: salesData['Buyer']
            },
            {
                label: 'Diskon Hunter',
                backgroundColor: 'rgb(34, 34, 34)',
                borderColor: 'rgb(34, 34, 34, 1)',
                data: salesData['Diskon Hunter']
            }
        ]
    };
}

// penggunaan
const doughnut1ctx = document.getElementById('doughnut1').getContext('2d');
const lineCtx = document.getElementById('lineChart').getContext('2d');
fetchData('./Superstore.json', data => {
    initializeChart(doughnut1ctx, 'doughnut1', data);

    // Inisialisasi line chart
    const lineData = processLineData(data);
    new Chart(lineCtx, {
        type: 'line',
        data: lineData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
});

const quantityChartCtx = document.getElementById('quantityChart').getContext('2d');
const quantityChart = new Chart(quantityChartCtx, {
    type: 'bar',
    data: {
        labels: ['Office Supplies', 'Furniture', 'Technology'],
        datasets: [
			{label: 'Buyer',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [15431, 4200, 4896]
			},
			{
				label: 'Discount Hunter',
				backgroundColor: 'rgba(34, 110, 30)',
				data: [4391, 2872, 1060]
			},
            {
				label: 'Royal Buyer',
				backgroundColor: 'rgb(34, 34, 34)',
				data: [3084, 954, 983]
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

const bestSellerChartCtx = document.getElementById('bestSellerChart').getContext('2d');
const bestSellerChart = new Chart(bestSellerChartCtx, {
    type: 'bar',
    data: {
        labels: ['Bookcase', 'Chairs', 'Phones', 'Table', 'Binders'],
        datasets: [
			{
				label: 'Sales',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [199349619.64, 168189548.99, 144787328.64, 128666146.75, 97257981.27],
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

const bestProfitChartCtx = document.getElementById('bestProfitChart').getContext('2d');
const bestProfitChart = new Chart(bestProfitChartCtx, {
    type: 'bar',
    data: {
        labels: ['Paper', 'Binders', 'Phones', 'Storage', 'Furnishings'],
        datasets: [
			{
				label: 'Profit',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [738495793.87, 489329791.65, 442118609.11, 433206872.84, 428677331.12],
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

const customerRegionChartCtx = document.getElementById('customerRegionChart').getContext('2d');
const customerRegionChart = new Chart(customerRegionChartCtx, {
    type: 'bar',
    data: {
        labels: ['West', 'East', 'Central', 'South'],
        datasets: [
			{label: 'Buyer',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [646, 605, 499, 450]
			},
			{
				label: 'Discount Hunter',
				backgroundColor: 'rgba(34, 34, 34)',
				data: [299, 369, 396, 213]
			},
            {
				label: 'Royal Buyer',
				backgroundColor: 'rgb(34, 110, 30)',
				data: [297, 296, 218, 168]
			}]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const bestSellerCityChartCtx = document.getElementById('bestSellerCityChart').getContext('2d');
const bestSellerCityChart = new Chart(bestSellerCityChartCtx, {
    type: 'bar',
    data: {
        labels: ['Houston', 'New York City', 'Los Angeles', 'Philadelphia', 'San Fransisco'],
        datasets: [
			{
				label: 'Sales',
				backgroundColor: 'rgb(124, 191, 125)',
				data: [106914599.61, 96552755.52, 91905956.66, 78342678.68, 51660083.64],
				borderWidth: 1
			  }]
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