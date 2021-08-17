public with sharing class LwcController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsRelatedToAccount(String accId) {
        system.debug('accId >> ' + accId);
        return [SELECT Id, FirstName, LastName, Email, Phone, LeadSource, MobilePhone from Contact where AccountId = :accId];
    }

    @AuraEnabled
    public static String saveRecords(String recsString) {
        List<Contact> recs2Save = (List<Contact>) JSON.deserialize(recsString, List<Contact>.class);
        update recs2Save;
        return 'success';
    }
}
