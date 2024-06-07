$(document).ready(function() {
    console.log('test');
    $.getJSON('./Superstore.json', function(Superstore) {
        $('#dataTable2').DataTable({
            data: Superstore,
            columns: [
                { data: 'Order_ID' },
                { data: 'Order_Date' },
                { data: 'Ship_Date' },
                { data: 'Ship_Mode' },
                { data: 'Customer_ID' },
                { data: 'Customer_Name' },
                { data: 'Product_ID' },
                { data: 'Category' },
                { data: 'Product_Name' },
                { data: 'Sales' },
                { data: 'Quantity' },
                { data: 'Discount' },
                { data: 'Profit' },
                { data: 'Outlier'}
            ],
            pageLength: 10,
            dom: 'Bfrtip',
            buttons: [
                'csv', 'excel', 'pdf', 'print'
            ],
            autoWidth: false, /* Memastikan lebar kolom tidak diatur otomatis */
            responsive: true /* Membuat tabel responsif */
        });
    });
});