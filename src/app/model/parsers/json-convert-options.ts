/**
 * Internal constants.
 */
export class Settings {
    static readonly MAPPING_PROPERTY = "__jsonconvert__mapping__";
    static readonly MAPPER_PROPERTY = "__jsonconvert__mapper__";
};

/**
 * Internal mapping options for a property.
 */
export class MappingOptions {
    classPropertyName: string = "";
    jsonPropertyName: string = "";
    expectedJsonType: string = undefined;
    isOptional: boolean = true;
    customConverter: any = null;
}