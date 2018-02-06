

$(document).ready(function () {
    loadCurrency(function () {

    });
    $("#datepicker1").datepicker({ dateFormat: "yy-mm-dd" });
    $("#datepicker2").datepicker({ dateFormat: "yy-mm-dd" });
})



$("#currency1Select").change(function () {

    $("#number1").val("");
    $("#number2").val("");


});
$("#currency2Select").change(function () {

    $("#number1").val("");
    $("#number2").val("");


});

$("#number1").keyup(function () {


    if (this.value == "") {

        $("#number2").val("");
    } else {
        let currency1 = $("#currency1Select").val()
        console.log("currency1", currency1)
        let currency2 = $("#currency2Select").val()
        console.log("currency2", currency2)
        let converted = currency2 / currency1;

        let number1 = $("#number1").val();
        converted = converted * number1;
        console.log(converted)
        $("#number2").val(converted)
    }

})

$("#number2").keyup(function () {

    if (this.value == "") {

        $("#number1").val("");
    } else {
        let currency1 = $("#currency1Select").val()
        // console.log("currency1", currency1)
        let currency2 = $("#currency2Select").val()
        // console.log("currency2", currency2)
        let converted = currency1 / currency2;

        let number2 = $("#number2").val();
        converted = converted * number2;
        console.log(converted)
        $("#number1").val(converted)
    }

})
function loadCurrency(callback) {
    $.ajax({
        url: '/getCurrencies',
        method: 'GET',
        success: data => {
            // console.log(data)
        },
        error: err => {
            console.log(err)
        }
    }).done(data => {
        console.log(data)
        delete data._id;
        delete data.Date;
        let currenciesArray = Object.keys(data);
        console.log(currenciesArray)
        appendToSelect(currenciesArray, data)
        callback();
    })

}

function appendToSelect(currenciesArray, data) {


    let currency1 = $('#currency1Select').val();
    let currency2 = $('#currency2Select').val();
    currenciesArray.forEach(element => {
        $('#currency1Select').append(`<option label='${element}' value='${data[element]}' >${element}</option>`)
    });

    currenciesArray.forEach(element => {
        $('#currency2Select').append(`<option label='${element}'value='${data[element]}'>${element}</option>`)
    });
}


function loadHistorical(callback) {
    let currency1 = $("#currency1Select option").attr("label")
    let currency2 = $("#currency2Select option").attr("label")
    // console.log(currency1, currency2);

    let startDate = $("#datepicker1").val();
    let endDate = $("#datepicker2").val();

    // console.log("startDate", startDate)
    // console.log("endDate", endDate)

    $.ajax({
        url: '/historical/' + currency1 + '-' + currency2,
        method: 'GET',
        data: {
            startDate: startDate,
            endDate: endDate
        },
        error: err=>{
            console.log(err)
        }
    }).done(function(data){
        console.log("data",data)

        callback(data)
    })


}
function loadChart() {
    loadHistorical(function(data){

        let x = Object.keys(data.rates)
        let y = Object.keys(data.rates).map(key => data.rates[key]);
        console.log("x",x);
        console.log("y",y);


        var ctx = document.getElementById("myChart");
        var myChart = new Chart(ctx, {
            responsive: true,
            // maintainAspectRatio: true,
            type: 'line',
            data: {
                labels: x,
                datasets: [{
                    label: 'Exchange Rates',
                    data: y,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    })
}

