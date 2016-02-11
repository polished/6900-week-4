d3.timeSeries = function(){

	var w = 800,
		h = 600,
		m = {t:50,r:25,b:50,l:25},
		layout = d3.layout.histogram(),
		chartW = w - m.l - m.r,
		chartH = h - m.t - m.b,
		timeRange = [new Date(), new Date()], //default timeRange
        binSize = d3.time.day,
		scaleX = d3.time.scale().range([0,chartW]).domain(timeRange),
		scaleY = d3.scale.linear().range([chartH,0]).domain([0,25]),
		valueAccessor = function(d){ return d; };
	
	function exports(selection) {
        //recompute internal variables if updated
        var bins = binSize.range(timeRange[0], timeRange[1]);

        layout
            .range(timeRange)
            .bins(bins);

        chartW = w - m.l - m.r;
        chartH = h - m.t - m.b;

        scaleX.range([0, chartW]).domain(timeRange);
        scaleY.range([chartH, 0]).domain([0, 25]);

        //draw(_selection,
        //    layout(_selection.datum(function(){return this.dataset;})));

        //_selection.each(function(d){
        //    console.log(layout(d));
        //});
        //for selection in whatever:
        //    draw(this, "kj")
        //selection.each(draw(this, "a0lekjeosmormin"));
        selection.each(draw)
    }

	function draw(datum){

        //console.log("this ", ,datum, d3.select(this), this);
		var layoutData = layout(datum);

		var lineGenerator = d3.svg.line()
			.x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
			.y(function(d){ return scaleY(d.y)})
			.interpolate('basis');

        var areaGenerator = d3.svg.area()
			.x(function(d){ return scaleX(d.x.getTime() + d.dx/2)})
			.y0(chartH)
			.y1(function(d){ return scaleY(d.y)})
			.interpolate('basis');

        var axisX = d3.svg.axis()
            .orient('bottom')
            .scale(scaleX)
            .ticks(d3.time.year);

        var axisY = d3.svg.axis()
            .orient('left')
            .scale(scaleY);

		var svg = d3.select(this).selectAll('svg')
			.data([datum])
            .enter()
            .append('svg');

        var areaEnter = svg
            .append('g')
            .attr('class','area')
            .attr('transform','translate('+m.l+','+m.t+')')
            .append('path');

        var lineEnter = svg
            .append('g')
            .attr('class','line')
            .attr('transform','translate('+m.l+','+m.t+')')
            .append('path');

        var axisXEnter = svg
            .append('g')
            .attr('class', 'axis axisX')
            .attr('transform','translate('+m.l+','+(m.t+chartH)+')');

        var axisYEnter = svg
            .append('g')
            .attr('class', 'axis axisY')
            .attr('transform','translate('+m.l+','+m.t+')');

        svg.attr('width',w).attr('height',h);

        svg.select('.area')
            .select('path')
            .datum(layoutData)
            .attr('d',areaGenerator);

        svg.select('.line')
			.select('path')
			.datum(layoutData)
			.attr('d',lineGenerator);

        svg.select('.axisX')
            .call(axisX);

        svg.select('.axisY')
            .call(axisY);

	}

	//Getter and setter
	exports.width = function(_v){
		if(!arguments.length) return w;
		w = _v;
		return this;
	};
	exports.height = function(_v){
		if(!arguments.length) return h;
		h = _v;
		return this;
	};
	exports.timeRange = function(_r){
		if(!arguments.length) return timeRange;
		timeRange = _r;
		return this;
	};
	exports.value = function(_v){
		if(!arguments.length) return layout.value();
		valueAccessor = _v;
		layout.value(_v);
		return this;
	};

    exports.binSize = function(_b){
        //@param _b: d3.time.interval
        if(!arguments.length) return binSize;
        binSize = _b;
        return this;
    };

	return exports;
};