
//A D3 function get population data from json file
d3.json("pop.json",function(json){

   drawTable(json);
   plotChat(json);
});

//function to construct the data table
function drawTable(datum){

  var dataPanel  =  document.getElementById("dataPanel");
  var tablePanel = createHtmlElement("div","tablePanel");
  var theader1 = createHtmlElement("div","theader1");
  theader1.innerHTML = "Year";
  tablePanel.appendChild(theader1);
  var theader2 = createHtmlElement("div","theader2");
  theader2.innerHTML = "Population";
  tablePanel.appendChild(theader2);
  var data = datum["value"];

  for(var yr = 0; yr < data.length; yr++){
    var theader1 = createHtmlElement("div","tcolumn1");
    theader1.innerHTML = data[yr]["year"];
    tablePanel.appendChild(theader1);
    var theader2 = createHtmlElement("div","tcolumn2");
    theader2.innerHTML = data[yr]["population"];
    tablePanel.appendChild(theader2);
  }
  dataPanel.appendChild(tablePanel);
  var chartType = createHtmlElement("div","chartTypePanel");
  dataPanel.appendChild(chartType);
  var typeCol = createHtmlElement("div","typeCol");
  typeCol.innerHTML = "Type:"
  chartType.appendChild(typeCol);
  var chartTypes = createHtmlElement("select","chartTypes");
  var charts = ["Vertical Bar Chart"];
  for(var idx = 0; idx < charts.length; idx++){
    var chartOption= createHtmlElement("option","chartOption");
    chartOption.innerHTML = charts[idx];
    chartTypes.appendChild(chartOption);
  }
  chartType.appendChild(chartTypes)
}

//function to create html elements
function createHtmlElement(tagName,idClass){

  var elem = document.createElement(tagName);
  elem.id=idClass;elem.className=idClass;
  return elem;
}

//function to plot chart
function plotChat(datum){

 var data = datum["value"];
 var w =700,h=400;
 var margin = {top: 20, right:10, bottom: 50, left:100};

//create svg for chart
chart = d3.select( '#chartPanel' ).append( 'svg' )
    .attr( 'class', 'chart' )
    .attr( 'width', w + margin.left + margin.right)
    .attr( 'height', h+ margin.top + margin.bottom )
    .append('g')
    .attr("transform", "translate(100 ," + margin.top + ")");;

 //create scale for x axis
 x = d3.scale.ordinal()
     .domain(data.map(function(d) { return d.year; }))
     .rangeRoundBands( [0, w ],.2 );

//linear scale for y axis
 y = d3.scale.linear()
     .domain( [0, d3.max( data, function( d ) { return d.population; } )] )
     .rangeRound( [h,0] );

 // drawing x Axis with ticks
 xAxis = d3.svg.axis()
     .scale(x)
     .ticks(20)
     .orient("bottom");

 // appending x axis to chart
 chart.append('g')
     .attr('class', 'x axis')
     .attr('transform', 'translate(0, ' + (h) + ')')
     .call(xAxis);

// drawing y axis with horizantal ticks
 yAxis = d3.svg.axis()
     .scale(y)
     .ticks(10)
     .tickSize(-w,0,0)
     .orient('left');

 //appending y axis to chart
 chart.append('g')
     .attr('class', 'y axis')
     .attr('transform', 'translate(0,' + y.range()[1] + ')')
     .call(yAxis);

  //creating x axis title
  chart.append("text")
      .attr("x", w / 2 )
      .attr("y",  y(0) + 40 )
      .attr("class","axisLabel")
      .style("text-anchor", "middle")
      .text("Year");

  //Create Y axis label
	chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0-margin.left)
      .attr("x",0 - (h / 2))
      .attr("dy", "1em")
      .attr("class","axisLabel")
      .style("text-anchor", "middle")
      .text("Population");

 // create bar group
 bars = chart.append('g')
     .attr('class', 'rectBars');

 //create rectangular bars
 bars.selectAll( 'rect' )
     .data( data )
     .enter().append( 'rect' )
     .attr( 'x', function( d, i ) { return x( d.year ); } )
     .attr('y', 0)
     .attr('height', 0)
     .attr('width',x.rangeBand())
     .transition()
     .delay(function(d, i) { return i * 100; })
     .duration(300)
     .attr( 'y', function( d ) { return y( d.population ) } )
     .attr( 'height', function( d ) { return (h) - y( d.population ) + .5 } )
     .attr('class', 'rectBars');
}
