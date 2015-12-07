var items = [];
var data = [];
var pie;
var censusNum = 0;
var labels = [];
document.getElementById('prev').disabled = true;

$('span').text(censusNum);

var buttonCtrl = function() {
    if (censusNum <= 0) {
        document.getElementById('prev').disabled = true;
    } else if (censusNum >= data.length - 1) {
        document.getElementById('next').disabled = true;
    } else {
        document.getElementById('prev').enabled = true;
        document.getElementById('next').enabled = true;
    }
}

var createLabels = function() {
    for (i = 0; i < data.length; i++) {
        labels.push({
            name : data[i]['Census Tract']
        });
    }
}

var nextCensus = function(){
    censusNum = censusNum + 1;
    pie.destroy();
    loadData();
    buttonCtrl();
}

var prevCensus = function(){
    censusNum = censusNum - 1;
    pie.destroy();
    loadData();
    buttonCtrl();
}

var loadData = function(items) {
    $.getJSON( "../data/census_crime_data.json", function(dat) {
        items = [];
        data = dat;
        $.each(dat[censusNum], function(key, val) {
            var item = {
                "label" : key,
                "value" : val,
                "color" : "#2383c1"
            }
            items.push(item);
        });
        
        
        createLabels();
        console.log(labels);
        
      pie = new d3pie("pieChart", {
            "header": {
                "title": {
                    "text": "Distribution of Various Crimes for Different Census Tracts",
                    "fontSize": 24,
                    "font": "open sans"
                },
                "subtitle": {
                    "text": 'Census Tract #' + items[0]['value'],
                    "color": "#999999",
                    "fontSize": 12,
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
                "canvasHeight": 600,
                "canvasWidth": 850,
                "pieInnerRadius": "43%",
                "pieOuterRadius": "94%"
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
                    "fontSize": 11
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
                    "speed": 400,
                    "size": 15
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
    });
};

loadData();



