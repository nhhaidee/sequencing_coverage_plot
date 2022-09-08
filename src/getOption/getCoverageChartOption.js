import {getDataSet} from "./getDataSet";
import {getXAxes, getYAxes} from "./getAxes";
import {getDepthSeries} from "./getDepthSeries";
import {getVariantsSeries} from "./getVariantSeries";
import {getRegionAmpliconDepthSeries} from "./getRegionAmpliconDepthSeries";
import {getGeneFeatureSeries} from "../geneFeatures/getGeneFeatureSeries";
import {getGrids} from "./getGrids";
import {getTooltips} from "./getTooltips";
import {getDataZoom} from "./getDataZoom";
import {getToolbox} from "./getToolbox";


/**
 * Define all options for coverage chart
 * @param {Array<Object>} geneAmpliconFeatureData - Array of dictionary geneFeature or amplicon data
 * @param {Array<Object>} regionAmpliconDepthData - Array of region amplicon depth data
 * @param {string} refSeq - Reference seq
 * @param {number} yAxisMax - Max of Y Axis
 * @param {Array<string>} samples - An array of samples names
 * @param {Array<Array<number>>} depths - Array of depths
 * @param {Array<Array<Object>>} variants - The object of variants data
 * @param {number} lowCoverageThreshold - Low coverage threshold
 * @param {boolean} geneFeature - whether to plot gene feature or not (true or false)
 * @param {boolean} amplicon - whether to plot amplicon feature or not (true or false)
 * @param {string} triggerOnType - mousemove or click
 * @param {boolean} variantSites- whether to show tooltips for variant sites
 * @param {boolean} nonVariantSites - whether to show tooltips for non-variant sites
 * @param {boolean} infoComparison - whether to compare variants/ Coverage Stat across samples
 * @param {boolean} showMutation - whether to show Mutation below Variant Sites
 * @param {boolean} showXAxisLabel - whether to show X Axis
 * @param {boolean} hideOverlapMutation - whether to hide overlapping mutation under variants sites
 * @returns {Object} - The options for coverage chart
 *
 * The format of data
 * * geneFeatureAmpliconData = [{
 *                    "idx": index,
 *                    "start": start_pos,
 *                    "end": end_pos,
 *                    "level": level,
 *                    "strand": strand,
 *                    "type": "gene_feature or amplicon"}]
 * * ampliconDepthBarData = [{
 *                    "value": [start, end, depth, name]
 *                    "itemStyle": {"color": "skyblue or violet"}}]
 * * samples = ["sample1", "sample2","sample3"]
 * * depths = [
 *       [1, 2, 45, 3, 2, 34, 54, 65, 7, 6, 34, 45, 56, 67, 78, 78],
 *       [1, 2, 45, 0, 0, 9, 15, 65, 7, 6, 20, 8, 4, 15, 100, 102],
 *       [12, 12, 425, 3, 2, 10, 12, 9, 7, 6, 1, 45, 45, 67, 87, 97]
 *   ]
 * * variants = [
 *       [0:{sample: 'sample1', CHROM: 'MN908947.3',mutation: 'C14408T(orf1ab:L4715L)',POS: 14408},
 *        1:{sample: 'sample1', CHROM: 'MN908947.3',mutation: 'C14408T(orf1ab:L4715L)',POS: 29300}],
 *       [0:{sample: 'sample2', CHROM: 'MN908947.3',mutation: 'C15480A(orf1ab:P5072H)',POS: 10000},
 *        1:{sample: 'sample2', CHROM: 'MN908947.3',mutation: 'C15480A(orf1ab:P5072H)',POS: 25300}]
 *    ]
 */
function getCoverageChartOption(geneAmpliconFeatureData, regionAmpliconDepthData, refSeq,
                                yAxisMax, samples, depths, variants,
                                lowCoverageThreshold = 10, geneFeature = false, amplicon = false,
                                triggerOnType = "mousemove", variantSites = true,
                                nonVariantSites = false, infoComparison = true,
                                coverageStatView = false,
                                showMutation = false,
                                showXAxisLabel = true,
                                hideOverlapMutation = true) {
    let positions = [...Array(refSeq.length + 1).keys()];
    let doubleStrand = false;
    Object.values(geneAmpliconFeatureData).forEach(x => {
        if (x.value.strand === -1) {
            doubleStrand = true;
        }
    });
    positions.shift();
    let chartOptions = {
        title: {},
        dataset: getDataSet([], [], depths, positions),
        xAxis: getXAxes(samples, [], [], positions.length, geneFeature, amplicon, showXAxisLabel),
        yAxis: getYAxes(samples, "log", yAxisMax, geneFeature, amplicon),
        // Render 1. Coverage depth; 2. Variants; 3 Amplicon Bar Plot; 4. Gene Feature
        series: [
            ...getDepthSeries(samples, [], {}, [], nonVariantSites),
            ...getVariantsSeries(variants, depths, refSeq, variantSites, showMutation, hideOverlapMutation),
            ...getRegionAmpliconDepthSeries(samples, regionAmpliconDepthData, amplicon),
            ...getGeneFeatureSeries(geneAmpliconFeatureData, samples.length, geneFeature, amplicon)
        ],
        tooltip: getTooltips(samples, depths, variants, refSeq, lowCoverageThreshold, triggerOnType, infoComparison, coverageStatView),
        toolbox: getToolbox(),
        dataZoom: getDataZoom(samples),
        grid: getGrids(samples, geneFeature, amplicon, doubleStrand)
    };
    return chartOptions;
}

export {getCoverageChartOption};