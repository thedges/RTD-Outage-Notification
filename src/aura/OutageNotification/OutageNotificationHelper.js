({
    loadTemplates: function(component) {
        console.log('helper loadTemplates started...');

        var action = component.get("c.getOutageTemplates");

        //Set up the callback
        var self = this;
        action.setCallback(this, function(a) {
            console.log('loadTemplates callback!');
            console.log(JSON.stringify(a.getReturnValue()));
            var recs = a.getReturnValue();
            if (recs == null || recs.length <= 0) {
                // fire a toast message to popup on screen for Success
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Warning!",
                    "message": "Search returned zero results.",
                    "duration": 2000,
                    "type": "warning"
                });
                toastEvent.fire();
            } else {
                component.set("v.templateList", recs);
            }
        });
        $A.enqueueAction(action);
    },
    getOutage: function(component, id) {
        console.log('helper getOutage started...');

        var action = component.get("c.getOutage");
        action.setParams({
            "id": id
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(a) {
            console.log('getOutage callback!');
            console.log(JSON.stringify(a.getReturnValue()));

            var outage = a.getReturnValue();

            if (outage.Begin_Date_Time__c != null)
            {
               outage.Begin_Date_Time__c = moment(outage.Begin_Date_Time__c).format("YYYY-MM-DDTHH:mm");
           }

           if (outage.End_Date_Time__c != null)
           {
             outage.End_Date_Time__c = moment(outage.End_Date_Time__c).format("YYYY-MM-DDTHH:mm");
           }
            
            component.set("v.outage", a.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    getStop: function(component, id) {
        console.log('helper getStop started...');

        var action = component.get("c.getStop");
        action.setParams({
            "id": id
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(a) {
            console.log('getStop callback!');
            console.log(JSON.stringify(a.getReturnValue()));
            
            component.set("v.stop", a.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    saveOutage: function(component, outage) {
        console.log('helper saveOutage started...');
        component.set("v.Spinner", true); 

        // prep date values for correct Apex format
        outage.Begin_Date_Time__c = moment(outage.Begin_Date_Time__c).format("YYYY-MM-DDTHH:mm:ss.000Z");
        outage.End_Date_Time__c = moment(outage.End_Date_Time__c).format("YYYY-MM-DDTHH:mm:ss.000Z");

        var action = component.get("c.saveOutage");
        action.setParams({
            "outage": outage
        });

        //Set up the callback
        var self = this;
        action.setCallback(this, function(a) {
            console.log('saveOutage callback!');
            component.set("v.Spinner", false);
            console.log(JSON.stringify(a));

            var iconToShow;

            if (a.getState() === "SUCCESS") {
               iconToShow = "action:approval";
            }
            else if (a.getState() === "ERROR"){
                iconToShow = "action:close";
              console.log('error=' + JSON.stringify(a.getError()));
            }

            $A.createComponent(
                "lightning:icon",
                {
                    "aura:id": "resultsIcon",
                    "iconName": iconToShow,
                    "size": "medium"
                },
                function(newIcon,status,errorMessage){
                    if (status === "SUCCESS")
                    {
                       var body = component.get("v.body");
                       body.push(newIcon);
                       component.set("v.body", body);

                       component.set("v.saveResult", "Outage notification has been saved correctly!");
                    }
                    else if (status === "INCOMPLETE")
                    {
                       console.log("No reponse from server");
                    }
                    else if (status === "ERROR")
                    {
                       component.set("v.saveResult", "ERROR: " + a.getError());
                       console.log("Error: " + errorMessage);
                    }
                }
                );
            
        });
        $A.enqueueAction(action);
    }
})