export enum CommittedSavingFrequencyType {
    Yearly = 0,
    HalfYearly = 1,
    Quarterly = 2,
    Monthly = 3

}

export class CommittedSavingFrequencyTypeUtils {
    public static getCommittedSavingFrequencyTypeText(frequency) {
        switch (frequency) {
            case CommittedSavingFrequencyType.Yearly: return 'Yearly';
            case CommittedSavingFrequencyType.HalfYearly: return 'Half Yearly';
            case CommittedSavingFrequencyType.Quarterly: return 'Quarterly';
            case CommittedSavingFrequencyType.Monthly: return 'Monthly';
        }
    }


    public static getAllCommittedSavingFrequencyType() {
        const options = [
            {
                key: CommittedSavingFrequencyType.Yearly,
                value: this.getCommittedSavingFrequencyTypeText(CommittedSavingFrequencyType.Yearly)
            },
            {
                key: CommittedSavingFrequencyType.HalfYearly,
                value: this.getCommittedSavingFrequencyTypeText(CommittedSavingFrequencyType.HalfYearly)
            },
            {
                key: CommittedSavingFrequencyType.Quarterly,
                value: this.getCommittedSavingFrequencyTypeText(CommittedSavingFrequencyType.Quarterly)
            },
            {
                key: CommittedSavingFrequencyType.Monthly,
                value: this.getCommittedSavingFrequencyTypeText(CommittedSavingFrequencyType.Monthly)
            }
        ];
        return options;
    }
}