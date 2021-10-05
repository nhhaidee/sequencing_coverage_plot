function renderGeneFeatures(params, api) {
  var categoryIndex = api.value(0);
  var start = api.coord([api.value(1), categoryIndex]);
  var points;
  var shape;
  var rotate_angle;
  if (categoryIndex == 0) {
    y_start = start[1];
  }
  var end = api.coord([api.value(2), categoryIndex]);
  var height = gene_features_properties["rec_items_height"];
  var width = end[0] - start[0];
  var x = start[0];
  var y = y_start - height / 2 - api.value(3);

  if (api.value(4) == 1) {
    /* 5 Points of shape of + strand
        ----------------------
        |                      \
        |                      /
        ----------------------                
        */
    points = [
      [x, y],
      [x + width - width / 100, y],
      [x + width, y - height / 2],
      [x + width - width / 100, y - height],
      [x, y - height],
    ];
    rotate_angle = 0.7;
  } else {
    /* 5 Points of shape - strand
          -----------------------
        /                       |                    
        \                       |
          -----------------------                
        */
    points = [
      [x, y - height / 2],
      [x + width / 100, y],
      [x + width, y],
      [x + width, y - height],
      [x + width / 100, y - height],
    ];
    rotate_angle = -0.7;
  }
  shape = echarts.graphic.clipPointsByRect(points, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height,
  });
  return {
    type: "polygon",
    shape: {
      points: shape,
    },
    style: api.style({}),
    textContent: {
      type: "text",
      invisible: false,
      style: {
        text: gene_feature[categoryIndex].name,
        fill: gene_feature[categoryIndex].itemStyle.color,
        fontStyle: "normal",
        fontSize: 10,
        fontWeight: "bolder",
      },
    },
    textConfig: {
      position: "top",
      distance: 20,
      rotation: rotate_angle,
      local: true,
    },
  };
}

function updateGeneFeatures(params, api) {
  var categoryIndex = api.value(0);
  var start = api.coord([api.value(1), categoryIndex]);
  var points;
  var shape;
  var rotate_angle;
  if (categoryIndex == 0) {
    y_start = start[1];
  }
  var end = api.coord([api.value(2), categoryIndex]);
  var height = gene_features_properties["rec_items_height"];
  var width = end[0] - start[0];
  var x = start[0];
  var y = y_start - height / 2 - api.value(3);

  if (api.value(4) == 1) {
    /* 5 Points of shape of + strand
        ----------------------
        |                      \
        |                      /
        ----------------------                
        */
    points = [
      [x, y],
      [x + width - width / 100, y],
      [x + width, y - height / 2],
      [x + width - width / 100, y - height],
      [x, y - height],
    ];
    rotate_angle = 0.7;
  } else {
    /* 5 Points of shape - strand
          -----------------------
        /                       |                    
        \                       |
          -----------------------                
        */
    points = [
      [x, y - height / 2],
      [x + width / 100, y],
      [x + width, y],
      [x + width, y - height],
      [x + width / 100, y - height],
    ];
    rotate_angle = -0.7;
  }
  shape = echarts.graphic.clipPointsByRect(points, {
    x: params.coordSys.x,
    y: params.coordSys.y,
    width: params.coordSys.width,
    height: params.coordSys.height,
  });
  return {
    type: "polygon",
    shape: {
      points: shape,
    },
    style: api.style({}),
    textContent: {
      type: "text",
      invisible: true,
    },
  };
}

function getGeneFeatureSeries(index) {
  var feature_series = [];
  feature_series.push({
    type: "custom",
    xAxisIndex: index,
    yAxisIndex: index,
    renderItem: renderGeneFeatures,
    labelLayout: {
      hideOverlap: false,
    },
    data: gene_feature,
    tooltip: {
      trigger: "item",
      enterable: true,
      appendToBody: true,
      renderMode: "html",
      borderRadius: 6,
      borderWidth: 2,
      showContent: "true",
      textStyle: {
        fontSize: 15,
        fontWeight: "bolder",
      },
      formatter: function (params) {
        var output = "";
        output +=
          params.name +
          "<br/>" +
          "Start pos: " +
          params.value[1].toLocaleString() +
          "<br/>" +
          "End pos: " +
          params.value[2].toLocaleString() +
          "<br/>" +
          "Length: " +
          (params.value[2] - params.value[1] + 1).toLocaleString() +
          "<br/>" +
          "Strand: " +
          params.value[4].toLocaleString();
        return output;
      },
    },
  });
  return feature_series;
}
///////////////////// End of Gene Feature/////////////////////

function getXAxes(samples, ref_len) {
  var axes = [];
  for (var [i, sample] of samples.entries()) {
    axes.push({
      type: "value",
      gridIndex: i,
      min: 1,
      max: ref_len,
      axisLabel: {
        interval: "auto",
      },
    });
  }
  axes.push({
    type: "value",
    gridIndex: samples.length,
    min: 1,
    max: ref_len,
    axisLabel: {
      interval: "auto",
    },
  });
  return axes;
}

function getYAxes(samples, scaletype, ymax) {
  var axes = [];
  for (var [i, sample] of samples.entries()) {
    axes.push({
      type: scaletype,
      gridIndex: i,
      name: sample,
      nameTextStyle: {
        fontStyle: "normal",
        fontWeight: "bolder",
      },
      nameLocation: "end",
      min: 1,
      max: ymax,
      minorSplitLine: {
        show: true,
      },
    });
  }
  axes.push({
    max: gene_features_properties["max_grid_height"],
    gridIndex: samples.length,
    show: false,
  });
  return axes;
}

function getDatasets(depths, positions) {
  var datasets = [];
  for (var [i, depthArray] of depths.entries()) {
    datasets.push({
      dimensions: [
        { name: "depth", type: "float" },
        { name: "position", type: "int" },
      ],
      source: {
        position: positions,
        depth: depthArray,
      },
    });
  }
  return datasets;
}

function getDepthSeries(samples) {
  var series = [];
  for (var [i, sample] of samples.entries()) {
    series.push({
      type: "line",
      xAxisIndex: i,
      yAxisIndex: i,
      areaStyle: {
        color: "#666",
      },
      encode: {
        x: "position",
        y: "depth",
      },
      symbol: "none",
      datasetIndex: i,
      lineStyle: {
        color: "#666",
        opacity: 0,
      },
      large: true,
    });
  }
  return series;
}

function getVariantsSeries(variants, depths) {
  var series = [];
  for (var [i, varMap] of variants.entries()) {
    (function (i, varMap) {
      series.push({
        type: "bar",
        xAxisIndex: i,
        yAxisIndex: i,
        data: Object.keys(varMap).map((x) => [parseInt(x), depths[i][x]]),
        barWidth: 2,
        itemStyle: {
          color: function (params) {
            var pos = params.data[0];
            var nt = variants[i][pos];
            if (ntColor.hasOwnProperty(nt[0][0])) {
              return ntColor[nt[0][0]];
            }
            return "#333";
          },
        },
      });
    })(i, varMap);
  }
  return series;
}

function getGrids(samples) {
  var n = samples.length + 1;
  var last_height;
  var last_top;
  var grids = Object.keys(samples).map(function (sample) {
    last_height = (1 / n) * 100 - 6;
    if (n == 2) {
      // Only 1 sample (1 sample + gene feature plot)
      last_height = 70;
      return {
        show: true,
        height: "70%", // plot display in nearly full scale
      };
    }
    return {
      show: true,
      height: (1 / n) * 100 - 6 + "%",
    };
  });
  grids.forEach(function (grid, idx) {
    //var padTop = idx === 1 ? 5 : 3
    var padTop = 4;
    last_top = (idx / n) * 100 + padTop;
    grid.top = (idx / n) * 100 + padTop + "%";
    grid.left = "5%";
    grid.right = "5%";
  });
  grids.push({
    show: true,
    height: gene_features_properties["grid_height"],
    top: last_height + last_top + 3 + "%",
    left: "5%",
    right: "5%",
  });
  return grids;
}

function getTooltips(samples, depths, variants) {
  return [
    {
      trigger: "axis",
      enterable: true,
      appendToBody: true,
      renderMode: "html",
      showContent: true,
      formatter: function (params) {
        var output = "";
        var param = params[0];
        var i = param.axisIndex;
        if (i > samples.length) {
          return output;
        }
        var sample = samples[i];
        var position = param.data[1];
        var depth = param.data[0];
        var start_pos = Math.floor(chart.getOption().dataZoom[0].startValue);
        var end_pos = Math.floor(chart.getOption().dataZoom[0].endValue);
        var mean_cov = meanCoverage(depths, start_pos, end_pos, i).toFixed(2);
        var median_cov = medianCoverage(depths, start_pos, end_pos, i).toFixed(2);
        var genome_cov = genomeCoverage(depths, start_pos, end_pos, i, 10).toFixed(2);

        output += "<h5>" + sample + "</h5>";
        var rows = [
          ["Position", position.toLocaleString()],
          ["Depth", depth.toLocaleString()],
        ];
        if (variants[i].hasOwnProperty(position)) {
          rows.push(
            ...[
              [
                "Ref",
                ref_seq.substring(
                  position - 1,
                  position - 1 + variants[i][position].length
                ),
              ],
              ["Variant", variants[i][position]],
            ]
          );
        } else {
          rows.push(["Sequence", ref_seq[position - 1]]);
        }
        output += toTableHtml(["Position Info", ""], rows, "table small");
        rows = [
          [
            "Range",
            start_pos.toLocaleString() + " - " + end_pos.toLocaleString(),
          ],
          ["Mean Coverage", mean_cov + "X"],
          ["Median Coverage", median_cov + "X"],
          ["Genome Coverage ( >= 10x)", genome_cov + "%"],
        ];
        output += toTableHtml(["Coverage View Stats", ""], rows, "table small");
        return output;
      },
    },
  ];
}
function getOption() {
  var samples = [];
  var depths = [];
  var variants = [];

  for (const [key, entries] of Object.entries(window.samples)) {
    if (key < default_num_chart) {
      samples.push(entries);
      depths.push(window.depths[entries]);
      variants.push(window.variants[entries]);
    }
  }
  grid_length = samples.length;
  var options = {
    title: {},
    dataset: getDatasets(depths, positions),
    xAxis: getXAxes(samples, ref_len),
    yAxis: getYAxes(samples, "log", 100000),
    series: [
      ...getDepthSeries(samples),
      ...getVariantsSeries(variants, depths),
      ...getGeneFeatureSeries(grid_length),
    ],
    tooltip: getTooltips(samples, depths, variants),
    toolbox: {
      show: "true",
      feature: {
        dataView: {
          readOnly: false,
        },
        restore: {},
        saveAsImage: {
          name: "Coverage_Plot",
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        filterMode: "none",
        xAxisIndex: [...Array(grid_length + 1).keys()],
        zoomLock: false,
      },
      {
        show: true,
        filterMode: "none",
        xAxisIndex: [...Array(grid_length + 1).keys()],
        type: "slider",
        zoomLock: false,
      },
    ],
    grid: getGrids(samples),
  };
  selectDefaultSamples(samples);
  return options;
}

function updateOption(samples) {
  var depths = [];
  var variants = [];

  for (const selected_samples of samples) {
    depths.push(window.depths[selected_samples]);
    variants.push(window.variants[selected_samples]);
  }
  grid_length = samples.length;
  var options = {
    title: {},
    dataset: getDatasets(depths, positions),
    xAxis: getXAxes(samples, ref_len),
    yAxis: getYAxes(samples, "log", 100000),
    series: [
      ...getDepthSeries(samples),
      ...getVariantsSeries(variants, depths),
      ...getGeneFeatureSeries(grid_length),
    ],
    tooltip: getTooltips(samples, depths, variants),
    toolbox: {
      show: "true",
      feature: {
        dataView: {
          readOnly: false,
        },
        restore: {},
        saveAsImage: {
          name: "Coverage_Plot",
        },
      },
    },
    dataZoom: [
      {
        type: "inside",
        filterMode: "none",
        xAxisIndex: [...Array(grid_length + 1).keys()],
      },
      {
        show: true,
        filterMode: "none",
        xAxisIndex: [...Array(grid_length + 1).keys()],
        type: "slider",
      },
    ],
    grid: getGrids(samples),
  };
  chart.setOption((option = options), (notMerge = true));
  updateChartOptionsMenu();
}

chart.setOption((option = getOption()));
