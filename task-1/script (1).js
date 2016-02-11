var w = d3.select('.plot').node().clientWidth,
    h = d3.select('.plot').node().clientHeight;

d3.csv("../data/hubway_trips_reduced.csv",parse,dataLoaded);
//var timeSeries1 = d3.timeSeries();

function dataLoaded(err,rows){
    //console.log(rows);
var timeSeries1 = d3.timeSeries()
    .width(w);

    d3.select('.plot')
        .datum(rows)
        .call(timeSeries1)
}


function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

