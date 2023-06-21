export enum Title {
    Mr = 0,
    Mrs = 1,
    Ms = 2
}

export class TitleUtils {
    public static getTitleText(assests) {
        switch (assests) {
            case Title.Mr: return 'Mr';
            case Title.Mrs: return 'Mrs';
            case Title.Ms: return 'Ms';
        }
    }

    public static getAllTitle() {
        const options = [
            {
                key: Title.Mr,
                value: this.getTitleText(Title.Mr)
            },
            {
                key: Title.Mrs,
                value: this.getTitleText(Title.Mrs)
            },
            {
                key: Title.Ms,
                value: this.getTitleText(Title.Ms)
            }
        ];
        return options;
    }
}