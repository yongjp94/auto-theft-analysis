var myApp = angular.module('myApp', ['ui.router'])

myApp.config(function($stateProvider) {
    $stateProvider.state('home', {
        url:'',
        templateUrl:'./templates/home.html',
        controller:'homeCtrl'
    })
    
    $stateProvider.state('heatmap', {
        url:'/heatmap',
        templateUrl:'./templates/heatmap.html',
        controller:'heatmapCtrl'
    })
    
    $stateProvider.state('piechart', {
        url:'/piechart',
        templateUrl:'./templates/piechart.html',
        controller:'piechartCtrl'
    })
    
    $stateProvider.state('timemap', {
        url:'/timemap',
        templateUrl:'./templates/timemap.html',
        controller:'timemapCtrl'
    })
})

.controller('homeCtrl', function($scope) {
    
})

.controller('heatmapCtrl', function($scope) {
    mapboxgl.accessToken = 'pk.eyJ1IjoieW9uZ2pwOTQiLCJhIjoiY2lmcWR2cHpvNno4cnN2a3FuZjFrYzA5dCJ9.wVly-DgwpWnJdlsE5L92wQ';
    var data;
    var map;
    var drawMap = function() {
        map = new mapboxgl.Map({
            container: 'map',
            center: [-122.392, 47.617],
            zoom: 11,
            style: 'mapbox://styles/yongjp94/cih55lmhq000ba0m3rss2fxof',
            hash: true
        });
    }
    drawMap();
})
            
.controller('piechartCtrl', function($scope) {
    var items = [];
    var data = [];
    var labels = [];
    var pie;
    var index = 0;
    
    $scope.censusNum = 0;
    $scope.colorPalette = ['#2383c1','#0c6197','#4daa4b','#90c469','#daca61','#e4a14b','#e98125','#cb2121'];

    var createLabels = function() {
        var temp = [];
        for (i = 0; i < data.length; i++) {
            temp.push(data[i]['Census Tract']);
        }
        return temp;
    }
    



    $scope.loadData = function(i) {
        var index = i;
        
        $.getJSON( "data/census_crime_data.json", function(dat) {
            items = [];
            data = dat;
            var i = -1;
            $.each(dat[index], function(key, val) {
                var item = {
                    "label" : key,
                    "value" : val,
                    "color" : $scope.colorPalette[i++]
                }
                items.push(item);
            });


            labels = createLabels();

            pie = new d3pie("pieChart", {
                "header": {
                    "title": {
                        "text": "Distribution of Various Crimes for Different Census Tracts",
                        "fontSize": 30,
                        "font": "open sans"
                    },
                    "subtitle": {
                        "text": 'Census Tract #' + items[0]['value'],
                        "color": "#999999",
                        "fontSize": 20,
                        "font": "open sans"
                    },
                    "titleSubtitlePadding": 9
                },
                "footer": {
                    "text": "source: data.seattle.gov",
                    "color": "#999999",
                    "fontSize": 10,
                    "font": "open sans",
                    "location": "bottom-left"
                },
                "size": {
                    "canvasHeight": 700,
                    "canvasWidth": 850,
                    "pieInnerRadius": "23%",
                    "pieOuterRadius": "84%"
                },
                "data": {
                    "sortOrder": "value-desc",
                    "smallSegmentGrouping": {
                        "enabled": true,
                        "value": 2
                    },
                    "content": items.slice(1)
                },
                "labels": {
                    "outer": {
                        "format": "label-value2",
                        "pieDistance": 32
                    },
                    "mainLabel": {
                        "color": "#313131",
                        "font": "exo",
                        "fontSize": 14
                    },
                    "percentage": {
                        "color": "#ffffff",
                        "font": "open sans",
                        "decimalPlaces": 1
                    },
                    "value": {
                        "color": "#8d8d8d",
                        "font": "open sans",
                        "fontSize": 11
                    },
                    "lines": {
                        "enabled": true
                    },
                    "truncation": {
                        "enabled": true
                    }
                },
                "effects": {
                    "load": {
                        "speed": 800
                    },
                    "pullOutSegmentOnClick": {
                        "speed": 500,
                        "size": 20
                    }
                },
                "misc": {
                    "gradient": {
                        "enabled": true,
                        "percentage": 100
                    }
                },
                "callbacks": {
                    "onMouseoverSegment": null,
                    "onMouseoutSegment": null,
                    "onClickSegment": null
                }
            });  
            
        }); // end of using data
    };
    $scope.loadData(index);
    $('#next').click(function() {
        if (index < 22) {
            index++;
            pie.destroy();
            $scope.loadData(index);
        }
    });
    
    $('#prev').click(function() {
        if (index > 0) {
            index--;
            pie.destroy();
            $scope.loadData(index);
        }
    });
})

.controller('timemapCtrl', function($scope) {
  var margin = { top: 50, right: 0, bottom: 100, left: 30 },
	  width = 960 - margin.left - margin.right,
	  height = 430 - margin.top - margin.bottom,
	  gridSize = Math.floor(width / 24),
	  legendElementWidth = gridSize*2,
	  buckets = 9,
	  colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], // alternatively colorbrewer.YlGnBu[9]
	  days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
	  times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
	  datasets = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

  var svg = d3.select("#chart").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var dayLabels = svg.selectAll(".dayLabel")
	  .data(days)
	  .enter().append("text")
		.text(function (d) { return d; })
		.attr("x", 0)
		.attr("y", function (d, i) { return i * gridSize; })
		.style("text-anchor", "end")
		.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
		.attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

  var timeLabels = svg.selectAll(".timeLabel")
	  .data(times)
	  .enter().append("text")
		.text(function(d) { return d; })
		.attr("x", function(d, i) { return i * gridSize; })
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + gridSize / 2 + ", -6)")
		.attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

  var heatmapChart = function(tsvFile) {
	d3.tsv(tsvFile,
	function(d) {
	  return {
		day: +d.day,
		hour: +d.hour,
		value: +d.value
	  };
	},
	function(error, data) {
	  var colorScale = d3.scale.quantile()
		  .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
		  .range(colors);

	  var cards = svg.selectAll(".hour")
		  .data(data, function(d) {return d.day+':'+d.hour;});

	  cards.append("title");

	  cards.enter().append("rect")
		  .attr("x", function(d) { return (d.hour - 1) * gridSize; })
		  .attr("y", function(d) { return (d.day - 1) * gridSize; })
		  .attr("rx", 4)
		  .attr("ry", 4)
		  .attr("class", "hour bordered")
		  .attr("width", gridSize)
		  .attr("height", gridSize)
		  .style("fill", colors[0]);

	  cards.transition().duration(1000)
		  .style("fill", function(d) { return colorScale(d.value); });

	  cards.select("title").text(function(d) { return d.value; });
	  
	  cards.exit().remove();

	  var legend = svg.selectAll(".legend")
		  .data([0].concat(colorScale.quantiles()), function(d) { return d; });

	  legend.enter().append("g")
		  .attr("class", "legend");

	  legend.append("rect")
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", height)
		.attr("width", legendElementWidth)
		.attr("height", gridSize / 2)
		.style("fill", function(d, i) { return colors[i]; });

	  legend.append("text")
		.attr("class", "mono")
		.text(function(d) { return "≥ " + Math.round(d); })
		.attr("x", function(d, i) { return legendElementWidth * i; })
		.attr("y", height + gridSize);
		
	  legend.exit().remove();
	
	});  
  };
	$scope.current = "january.tsv"
  heatmapChart("./data/january.tsv");
  
  var datasetpicker = d3.select("#dataset-picker").selectAll(".btn btn-primary")
	.data(datasets);
  datasetpicker.enter()
	.append("input")
	.attr("value", function(d){ return d })
	.attr("type", "button")
	.attr("class", "btn btn-primary")
	.on("click", function(d) {
		current = "./data/" + d + ".tsv";
		console.log(current);
	  heatmapChart(current);
	});
})

