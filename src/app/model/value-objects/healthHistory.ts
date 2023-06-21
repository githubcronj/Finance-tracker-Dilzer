import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";
import { HealthHistoryTranslations } from "../../componants/container/health-details.translations"
import { GeneralHealthConditonUtils, GeneralHealthConditonStatus } from "../enum/general-health-condition.enum"

@JsonObject
export class HealthHistory {

    @JsonProperty("generalHealthCondition", Number) generalHealthCondition: number = undefined
    @JsonProperty("checkupInterval", String) checkupInterval: string = undefined
    @JsonProperty("isHeathParamertersNormal", Boolean) isHeathParamertersNormal: boolean = undefined
    @JsonProperty("parametersOutOfRange", String) parametersOutOfRange: string = undefined
    @JsonProperty("isChronicHeathConditionNormal", Boolean) isChronicHeathConditionNormal: boolean = undefined
    @JsonProperty("chronicHeathConditionDuration", String) chronicHeathConditionDuration: string = undefined
    @JsonProperty("isChronicHeathConditionMedicated", Boolean) isChronicHeathConditionMedicated: boolean = undefined
    @JsonProperty("otherHealthCondition", String) otherHealthCondition: string = undefined

    displayGeneralHealthCondition() {
        return GeneralHealthConditonUtils.getGeneralHealthConditonText(Number(this.generalHealthCondition));
    }

}