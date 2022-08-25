import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { IProps, MultiSelectControl } from "./MultiSelect";
import  defaultProps  from "react-select";
import { debug } from "console";

export class MultiSelectPCFControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	private _eleMainContainer:HTMLDivElement;
	private _eleButton:HTMLButtonElement;
	private eventSubmitClicked:EventListenerOrEventListenerObject;
	
	
	private _existingValues: any
	private _value: any;
   private _value1:any;
	private _notifyOutputChanged:() => void;
	private _container: HTMLDivElement;
	private props: IProps = 
	{ 
		value : "", 
		onChange : this.notifyChange.bind(this),
		onSearch : this.notifySearch.bind(this),
		onChange1 : this.notifyChange.bind(this),
		onSearch1 : this.notifySearch.bind(this),
		value1:"",
		initialValues : undefined,	
		records: [],
		displayValueField: "",
		displayFieldLabel: "",
		columns: "",
		topCount: "",
		filterField: "",
		entityName: "",
		isControlVisible: true,
		isControlDisabled: true	
	};
	private _context: ComponentFramework.Context<IInputs>;

	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public async init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._container = container;
this._context = context;
//this.theNotifyOutputChanged = notifyOutputChanged;
//The assignment of the event listener to the function should be done before creating the UI     

this.eventSubmitClicked = this.submitClicked.bind(this);
//Create UI        
//Main Container
this._eleMainContainer = document.createElement("div");
this._eleMainContainer.className = "mydiv";
//Define a button
this._eleButton = document.createElement("button");
this._eleButton.className = "canvasAppButton";             
this._eleButton.innerHTML = "Finish";
this._eleButton.addEventListener("click", this.eventSubmitClicked);
//Add the button inside the main container, and the main container inside the container
this._eleMainContainer.appendChild(this._eleButton);
this._container.appendChild(this._eleMainContainer);


		///
		//this._context = context;
		this._notifyOutputChanged = notifyOutputChanged;
		//this._container = document.createElement("div");
		this.props.value = context.parameters.sampleProperty.raw || "";	
		this.props.entityName = context.parameters.entityName.raw || "";
		this.props.filterField = context.parameters.filterField.raw || "";
		this.props.topCount = context.parameters.topCount.raw || "";
		this.props.columns = context.parameters.columns.raw || "";
		this.props.displayFieldLabel = context.parameters.displayFieldLabel.raw || "";
		this.props.displayValueField = context.parameters.displayValueField.raw || "";
					
		if(this.props.value.length > 0)
		{
			this.props.initialValues = await this.onLoad();
			console.log(JSON.stringify(this.props.initialValues));
			this.updateView(context);			
		}	
		else
		{
			this.props.initialValues =[];
		}	
		
		container.appendChild(this._container);
		
	}
	//Custom event handler – for the button
	private submitClicked(event: Event): void{  alert("sjkdwsdjj");    }

	notifyChange(newValue: string) 
	{
		this._value = newValue;
		this._notifyOutputChanged();
		console.log("notifyChange");
	}
  notifyChange1(newValue: string) 
	{
		this._value1 = newValue;
		this._notifyOutputChanged();
		console.log("notifyChange");
	}
	async notifySearch(newValue: string)
	{

		console.log("called notifySearch");

        let account = Xrm.Page.getAttribute("dev_accpount").getValue();

        let getContacts="";

        if(account!=null){

            let accountId = account[0].id.replace("{", "").replace("}", "");            

            console.log(accountId);

            getContacts=`?$select=${this.props.columns}&$filter=contains(${this.props.filterField},'${newValue}') and _parentcustomerid_value eq `+accountId+` &$top=${this.props.topCount}`;

        }

        else{

            getContacts=`?$select=${this.props.columns}&$filter=contains(${this.props.filterField},'${newValue}')&$top=${this.props.topCount}`;

        }

       

        console.log(this.props.entityName,getContacts);

        return this._context.webAPI.retrieveMultipleRecords(this.props.entityName,getContacts)

        .then(function (results) {      

                return results?.entities;      

        })


	}

	///Newly Added
	async notifySearch1(newValue: string)
	{

		console.log("called notifySearch");

        //let account = Xrm.Page.getAttribute("dev_accpount").getValue();
				let account=this._value1[0].id;

        let getContacts="";

        if(account!=null){

            //let accountId = account[0].id.replace("{", "").replace("}", "");            

            console.log(account);

            getContacts=`?$select=${this.props.columns}&$filter=contains(${this.props.filterField},'${newValue}') and _parentcustomerid_value eq `+account+` &$top=${this.props.topCount}`;

        }

        else{

            getContacts=`?$select=${this.props.columns}&$filter=contains(${this.props.filterField},'${newValue}')&$top=${this.props.topCount}`;

        }

       

        console.log(this.props.entityName,getContacts);

        return this._context.webAPI.retrieveMultipleRecords(this.props.entityName,getContacts)

        .then(function (results) {      

                return results?.entities;      

        })


	}

	//Load previous values
	public async onLoad()
	{			
			var count = 0;
			var qs = `?$select=${this.props.columns}&$filter=`;		

			this.props.value.split(",").forEach((c: string| any)=>{			
				if (count > 0)
				{
					qs = qs + ' or ' + this.props.displayValueField + ' eq ' + c
				}
				else
				{
					qs = qs + this.props.displayValueField + ' eq ' + c
				}
				count++;
			});
			
			console.log("querystring is " + qs);

			 return this._context.webAPI.retrieveMultipleRecords(this.props.entityName,qs)
			 .then(function (results) {		
				return results?.entities;
			});				
	}

	private renderElement()
	{
		if(this.props.initialValues != undefined)
		{
			this.props.isControlDisabled = this._context.mode.isControlDisabled;
			this.props.isControlVisible = this._context.mode.isVisible;
	
				ReactDOM.render(
					React.createElement(MultiSelectControl, this.props)
					, this._container
				);
				console.log("viewUpdated");
		}
		
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		this._value = context.parameters.sampleProperty.raw;
		this.props.value = this._value;
		this._value1 = context.parameters.account.raw;
		this.props.value1 = this._value1;
		this.props.topCount = context.parameters.topCount.raw;
		this.props.columns = context.parameters.columns.raw;
		this.props.filterField = context.parameters.filterField.raw;
		this.props.displayFieldLabel = context.parameters.displayFieldLabel.raw;
		this.props.displayValueField = context.parameters.displayValueField.raw;
		this.props.entityName =context.parameters.entityName.raw;
			
		this.renderElement();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		console.log("getoutputs");

		return {
			sampleProperty : this._value,
			account: this._value1		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
	}
}