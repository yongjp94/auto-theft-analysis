var myApp = angular.module('myApp', ['ui.router'])

myApp.config(function($stateProvider) {
    $stateProvider.state('home', {
        url:'',
        templateUrl:'../templates/home.html',
        controller:'homeCtrl'
    })
    
    $stateProvider.state('heatmap', {
        url:'/heatmap',
        templateUrl:'../templates/heatmap.html',
        controller:'heatmapCtrl'
    })
    
    $stateProvider.state('piechart', {
        url:'/piechart',
        templateUrl:'../templates/piechart.html',
        controller:'piechartCtrl'
    })
    
    $stateProvider.state('timemap', {
        url:'/timemap',
        templateUrl:'../templates/timemap.html',
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
    var pie;
    
    $scope.censusNum = 0;
    $scope.colorPalette = ['#2383c1','#0c6197','#4daa4b','#90c469','#daca61','#e4a14b','#e98125','#cb2121'];

    var createLabels = function() {
        var temp = [];
        for (i = 0; i < data.length; i++) {
            temp.push(data[i]['Census Tract']);
        }
        return temp;
    }


    $scope.loadData = function(index) {
        var labels = [];
        var index = 0;
        
        $.getJSON( "../data/census_crime_data.json", function(dat) {
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
            
            for (var i = 0; i < labels.length; i++) {
                $("#menu").append('<li><a>' + labels[i] +'</a></li>');
            }

            pie = new d3pie("pieChart", {
                "header": {
                    "title": {
                        "text": "Distribution of Various Crimes for Different Census Tracts",
                        "fontSize": 24,
                        "font": "open sans"
                    },
                    "subtitle": {
                        "text": 'Census Tract #' + items[index]['value'],
                        "color": "#999999",
                        "fontSize": 18,
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
    $scope.loadData($scope.censusNum);
})

.controller('timemapCtrl', function($scope) {

})













