import { LightningElement, track, wire, api } from 'lwc';
import getContactsRelatedToAccount from 
'@salesforce/apex/LwcController.getContactsRelatedToAccount';
import updateRecords from 
'@salesforce/apex/LwcController.saveRecords';

const PAGESIZEOPTIONS = [10,20,40];

const TYPEOPTIONS = [
    {value: 'Web', label: 'Web'},
    {value: 'Phone', label: 'Phone'}
];

const columns = [
    { label: 'First Name', fieldName: 'FirstName', sortable: true, resizable: true, editable: true},
    { label: 'Last Name', fieldName: 'LastName', sortable: true, resizable: true, editable: true},
    { label: 'Email', fieldName: 'Email', sortable: true, resizable: true, editable: true},
    { label: 'LeadSource', fieldName: 'LeadSource',type: 'picklist', options: TYPEOPTIONS, sortable: true, resizable: true, editable: true},
    { label: 'MobilePhone', fieldName: 'MobilePhone', sortable: true, resizable: true, editable: true}
];

export default class AccountRelatedContacts extends LightningElement {
    @api recordId;
    @track contacts;
    
    error;
    columns = columns;
    opps; //All contacts 
    showTable = false; //Used to render table after we get the data from apex controller    
    pageSizeOptions = PAGESIZEOPTIONS;
    isLoading = true;
    loadMessage = 'Loading...';

    @wire(getContactsRelatedToAccount, {accId: '$recordId'}) 
    WireContactRecords({error, data}){
        if(data){
            this.contacts = data;
            this.error = undefined;
        }else{
            this.error = error;
            this.contacts = undefined;            
        }        
    }

    connectedCallback(){
        this.getRelatedContacts_();
    }

    
    getRelatedContacts_(){
        this.contacts = [
            {
                id : 1,
                FirstName : "BK", 
                LastName : "ZZ",
                LeadSource : "YY",
                //Email : this.contacts[0].Email
            }
        ];
        
        this.contacts = this.contacts;
        this.columns = columns;
        this.showTable = true;
        this.isLoading = false;
    }
    
/*
    getRelatedContacts_(){
        this.showTable = false;
        this.loadMessage = 'Loading...';
        this.isLoading = true;
        this.error = '';
        getContactsRelatedToAccount({accId: '$recordId'})
        .then(data=>{
            this.opps = [];
            for(let i=0; i<data.length; i++){
                let obj = {...data[i]};
                //obj.accName = data[i].Account.Name;
                this.opps.push(obj);
            }
            this.showTable = true;
            this.isLoading = false;
        })
        .catch(error=>{
            this.error = JSON.stringify(error);
            this.showTable = true;
            this.isLoading = false;
        });       
    }
    */

    handleRowSelection(event){
        console.log('Records selected***'+JSON.stringify(event.detail));
    }

    saveRecords(event){
        this.loadMessage = 'Saving...';
        this.isLoading = true;
        this.error = '';
        updateRecords({recsString: JSON.stringify(event.detail)})
        .then(response=>{
            if(response==='success') this.getRelatedContacts_();
        })
        .catch(error=>{
            console.log('recs save error***'+error);
            this.error = JSON.stringify(error);
            this.isLoading = false;
        });
        //location.reload();
        window.location.reload();
    }
}