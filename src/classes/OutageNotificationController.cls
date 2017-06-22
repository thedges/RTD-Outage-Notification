global class OutageNotificationController {
	public OutageNotificationController() {
		
	}

	@AuraEnabled
    public static Outage_Alert__c getOutage(String id) {
        System.debug('getOutage invoked...');

        Outage_Alert__c o = [SELECT Id, Begin_Date_Time__c, End_Date_Time__c, Stop__c, Outage_Type__c, Outage_Text__c, Outage_SMS_Message_del__c FROM Outage_Alert__c WHERE Id = :id];
        return o;
    }

    @AuraEnabled
    public static Stop__c getStop(String id) {
        System.debug('getStop invoked...');

        Stop__c s = [SELECT Id, Name, Stop_Name__c, Location_Type__c FROM Stop__c WHERE Id = :id];
        return s;
    }

    @AuraEnabled
    public static Outage_Template__c getOutageTemplate(String id) {
        System.debug('getOutageTemplate invoked...');

        Outage_Template__c ot = [SELECT Id, Name, Email_Body_Template__c, SMS_Template__c FROM Outage_Template__c WHERE Id = :id];
        return ot;
    }

    @AuraEnabled
    public static List<Outage_Template__c> getOutageTemplates() {
        System.debug('getOutageTemplates invoked...');

        List<Outage_Template__c> otList = [SELECT Id, Name, Email_Body_Template__c, SMS_Template__c FROM Outage_Template__c];
        return otList;
    }

    @AuraEnabled
    public static List<Stop__c> getStops() {
        System.debug('getStops invoked...');

        List<Stop__c> stopList = [SELECT Id, Name, Stop_Name__c FROM Stop__c];
        return stopList;
    }

    @AuraEnabled
    public static void saveOutage(Outage_Alert__c outage) {
        System.debug('saveOutage invoked...');
        System.debug('outage: ' + outage);

        update outage;
    }
}