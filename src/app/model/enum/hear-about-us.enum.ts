export enum HearAboutUs {
    Friend = 1,
    Website = 2,
    SocialMedia = 3,
    FPSB_Board = 4,
    Google = 5,
    Media = 6,
    SEBI_Registered = 7,
    Others = 0
}
export class HearAboutUsUtils {
    public static getHearAboutUsText(hearAboutUs) {
        switch (hearAboutUs) {
            case HearAboutUs.Others: return 'Others';
            case HearAboutUs.Friend: return 'Friend';
            case HearAboutUs.Website: return 'Website';
            case HearAboutUs.SocialMedia: return 'Social Media (Twitter/ Linkedin / Blog etc...)';
            case HearAboutUs.FPSB_Board: return 'FPSB Board of Registered Certified Financial Planners';
            case HearAboutUs.Google: return 'Google Search';
            case HearAboutUs.Media: return 'Media (Newspaper/ magazine)';
            case HearAboutUs.SEBI_Registered: return 'SEBI Registered Investment Advisor Website.';
        }
    }


    public static getAllHearAboutUsOptions() {
        const options = [
            {
                key: HearAboutUs.Google,
                value: this.getHearAboutUsText(HearAboutUs.Google)
            },

            {
                key: HearAboutUs.Friend,
                value: this.getHearAboutUsText(HearAboutUs.Friend)
            },
            {
                key: HearAboutUs.Website,
                value: this.getHearAboutUsText(HearAboutUs.Website)
            },
            {
                key: HearAboutUs.SocialMedia,
                value: this.getHearAboutUsText(HearAboutUs.SocialMedia)
            },
            {
                key: HearAboutUs.FPSB_Board,
                value: this.getHearAboutUsText(HearAboutUs.FPSB_Board)
            },
            {
                key: HearAboutUs.Media,
                value: this.getHearAboutUsText(HearAboutUs.Media)
            },
            {
                key: HearAboutUs.SEBI_Registered,
                value: this.getHearAboutUsText(HearAboutUs.SEBI_Registered)
            },
            {
                key: HearAboutUs.Others,
                value: this.getHearAboutUsText(HearAboutUs.Others)
            }
        ];
        return options;
    }
}