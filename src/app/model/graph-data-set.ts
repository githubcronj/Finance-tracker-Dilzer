export class GraphDataSet {

    labels = [];
    datasets = [
        {
            data: [],
            backgroundColor: []
        }
    ];
    options

    constructor(title: String = "") {
        this.options = {
            title: {
                display: true,
                text: title,
                fontSize: 16
            },
            legend: {
                display: false
            },
            animation: false
        };
    }


}
