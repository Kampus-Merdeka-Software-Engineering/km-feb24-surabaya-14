const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})

// Ditambah Dari sini

const doughnut1ctx = document.getElementById('doughnut1').getContext('2d');
const doughnut1chart = new Chart(doughnut1ctx, {
  type: 'doughnut',
  data: {
	labels: ['Buyer', 'Discount Hunter', 'Royal Buyer'],
	datasets: [{
	  label: 'Total Customers by Type Customers',
	  data: [788, 695, 609],
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


const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
        labels: ['K1,2014', 'K2, 2014', 'K3, 2014', 'K4, 2014', 'K1, 2015', 'K2, 2015', 'K3, 2015', 'K4, 2015', 'K1, 2016', 'K2, 2016', 'K3, 2016', 'K4, 2016', 'K1, 2017', 'K2, 2017', 'K3, 2017', 'K4, 2017'],
        datasets: [{
            label: 'Royal Buyer',
            backgroundColor: 'rgb(34, 110, 30)',
            borderColor: 'rgb(34, 110, 30, 1)',
            data: [81988989, 80083122, 86601961, 73532886, 59845573, 53687387, 56905252, 37562782, 115512690, 127033339, 81220828, 100739376, 173770316, 76615459, 117363898, 95512161]
        },
		{label: 'Buyer',
            backgroundColor: 'rgb(124, 191, 125)',
            borderColor: 'rgb(124, 191, 125)',
            data: [42146534.29, 38960471.66, 43434069.03, 45398879.46, 37701435.21, 35439018.55, 43338250.74, 48893304.37, 54569253.6, 50006688.33, 47182921.75, 53851244.23, 76299477.29, 49672335.69, 65381652.7, 56555675.31]
		},
		{
			label: 'Diskon',
            backgroundColor: 'rgb(34, 34, 34)',
            borderColor: 'rgb(34, 34, 34, 1)',
            data: [-18816289.62, -11819324.96, -26809504.66, -30759837, -16196171.28, -13311986.47, -32941454.38, -13517143.02, -35345382.36, -19192834.75, -30616512.01, -21702652.05, -44887770.79, -58537857.09, -61042935, -20548990.24]
		}
	]
    },
    options: {}
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
                beginAtZero: true
            }
        }
    }
});
// Sampai sini

const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('navbar');

    burger.addEventListener('click', () => {
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');
    });
})

