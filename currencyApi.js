

module.exports.main2 = async function (db, params, callback) {
    let lastDate = await getLastDate(db);

    let lastCurrency = await getLasteCurrency(db, lastDate);

    let baseCurrency = "";

    var keys = Object.keys(lastCurrency);
    keys.forEach(element => {
        if (element == params.currency1.toUpperCase()) {
            baseCurrency = element
        }
    })
    // console.log("baseCurrency", baseCurrency)
    let result = {
        base: baseCurrency,
        versus: params.currency2.toUpperCase(),
        date: lastDate,
        rate: lastCurrency[params.currency2.toUpperCase()]
    }

    if (result.rate == null || result.base == "") {
        callback(null)
    } else { callback(result) }




}
module.exports.main = async function (db, currency, callback) {
    try {

        let lastDate = await getLastDate(db);
        console.log(lastDate)
        let lastCurrency = await getLasteCurrency(db, lastDate);


        let rates = lastCurrency

        let baseCurrency = "";

        var keys = Object.keys(lastCurrency);
        keys.forEach(element => {
            if (element == currency.toUpperCase()) {
                baseCurrency = element
            }
        })

        delete rates._id;
        delete rates.Date;
        delete rates[currency];

        // console.log(rates);

        let result = {
            base: baseCurrency,
            date: lastDate,
            rate: rates
        }

        if (result.base == null || result.base == "") {
            callback(null)
        } else {
            callback(result);
        }


        console.log(result);




    } catch (err) {
        console.log(err)
    }



}


module.exports.getCurrencyByDate = function (db, params, callback) {
    db.collection("currency").findOne({
        Date: params.date
    }, function (err, doc) {
        console.log(doc)
        if (doc == null) {
            callback({ response: "Not data found" })
        } else {
            let result = {
                base: params.currency1,
                versus: params.currency2,
                date: params.date,
                rate: doc[params.currency2.toUpperCase()]
            }
            callback(result)
        }
    })


}

module.exports.getCurrencyByDateRange = function (db, params) {
    return new Promise((resolve, reject) => {

        console.log(JSON.stringify(params))
        let startDate = params.startDate;
        let endDate = params.endDate;
        console.log(startDate)
        console.log(endDate)
        db.collection("currency").find({
            Date: {
                $gte: startDate, $lte: endDate
            }
        }).toArray((err, doc) => {
            // console.log(doc)
            if (err) {
                // console.log(err);
                reject(err)

            } else {
                // console.log(doc)
                let rates = []

                doc.forEach(element => {

                    let obj = {
                    }
                    obj[element.Date] = element[params.currency2]
                    rates.push(obj)
                });
                let result = {
                    base: params.currency1,
                    versus: params.currency2,
                    start: params.startDate,
                    end: params.endDate,
                    rates: rates
                }
                resolve(result)
            }
        })
    })
}

function getLasteCurrency(db, lastDate) {
    return new Promise((resolve, reject) => {
        db.collection("currency").findOne({ Date: lastDate }, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}



function getLastDate(db) {
    return new Promise((resolve, reject) => {
        db.collection("currency").aggregate([{
            $group: {
                _id: "_id",
                lastDate: { $first: "$Date" }
            }
        }]).each(function (err, result) {
            if (err) {
                reject(err);
            }
            if (result) {
                resolve(result.lastDate);
            }
        })
    })
}


module.exports.getLastDate = db => {
    return new Promise((resolve, reject) => {
        db.collection("currency").aggregate([{
            $group: {
                _id: "_id",
                lastDate: { $first: "$Date" }
            }
        }]).each(function (err, result) {
            if (err) {
                reject(err);
            }
            if (result) {
                resolve(result.lastDate);
            }
        })
    })
}

module.exports.getCurrencies = (db, lastDate) => {
    return new Promise((resolve, reject) => {
        db.collection("currency").findOne({ Date: lastDate }, function (err, result) {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}
