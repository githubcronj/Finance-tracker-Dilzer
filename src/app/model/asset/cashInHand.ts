import { Asset } from './asset';
import { CashInHandAssetSubTypeUtils } from '../enum/asset/cashinhand-sub-type.enum';
import { AssetType } from '../enum/asset/asset-type.enum'
import { JsonObject, JsonProperty } from "../parsers/json-convert-decorators";

@JsonObject
export class CashInHand extends Asset {

    constructor() {
        super()
        this.kind = String(AssetType.CashInHand)
    }
    subTypesOptions() {
        return CashInHandAssetSubTypeUtils.getAllAssetSubType()
    }

}