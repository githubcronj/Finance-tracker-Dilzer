
import { JsonObject, JsonProperty } from '../parsers/json-convert-decorators';
import { MappedAsset } from './mapped-asset'

@JsonObject
export class CorpusRequired {

        @JsonProperty('fundToStartOfTheGoal', Boolean) fundToStartOfTheGoal: boolean = undefined
        @JsonProperty('occurrences', [CorpusRequired]) occurrences: Array<CorpusRequired> = undefined

        @JsonProperty('amount', Number) amount: number = undefined
        @JsonProperty('fundedAmount', Number) fundedAmount: number = undefined;
        @JsonProperty('pecentageFunded', Number) pecentageFunded: number = undefined;
        @JsonProperty('gap', Number) gap: number = undefined;
        @JsonProperty('gapDuringValuationDate', Number) gapDuringValuationDate: number = undefined;
        @JsonProperty('yearsToGo', Number) yearsToGo: number = undefined;
        @JsonProperty('monthlyInvestmentRequired', Number) monthlyInvestmentRequired: number = undefined;
        @JsonProperty('yearlyInvestmentRequired', Number) yearlyInvestmentRequired: number = undefined;
        @JsonProperty('assets', [MappedAsset]) assets: Array<MappedAsset> = [];

        @JsonProperty('date', Date) date: Date = undefined
        @JsonProperty('pvStartOfGoal', Number) pvStartOfGoal: number = undefined


}
