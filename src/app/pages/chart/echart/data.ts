import { EChartsOption, number } from 'echarts';

x: number
/**
 * Line Chart
 */
const lineChart: EChartsOption = {
    grid: {
        zlevel: 0,
        borderWidth: 0,
        backgroundColor: "rgba(0,0,0,0)",
        borderColor: "rgba(0,0,0,0)",
    },
    xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisLine: { lineStyle: { color: "#858d98" } },
    },
    yAxis: {
        type: "value",
        axisLine: { lineStyle: { color: "#858d98" } },
        splitLine: { lineStyle: { color: "rgba(133, 141, 152, 0.1)" } },
    },
    series: [{ data: [820, 932, 901, 934, 1290, 1330, 1320], type: "line" }],
    color: ["#2ab57d", "#ccc"],
};

/**
 * Line Bar Chart
 */
const lineBarChart: EChartsOption = {
    grid: {
        zlevel: 0,
        borderWidth: 0,
        backgroundColor: "rgba(0,0,0,0)",
        borderColor: "rgba(0,0,0,0)",
    },
    tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross", crossStyle: { color: "#999" } },
    },
    toolbox: {
        left: 0,
        top: 0,
        feature: {
            dataView: { readOnly: !1, title: "Data View" },
            magicType: {
                type: ["line", "bar"],
                title: { line: "For line chart", bar: "For bar chart" },
            },
            restore: { title: "restore" },
            saveAsImage: { title: "Download Image" },
        },
    },
    color: ["#2ab57d", "#5156be", "#fd625e"],
    legend: {
        data: ["Evaporation", "Precipitation", "Average Temperature"],
        textStyle: { color: "#858d98" },
    },
    xAxis: [
        {
            type: "category",
            data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
            axisPointer: { type: "shadow" },
            axisLine: { lineStyle: { color: "#858d98" } },
        },
    ],
    yAxis: [
        {
            type: "value",
            name: "Water volume",
            min: 0,
            max: 250,
            interval: 50,
            axisLine: { lineStyle: { color: "#858d98" } },
            splitLine: { lineStyle: { color: "rgba(133, 141, 152, 0.1)" } },
            axisLabel: { formatter: "{value} ml" },
        },
        {
            type: "value",
            name: "Temperature",
            min: 0,
            max: 25,
            interval: 5,
            axisLine: { lineStyle: { color: "#858d98" } },
            splitLine: { lineStyle: { color: "rgba(133, 141, 152, 0.1)" } },
            axisLabel: { formatter: "{value} Ã‚Â°C" },
        },
    ],
    series: [
        {
            name: "Evaporation",
            type: "bar",
            data: [2, 4.9, 7, 23.2, 25.6, 76.7, 135.6, 162.2],
        },
        {
            name: "Precipitation",
            type: "bar",
            data: [2.6, 5.9, 9, 26.4, 28.7, 70.7, 175.6, 182.2],
        },
        {
            name: "Average Temperature",
            type: "line",
            yAxisIndex: 1,
            data: [2, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4],
        },
    ],
};

/**
 * donughnut Chart
 */
const donughnutChart: EChartsOption = {
    tooltip: { trigger: "item", formatter: "{a} <br/>{b}: {c} ({d}%)" },
    legend: {
        orient: "vertical",
        left: "left",
        data: ["Laptop", "Tablet", "Mobile", "Others", "Desktop"],
        textStyle: { color: "#858d98" },
    },
    color: ["#5156be", "#ffbf53", "#fd625e", "#4ba6ef", "#2ab57d"],
    series: [
        {
            name: 'Total sales',
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            labelLine: {
                show: false
            },
            data: [
                { value: 335, name: 'Laptop' },
                { value: 310, name: 'Tablet' },
                { value: 234, name: 'Mobile' },
                { value: 135, name: 'Others' },
                { value: 1548, name: 'Desktop' }
            ]
        }
    ]
};

/**
 * Pie Chart
 */
const pieChart: EChartsOption = {
    tooltip: { trigger: "item", formatter: "{a} <br/>{b} : {c} ({d}%)" },
    legend: {
        orient: "vertical",
        left: "left",
        data: ["Laptop", "Tablet", "Mobile", "Others", "Desktop"],
        textStyle: { color: "#858d98" },
    },
    color: ["#fd625e", "#2ab57d", "#4ba6ef", "#ffbf53", "#5156be"],
    series: [
        {
            name: "Total sales",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: [
                { value: 335, name: "Laptop" },
                { value: 310, name: "Tablet" },
                { value: 234, name: "Mobile" },
                { value: 135, name: "Others" },
                { value: 1548, name: "Desktop" },
            ]
        },
    ],
};

/**
 * scatterChart
 */
const scatterChart: EChartsOption = {
    grid: {
        zlevel: 0,
        borderWidth: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
    },
    xAxis: {
        axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        },
        splitLine: {
            lineStyle: {
                color: "rgba(133, 141, 152, 0.1)"
            }
        }
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        },
        splitLine: {
            lineStyle: {
                color: "rgba(133, 141, 152, 0.1)"
            }
        }
    },
    series: [{
        symbolSize: 10,
        data: [
            [10.0, 8.04],
            [8.0, 6.95],
            [13.0, 7.58],
            [9.0, 8.81],
            [11.0, 8.33],
            [14.0, 9.96],
            [6.0, 7.24],
            [4.0, 4.26],
            [12.0, 10.84],
            [7.0, 4.82],
            [5.0, 5.68]
        ],
        type: 'scatter'
    }],
    color: ['#2ab57d'],
    tooltip: {
        trigger: 'axis'
    },
}

/**
 * scatterChart
 */
var data = [
    [[28604, 77, 17096869, 'Australia', 1990], [31163, 77.4, 27662440, 'Canada', 1990], [1516, 68, 1154605773, 'China', 1990], [13670, 74.7, 10582082, 'Cuba', 1990], [28599, 75, 4986705, 'Finland', 1990], [29476, 77.1, 56943299, 'France', 1990], [31476, 75.4, 78958237, 'Germany', 1990], [28666, 78.1, 254830, 'Iceland', 1990], [1777, 57.7, 870601776, 'India', 1990], [29550, 79.1, 122249285, 'Japan', 1990], [2076, 67.9, 20194354, 'North Korea', 1990], [12087, 72, 42972254, 'South Korea', 1990], [24021, 75.4, 3397534, 'New Zealand', 1990], [43296, 76.8, 4240375, 'Norway', 1990], [10088, 70.8, 38195258, 'Poland', 1990], [19349, 69.6, 147568552, 'Russia', 1990], [10670, 67.3, 53994605, 'Turkey', 1990], [26424, 75.7, 57110117, 'United Kingdom', 1990], [37062, 75.4, 252847810, 'United States', 1990]],
    [[44056, 81.8, 23968973, 'Australia', 2015], [43294, 81.7, 35939927, 'Canada', 2015], [13334, 76.9, 1376048943, 'China', 2015], [21291, 78.5, 11389562, 'Cuba', 2015], [38923, 80.8, 5503457, 'Finland', 2015], [37599, 81.9, 64395345, 'France', 2015], [44053, 81.1, 80688545, 'Germany', 2015], [42182, 82.8, 329425, 'Iceland', 2015], [5903, 66.8, 1311050527, 'India', 2015], [36162, 83.5, 126573481, 'Japan', 2015], [1390, 71.4, 25155317, 'North Korea', 2015], [34644, 80.7, 50293439, 'South Korea', 2015], [34186, 80.6, 4528526, 'New Zealand', 2015], [64304, 81.6, 5210967, 'Norway', 2015], [24787, 77.3, 38611794, 'Poland', 2015], [23038, 73.13, 143456918, 'Russia', 2015], [19360, 76.5, 78665830, 'Turkey', 2015], [38225, 81.4, 64715810, 'United Kingdom', 2015], [53354, 79.1, 321773631, 'United States', 2015]]
];
const bubbleChart: EChartsOption = {
    // Setup grid
    grid: {
        zlevel: 0,
        borderWidth: 0,
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
    },
    legend: {
        right: 10,
        data: ['2018', '2019']
    },
    xAxis: {
        axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        },
        splitLine: {
            lineStyle: {
                type: 'dashed',
                color: "rgba(133, 141, 152, 0.1)"
            }
        },
    },
    yAxis: {
        axisLine: {
            lineStyle: {
                color: '#858d98'
            },
        },
        splitLine: {
            lineStyle: {
                type: 'dashed',
                color: "rgba(133, 141, 152, 0.1)"
            }
        },
        scale: true
    },
    series: [{
        name: '2018',
        data: data[0],
        type: 'scatter',
        symbolSize: function (data) {
            return Math.sqrt(data[2]) / 5e2;
        },
        itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(85, 110, 230, 0.5)',
            shadowOffsetY: 5,
            color: '#6e83eb'
        }
    }, {
        name: '2019',
        data: data[1],
        type: 'scatter',
        symbolSize: function (data) {
            return Math.sqrt(data[2]) / 5e2;
        },
        itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(52, 195, 143, 0.5)',
            shadowOffsetY: 5,
            color: '#63dfb0'
        }
    }],
    tooltip: {
        trigger: 'axis'
    }
}

/**
 * Customized Pie Chart
 */
const customizepieChart: EChartsOption = {
    series: [{
        data: [
            { value: 25, name: 'Crome' },
            { value: 10, name: 'IE' }, { value: 15, name: 'Firefox' }, { value: 30, name: 'Safari' }, { value: 10, name: 'Etc' }],
        type: 'pie',
        roseType: 'radius',
    }],
    color: ['#556ee6', '#34c38f', '#f1b44c', '#50a5f1', '#f46a6a'],
    legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Crome', 'IE', 'Firefox', 'Safari', 'Etc'],
        textStyle: { color: '#858d98' }
    },
    tooltip: {
        trigger: 'axis'
    }
}

/**
 * Gauge Chart
 */
const gaugeChart: EChartsOption = {
    tooltip: {
        formatter: "{a} <br/>{b} : {c}%"
    },
    toolbox: {
        feature: {
            restore: { title: "Refresh" },
            saveAsImage: { title: "Download Image" }
        }
    },
    series: [
        {
            name: 'Business indicator',
            type: 'gauge',
            detail: { formatter: '{value}%' },
            axisLine: {
                lineStyle: {
                    color: [[0.2, '#34c38f'], [0.8, '#556ee6'], [1, '#f46a6a']],
                    width: 20
                }
            },
            data: [{ value: 50, name: 'Completion rate' }]
        }
    ]
};

export { lineChart, lineBarChart, donughnutChart, pieChart, scatterChart, bubbleChart, customizepieChart, gaugeChart };
