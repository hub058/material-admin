
(function($){
	
	//全局属性

    function addCharts(container, data){

    	var prefix = "mapColumnChart" + (new Date()).getTime();

		var opt = $.data(container, "mapColumn").options;

		var map = opt.map;

    	//获得marker数组
    	L.Draw.customData  = L.layerGroup().addTo(opt.map);

        //创建divicon
        for(var i = 0; i < data.length; i++){

        	//饼图宽高
        	if(!data[i].width){
        		data[i].width = 150;
        	}

        	if(!data[i].height){
        		data[i].height = 150;
        	}

            var _icon = L.divIcon({
                html : "<div id='"+ prefix +"_" + i + "'></div>",
                iconAnchor : [data[i].width / 2, data[i].width / 2 + 20]
            });

            var marker = L.marker(data[i].latlng, {icon : _icon});

            L.Draw.customData .addLayer(marker);

            createChart(prefix + "_" + i, data[i]);

            $("#" + prefix + "_" + i).parent().css({
                background: 'rgba(0,0,0,0)',
                border: '0px'                            
            });
        }

        $.data(container, "L.Draw.customData ", L.Draw.customData );
    }

    function clearCharts(container){
    	L.Draw.customData  = $.data(container, "L.Draw.customData ");
    	if(L.Draw.customData ){
			//清空图层
			L.Draw.customData .clearLayers();
			//重置layerGroup
			var opt = $.data(container, "mapColumn").options;
			$.data(container, "L.Draw.customData ", L.layerGroup().addTo(opt.map));    		
    	}	
    }

    function createChart(id, barData){
    	var categories = barData.label;
    	var data = barData.data;
    	
        $('#' + id).css({
            height : barData.height,
            width : barData.width
        });

        //回调函数
        var clickFun = function(){

        };

        if(barData.clickFun){
         	clickFun = barData.clickFun;
        }

        //label字体颜色
        var labelColor = 'red';

        if(barData.labelColor){
        	labelColor = barData.labelColor;
        }

        var chart = $('#' + id).highcharts({
            chart: {
                type: 'column',
                backgroundColor : 'rgba(0,0,0,0)'
            },
            title: {
                text: ' '
            },
            subtitle: {
                text: ' '
            },
            xAxis: {
                categories: categories,
                tickColor : 'rgba(0,0,0,0)',
                labels : {
                    style : {
                        color : labelColor,
                        fontWeight : 'bold',
                        fontSize : '13px'
                    }
                }
            },
            yAxis: {
                title: {
                    text: ' ',
                },
                gridLineWidth : 0,
                labels : {
                    enabled : false
                }
            },
            plotOptions: {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function(){
                            	clickFun(this);
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        color: data.color,
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function() {
                            //return this.y +'%';
                        }
                    },
                    pointPadding : 0,
                    groupPadding : 0
                }
            },
            tooltip: {
                formatter: function() {
                    var point = this.point,
                        s = this.x +':<b>'+ this.y;
                    return s;
                }
            },
            legend : {
                enabled : false
            },
            series: [{
                data: data
            }]
        })
        .highcharts(); 

    }

	$.fn.mapColumn = function(options, param){

		if (typeof options == 'string') {
			return $.fn.mapColumn.methods[options](this, param);
		}

		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'mapColumn');
			var opts;
			if (state) {
				opts = $.extend(state.options, options);
				state.options = opts;
			} else {
				$.data(this, 'mapColumn', {
					options: $.extend({}, $.fn.mapColumn.defaultOptions, options)
				});
			}

		});
	};

	$.fn.mapColumn.methods = {
		options: function(jq){
			return $.data(jq[0], 'mapColumn').options;
		},
		addCharts : function(jq, data){
			clearCharts(jq[0]);
			addCharts(jq[0], data);
		},
		clearCharts : function(jq){
			clearCharts(jq[0]);
		}

	};

	$.fn.mapColumn.defaultOptions = {
		
	};

})(jQuery);
