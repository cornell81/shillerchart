//data loaded - 
// shillerArr is CAPE ratios
// marketPowArr is market
// tBillPowArr is tbills
//


var chart = Highcharts.chart('container', {

	title: {
		text: 'Test of Strategies Based on Shiller CAPE Ratio'
	},

	chart: {
		zoomType: 'x'
	},

	subtitle: {
		text: 'Compare Strategy to Holding the Market'
	},

	xAxis: {
		type: 'datetime'
	},

	yAxis: {
		title: {
			text: 'Path of Wealth'
		}
	},

	plotOptions: {
		series: {
			pointStart: utc[0],
			pointInterval: 24 * 3600 * 1000 * 365 / 12,
			dataLabels: {
				crop: false,
				overflow: 'allow',
				borderRadius: 5,
				backgroundColor: 'rgb(255, 255, 255)',
				borderWidth: 1,
				borderColor: '#AAA',
				enabled: true,
				align: 'right',
				//color: this.series.color,
				x: 60,
				y: 0,
				formatter: function () {
					if (this.point.x == this.series.data[this.series.data.length - 1].x) {
						return '<span style="color: ' + this.color + '">' + this.y + '</span>';
					} else {
						return null;
					}
				}

			}
		}
	},

	legend: {
		layout: 'vertical',
		align: 'right',
		verticalAlign: 'middle'
	},

	//chart data goes here, on click load strategy line
	series: [{
			name: 'Market',
			color: '#7cb5ec',
			data: marketPowArr
	}
	],

	responsive: {
		rules: [{
			condition: {
				maxWidth: 500
			},
			chartOptions: {
				legend: {
					layout: 'horizontal',
					align: 'center',
					verticalAlign: 'bottom'
				}
			}
    }]
	}

});

//code to find low/high strategy path of wealth.

function findPow(low, high, utc) {

	var arrLen = shillerArr.length;

	var lowVal = low
	var highVal = high

	var tBillPow = 1 + tBillArr[0];
	var marketPow = 1 + spArr[0];

	var pow = 1;
	var powArr = [[utc[0], 1]];


	//set position for first value, under high value hold stock
	if (shillerArr[0] <= highVal) {
		holdMarket = true;

		pow = (spArr[0] + 1)
	} else {
		holdMarket = false;

		pow = pow * (tBillArr[0] + 1)
	};


	for (var i = 1; i < arrLen; i++) {


		var val0 = shillerArr[i - 1];
		var val1 = shillerArr[i];

		if (val1 >= highVal && val0 < highVal) {

			holdMarket = false;
		};

		if (val1 <= lowVal && val0 > lowVal) {

			holdMarket = true;
		}

		if (holdMarket) {

			pow = pow * (spArr[i] + 1)
			powArr.push([utc[i], Math.round(pow * 100) / 100]);
		} else {

			pow = pow * (tBillArr[i] + 1);
			powArr.push([utc[i], Math.round(pow * 100) / 100]);
		}


	}

	return powArr

}


/*
//var button = document.getElementById('buttonupdate');


button.addEventListener('click', function () {

	var lowValue = document.getElementById("low").value;
	var highValue = document.getElementById("high").value;



	var strategyDate = findPow(lowValue, highValue, utc);

	if (chart.get("Strategy")) {

		chart.get("Strategy").remove();
	}
	chart.addSeries({
		name: "Strategy",
		id: "Strategy",
		color: '#009933',
		data: strategyDate
	});
});
*/
