/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    sampleProperty: ComponentFramework.PropertyTypes.StringProperty;
    entityName: ComponentFramework.PropertyTypes.StringProperty;
    filterField: ComponentFramework.PropertyTypes.StringProperty;
    topCount: ComponentFramework.PropertyTypes.StringProperty;
    columns: ComponentFramework.PropertyTypes.StringProperty;
    displayFieldLabel: ComponentFramework.PropertyTypes.StringProperty;
    displayValueField: ComponentFramework.PropertyTypes.StringProperty;
    account: ComponentFramework.PropertyTypes.LookupProperty;
    Button: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    sampleProperty?: string;
    account?: ComponentFramework.LookupValue[];
    Button?: string;
}
