import { Asset } from './asset';
import { FixedDepositAssetSubTypeUtils } from '../enum/asset/fixed-deposit-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class FixedDeposit extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.FixedDeposit)
    }

    subTypesOptions(){
        return FixedDepositAssetSubTypeUtils.getAllAssetSubType()
    }
}