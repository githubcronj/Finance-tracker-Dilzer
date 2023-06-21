export enum CompanyType {
    Government = 0,
    POGA = 1,
    NPOGA = 2
}

export class CompanyTypeUtils {
    public static getCompanyTypeText(assests) {
        switch (assests) {
            case CompanyType.Government: return 'Government';
            case CompanyType.POGA: return 'POGA';
            case CompanyType.NPOGA: return 'NPOGA';

        }
    }

    public static getAllCompanyType() {
        const options = [
            {
                key: CompanyType.Government,
                value: this.getCompanyTypeText(CompanyType.Government)
            },
            {
                key: CompanyType.POGA,
                value: this.getCompanyTypeText(CompanyType.POGA)
            },
            {
                key: CompanyType.NPOGA,
                value: this.getCompanyTypeText(CompanyType.NPOGA)
            }
        ];
        return options;
    }
}
