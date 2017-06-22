({
    doInit: function(component, event, helper) {
        var toggleText = component.find("templateDiv");
        $A.util.addClass(toggleText, 'toggle');
        toggleText = component.find("previewDiv");
        $A.util.addClass(toggleText, 'toggle');
        toggleText = component.find("confirmDiv");
        $A.util.addClass(toggleText, 'toggle');
        helper.getOutage(component, component.get("v.recordId"));
        helper.loadTemplates(component);
    },
    handleNextClick: function(component, event, helper) {
        console.log('handleNextClick');
        console.log('event=' + event.getSource().getLocalId());
        var comp = event.getSource().getLocalId();

        component.set('v.errorMsg', '');

        switch (comp) {
            case "detailNext":
               
                var outage = component.get("v.outage");
                var templateId = component.get("v.templateId");
                var stop = component.get("v.stop");
                console.log('outage: ' + JSON.stringify(outage));
                console.log('Begin Date: ' + outage.Begin_Date_Time__c);
                console.log('End Date: ' + outage.End_Date_Time__c);
                console.log('TemplateId: ' + templateId);
                console.log('Stop: ' + outage.Stop__c);

                if (outage.Stop__c == null || 
                	templateId == null || templateId.length == 0 || 
                	outage.Begin_Date_Time__c == null || 
                	outage.End_Date_Time__c == null)
                {
	                component.set('v.errorMsg', 'Error occured');
                } else {
                    //helper.getStop(component, outage.Stop__c);
                    var action = component.get("c.getStop");
                    action.setParams({
                        "id": outage.Stop__c
                    });
                    console.log('action: ' + JSON.stringify(action));
                    //Set up the callback
                    var self = this;
                    action.setCallback(this, function(a) {
                        console.log('getStop return: ' + JSON.stringify(a.getReturnValue()));
                        var outage = component.get("v.outage");
                        var stop = a.getReturnValue();
                        component.set("v.stop", a.getReturnValue());
                        var tempId = component.get("v.templateId");
                        var templateList = component.get("v.templateList");
                        for (var i = 0; i < templateList.length; i++) {
                            if (templateList[i].Id == tempId) {
                                var startDt = moment(outage.Begin_Date_Time__c).format("MM/DD/YYYY hh:mm A");
                                var endDt = moment(outage.End_Date_Time__c).format("MM/DD/YYYY hh:mm A");
                                var emailTemp = templateList[i].Email_Body_Template__c;
                                emailTemp = emailTemp.replace('@START@', startDt).replace('@END@', endDt).replace('@STOP@', stop.Stop_Name__c).replace('@COMMUNITY_LINK@', 'https://sdodemo-main-15a90ffc21a.force.com/myRTD/s/detail/'+component.get("v.recordId"));
                                var smsTemp = templateList[i].SMS_Template__c;
                                smsTemp = smsTemp.replace('@START@', startDt).replace('@END@', endDt).replace('@STOP@', stop.Stop_Name__c).replace('@COMMUNITY_LINK@', 'https://sdodemo-main-15a90ffc21a.force.com/myRTD/s/detail/'+component.get("v.recordId"));
                                component.set("v.outage.Outage_Text__c", emailTemp);
                                component.set("v.outage.Outage_SMS_Message_del__c", smsTemp);
                            }
                        }
                    });
                    $A.enqueueAction(action);
                    /////////////////////////////
                    // Update the progress bar //
                    /////////////////////////////
                    var target = component.find("detailsDiv");
                    $A.util.addClass(target, 'toggle');
                    target = component.find("templateDiv");
                    $A.util.removeClass(target, 'toggle');
                    target = component.find("detailsIndicator");
                    $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                    $A.util.addClass(target, 'slds-tabs--path__item slds-is-complete');
                    target = component.find("templateIndicator");
                    $A.util.removeClass(target, 'slds-tabs--path__item slds-is-incomplete');
                    $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                    //////////////////////
                    // processing logic //
                    //////////////////////
                    // get the correct template
                    /*
                    var stop = component.get("v.stop");
                    var tempId = component.get("v.templateId");
                    var templateList = component.get("v.templateList");
                    for (var i = 0; i < templateList.length; i++) {
                        if (templateList[i].Id == tempId) {
                            var startDt = moment(outage.Start_Date__c).format("MM/DD/YYYY hh:mm A");
                            var endDt = moment(outage.End_Date__c).format("MM/DD/YYYY hh:mm A");
                            var emailTemp = templateList[i].Email_Body_Template__c;
                            emailTemp = emailTemp.replace('@START@', startDt).replace('@END@', endDt).replace('@STOP@', stop).replace('@COMMUNITY_LINK@', component.get("v.recordId"));
                            var smsTemp = templateList[i].SMS_Template__c;
                            smsTemp = smsTemp.replace('@START@', startDt).replace('@END@', endDt).replace('@STOP@', stop).replace('@COMMUNITY_LINK@', component.get("v.recordId"));
                            component.set("v.templateEmail", emailTemp);
                            component.set("v.templateSMS", smsTemp);
                        }
                    }
                    */
                }
                break;
            case "templateNext":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("templateDiv");
                $A.util.addClass(target, 'toggle');
                target = component.find("previewDiv");
                $A.util.removeClass(target, 'toggle');
                target = component.find("templateIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-complete');
                target = component.find("previewIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
            case "previewConfirm":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("previewDiv");
                $A.util.addClass(target, 'toggle');
                target = component.find("confirmDiv");
                $A.util.removeClass(target, 'toggle');
                target = component.find("previewIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-complete');
                target = component.find("confirmIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-incomplete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                ////////////////////////////////
                // save updated outage object //
                ////////////////////////////////
                var outage = component.get("v.outage");
                helper.saveOutage(component, outage);
                break;
        }
    },
    handleBackClick: function(component, event, helper) {
        console.log('handleNextClick');
        console.log('event=' + event.getSource().getLocalId());
        //console.log('event=' + JSON.stringify(event));
        var comp = event.getSource().getLocalId();
        switch (comp) {
            case "templateBack":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("templateDiv");
                $A.util.addClass(target, 'toggle');
                target = component.find("detailsDiv");
                $A.util.removeClass(target, 'toggle');
                target = component.find("templateIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-incomplete');
                target = component.find("detailsIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
            case "previewBack":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("previewDiv");
                $A.util.addClass(target, 'toggle');
                target = component.find("templateDiv");
                $A.util.removeClass(target, 'toggle');
                target = component.find("previewIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-incomplete');
                target = component.find("templateIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
            case "confirmBack":
                /////////////////////////////
                // Update the progress bar //
                /////////////////////////////
                var target = component.find("confirmDiv");
                $A.util.addClass(target, 'toggle');
                target = component.find("previewDiv");
                $A.util.removeClass(target, 'toggle');
                target = component.find("confirmIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-current');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-incomplete');
                target = component.find("previewIndicator");
                $A.util.removeClass(target, 'slds-tabs--path__item slds-is-complete');
                $A.util.addClass(target, 'slds-tabs--path__item slds-is-current');
                break;
        }
    },
    navigateToRecord: function(component, event, helper) {
    	$A.get('e.force:refreshView').fire();
    	
        var outageId = component.get("v.recordId");
        var sObectEvent = $A.get("e.force:navigateToSObject");
        sObectEvent.setParams({
            "recordId": outageId,
            "slideDevName": "detail"
        });
        sObectEvent.fire();

        $A.get('e.force:refreshView').fire();
    }
})