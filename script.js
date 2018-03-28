document.getElementById("remove").onclick = function() {
	var select = document.getElementById("selectNumber");
	console.log("Attempt parse.");
	
	
	var teamSelected = parseInt(select.options[select.selectedIndex].text);
	var csvfile = "picklist.csv";
	
	select.value = "";

	var optLen = $('#selectNumber option').size();
	
	//body > svg > g:nth-child(1) > g:nth-child(2) > g:nth-child(3)
	
	for (var i = 2; i < (optLen+1); i++) {
		var tickSelector = "";
		var fullTick = "";
		
		console.log(tickText);
		console.log(teamSelected);
		
		tickSelector = tickSelector.concat("body > svg > g:nth-child(1) > g:nth-child(2) > g:nth-child(",i.toString(),") > text");
		var tickText = $(tickSelector).text();
		
		if (tickText == teamSelected) {
			var iStr = i.toString();
			
			var i2 = i - 1;
			var i2Str = i2.toString();
			
			fullTick = fullTick.concat("body > svg > g:nth-child(1) > g:nth-child(2) > g:nth-child(",i.toString(),")");
			$(fullTick).remove();
			$('#selectNumber :selected').remove(); 
			
			for (var j = 1; j < 23; j++) {
				var string = "";
				
				var jStr = j.toString();
				string = string.concat("body > svg > g:nth-child(1) > g:nth-child(1) > g:nth-child(", jStr, ") > rect:nth-child(", i2Str, ")");
				console.log(string);
				$(string).remove();
				//$( "body > svg > g:nth-child(1) > g:nth-child(1) > g:nth-child(" + toString(j) + ") > rect:nth-child(1)" ).remove();
			}
			
			//1 body > svg > g:nth-child(1) > g:nth-child(2) > g:nth-child(2)
			//2 body > svg > g:nth-child(1) > g:nth-child(2) > g:nth-child(3)
			
			$("option[value=" +teamSelected+ "]").remove();
			
		}
	}
	return false;
}


function plotArray(data, keys) {
	var svg = d3.select("svg"),
		margin = {top: 20, right: 20, bottom: 30, left: 40},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var x = d3.scaleBand()
		.rangeRound([0, width])
		.paddingInner(0.05)
		.align(0.1);

	var y = d3.scaleLinear()
		.rangeRound([height, 0]);


	var z = d3.scaleOrdinal()
		.range(["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"]);

    data.sort(function(a, b) { return b.total - a.total; });
    x.domain(data.map(function(d) { return d['Team #']; }));
    y.domain([0, d3.max(data, function(d) { return d.total; })]).nice();
        //Change to: y.domain([d3.min(data, function(d) { return d.total; }), d3.max(data, function(d) { return d.total; })]).nice();
            // Doesn't change the actual axes themselves
    z.domain(keys);
	
	
	var select = document.getElementById("selectNumber");
	
	var len = data.length;
	
	var opt;
	var el;
	

	for(var i = 0; i < len; i++) {
		opt = data[i]['Team #'];
		el = document.createElement("option");
		el.textContent = opt;
		el.value = opt;
		select.appendChild(el);
		
		//body > svg > g:nth-child(1) > g:nth-child(1) > g:nth-child(2) > rect:nth-child(1)
		
		
		
		
		
	}
	
	 g.append("g")
    .selectAll("g")
	
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return z(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data["Team #"]); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      //console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d[1]-d[0]);
    });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Sum of Values");

var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
    
legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .style("fill", z)
      .attr("id", function (d, i) {
        return "id" + d.replace(/\s/g, '');
      })
      .on("mouseover",function(){        

        if (active_link === "0") d3.select(this).style("cursor", "pointer");
        else {
          if (active_link.split("class").pop() === this.id.split("id").pop()) {
            d3.select(this).style("cursor", "pointer");
          } else d3.select(this).style("cursor", "auto");
        }
      })

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
    
var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");
      
    tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 20)
        .attr("fill", "white")
        .style("opacity", 0.5);

    tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        .style("text-anchor", "middle")
        .attr("font-size", "15px")
        .attr("font-weight", "bold");
}
    
     
