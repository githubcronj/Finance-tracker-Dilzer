export enum ResidentialStatus {
    PermanentIndianResident = 0,
    NRI = 1,
    PIO = 2,
    RNOR = 3
}

export class ResidentialStatusUtils {
    public static getResidentialStatusText(assests) {
        switch (assests) {
            case ResidentialStatus.PermanentIndianResident: return 'Permanent Indian Resident';
            case ResidentialStatus.NRI: return 'NRI';
            case ResidentialStatus.PIO: return 'PIO';
            case ResidentialStatus.RNOR: return 'RNOR';
        }
    }

    public static getAllResidentialStatus() {
        const options = [
            {
                key: ResidentialStatus.PermanentIndianResident,
                value: this.getResidentialStatusText(ResidentialStatus.PermanentIndianResident)
            },
            {
                key: ResidentialStatus.NRI,
                value: this.getResidentialStatusText(ResidentialStatus.NRI)
            },
            {
                key: ResidentialStatus.PIO,
                value: this.getResidentialStatusText(ResidentialStatus.PIO)
            },
            {
                key: ResidentialStatus.RNOR,
                value: this.getResidentialStatusText(ResidentialStatus.RNOR)
            }
        ];
        return options;
    }
}