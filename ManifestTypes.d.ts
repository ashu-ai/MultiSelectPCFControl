/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    sampleProperty: ComponentFramework.PropertyTypes.LookupProperty;
    entityName: ComponentFramework.PropertyTypes.StringProperty;
    filterField: ComponentFramework.PropertyTypes.StringProperty;
    topCount: ComponentFramework.PropertyTypes.LookupProperty;
    columns: ComponentFramework.PropertyTypes.LookupProperty;
    displayFieldLabel: ComponentFramework.PropertyTypes.LookupProperty;
    displayValueField: ComponentFramework.PropertyTypes.LookupProperty;
}
export interface IOutputs {
    sampleProperty?: ComponentFramework.LookupValue[];
}
