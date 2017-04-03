import { Plot } from '../models/plot';
import { Tree } from '../models/tree';

export const CruiseService = {
    downloadFile(cruise) {
        var csv = this.buildCSV(cruise);
        this.startDownload(csv, cruise.cruiseName + '.csv');
    },
    startDownload(file, fileName) {
        if (window.URL && window.Blob) {
            try {
                var blob = new Blob([file], {type: 'text/csv'});
            } catch (e) {
                console.log('setFileDownload: blobs not supported');
            }
            if (window.URL.createObjectURL && blob) {
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.className = 'hidden';
                a.href = url;
                a.download = fileName.replace(/ /g, ''); //remove spaces
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.log('File download NOT supported.');
            }
        }
    },
    buildCSV(cruise) {
        let result = '';
        let plotResult = '';
        let treeResult = '';
        let tempTree = new Tree(null); //for easy reliable headers
        let tempPlot = new Plot(-1, null); //for easy, reliable headers
        function csvEntry(csvObj, flag, deep) {
            let data = '';
            for (let prop in csvObj) {
                if (typeof (csvObj[prop]) !== 'object' || csvObj[prop] === null) {
                    flag === 'header' ? data += prop + ',' : (csvObj[prop] === null ? data += ',' : data += csvObj[prop] + ',');  //add property name or value to data
                } else if (!Array.isArray(csvObj[prop])) { //must be sub-object
                    data += csvEntry(csvObj[prop], flag, '');  //call function again
                } else if (deep) { //have an array, need to get headers from it
                    for (let item of csvObj[prop]) {
                        data += csvEntry(item, flag, '');  //call function again
                    }
                }
            }
            return data;
        }
        result += csvEntry(cruise, 'header', '').slice(0, -1) + '\r\n';
        result += csvEntry(cruise, 'data', '').slice(0, -1) + '\r\n';
        result += csvEntry(tempPlot, 'header', '').slice(0, -1) + '\r\n'; //get plot header from dummy plot
        for (let plot of cruise.plots) {
            plotResult += csvEntry(plot, 'data', '').slice(0, -1) + '\r\n';
            for (let tree of plot.trees) {
                if (tree.field2 !== null) {  //just in case plot with no trees (10 empty initial trees)
                    treeResult += plot.plotnum + ',' + csvEntry(tree, 'data', '');
                    for (let segment of tree.segments) {
                        treeResult += csvEntry(segment, 'data', '');
                    }
                    treeResult = treeResult.slice(0, -1) + '\r\n';
                }
            }
        }
        result += plotResult;
        result += 'plotnum,' + csvEntry(tempTree, 'header', 'deep').slice(0, -1) + '\r\n'; //get tree headings from dummy tree
        result = result.replace('field1,field2,field3,field4', 'species,' + cruise.field2.name + ',' + cruise.field3.name + ',' + cruise.field4.name); //adjust headings to reflect names of fields
        result = result.replace(/,id,/g, ',segment id,')
        result += treeResult;
        return result;
    }
}
