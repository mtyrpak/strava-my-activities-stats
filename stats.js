var loadData = function (page, gearId, activityType) {
    var data = [];
    loadPage(1, gearId, data, activityType);
    return data;
};
var loadPage = function (page, gearId, data, activityType) {
    //console.log('Loading page ' + page + ' for gear ' + gearId + ' ...');
    jQuery.ajax({
        type: "get",
        url: "training_activities?keywords=&activity_type=" + activityType + "&workout_type=&commute=&private_activities=&trainer=&gear=" + gearId + "&new_activity_only=false&order=start_date_local+DESC&page=" + page,
        success: function (resp) {
            for (var id in resp.models) {
                data.push(resp.models[id]);
            }
            if (resp.total > data.length) {
                loadPage(page + 1, gearId, data, activityType);
            }
        },
        async: false
    })
};

var addYearTotals = function (activity, totalsByYear, countByYear, timeByYear) {
    var year = activity.start_time.substring(0, 4);
    if (totalsByYear[year] === undefined) {
        totalsByYear[year] = 0;
        countByYear[year] = 0;
        timeByYear[year] = 0;
    }
    totalsByYear[year] += parseFloat(activity.distance);
    countByYear[year] += 1;
    timeByYear[year] += activity.elapsed_time_raw;
}

var calculate = function (gearId, gearName, activityType) {
    var data = loadData(1, gearId, activityType);
    var totalsByYear = {};
    var countByYear = {};
    var timeByYear = {};
    var totalDistance = 0;
    var totalCount = 0;
    var totalTime = 0;
    data.forEach(function (activity) {
        addYearTotals(activity, totalsByYear, countByYear, timeByYear);
    });
    for (var year in totalsByYear) {
        console.log("Year: " + year + " => " + totalsByYear[year].toFixed(2) + " kms" + ",  " + countByYear[year] + " activities, " + (timeByYear[year] / 3600) + " hours");
        totalDistance += totalsByYear[year];
        totalCount += countByYear[year];
        totalTime += timeByYear[year];

    }

    console.log("Total distance for " + activityType + " for gear " + gearName + " => " + totalDistance.toFixed(2) + " kms");
    return totalsByYear;
};

var printStats = function () {
    var options = jQuery("#gear_bike option");
    options.each(function (id) {
        var option = options[id];
        if (option.value != "") {
            console.log('Calculating stats for bike ' + option.text);
            calculate(option.value, option.text, "Ride");
        }
    });

    var options = jQuery("#gear_shoe option");
    options.each(function (id) {
        var option = options[id];
        if (option.value != "") {
            console.log('Calculating stats for shoes ' + option.text);
            calculate(option.value, option.text, "Run");
        }
    });

    options.each(function (id) {
        var option = options[id];
        if (option.value != "") {
            console.log('Calculating stats for shoes ' + option.text);
            calculate(option.value, option.text, "Hike");
        }
    });

    calculate("", "", "Ride");
    calculate("", "", "Run");
    calculate("", "", "Hike");
};

printStats();
