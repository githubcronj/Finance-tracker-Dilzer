export enum MaritalStatus {
    Single = 0,
    Married = 1,
    Divorced = 2,
    Seperated = 3
}

export class MaritalStatusUtils {
    public static getMaritalStatusText(assests) {
        switch (assests) {
            case MaritalStatus.Single: return 'Single';
            case MaritalStatus.Married: return 'Married';
            case MaritalStatus.Divorced: return 'Divorced';
            case MaritalStatus.Seperated: return 'Seperated';
        }
    }

    public static getAllMaritalStatus() {
        const options = [
            {
                key: MaritalStatus.Single,
                value: this.getMaritalStatusText(MaritalStatus.Single)
            },
            {
                key: MaritalStatus.Married,
                value: this.getMaritalStatusText(MaritalStatus.Married)
            },
            {
                key: MaritalStatus.Divorced,
                value: this.getMaritalStatusText(MaritalStatus.Divorced)
            },
            {
                key: MaritalStatus.Seperated,
                value: this.getMaritalStatusText(MaritalStatus.Seperated)
            }
        ];
        return options;
    }
}