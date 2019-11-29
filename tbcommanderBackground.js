///////////////////////////////////////////////////////////////////////////
// Addon background script, it's a long running script which scan the    //
// bookmarks, learn the commands and then serve the requests coming from //
// the user                                                              //
///////////////////////////////////////////////////////////////////////////
console.log("Init background script");

// Routine to handle a command coming from the content script invoked in the popup
function handleCommand(text) {
    console.log(`Handle command: ${text}`);
    var commandName = text.split(":", 1)[0];
    var queryCmd = text.slice(commandName.length + 1, text.length);
    commandName = commandName.trim();
    queryCmd = queryCmd.trim();
    if (commandName === "f" || commandName === "from")
    {
        console.log("command FROM: " + queryCmd);
        browser.tabs.query({mailTab: true}).then(tabs => {
            browser.mailTabs.setQuickFilter(tabs[0].id, {text: {text: queryCmd, author: true}});
        });
        return;
    }
    if (commandName === "t" ||
        commandName === "to" ||
        commandName === "toorcc")
    {
        console.log("command TO: " + queryCmd);
        browser.tabs.query({mailTab: true}).then(tabs => {
            browser.mailTabs.setQuickFilter(tabs[0].id, {text: {text: queryCmd, recipients: true}});
        });
        return;
    }
    if (commandName === "b" ||
        commandName === "body")
    {
        console.log("command BODY: " + queryCmd);
        browser.tabs.query({mailTab: true}).then(tabs => {
            browser.mailTabs.setQuickFilter(tabs[0].id, {text: {text: queryCmd, body: true}});
        });
        return;
    }
    if (commandName === "s" ||
        commandName === "subject")
    {
        console.log("command SUBJECT: " + queryCmd);
        browser.tabs.query({mailTab: true}).then(tabs => {
            browser.mailTabs.setQuickFilter(tabs[0].id, {text: {text: queryCmd, subject: true}});
        });
        return;
    }
    if (commandName === "t" ||
        commandName === "tag")
    {
        console.log("command TAG: " + queryCmd);
        browser.tabs.query({mailTab: true}).then(tabs => {
            var tagFilter = {}
            var tagarray = queryCmd.split(" ");
            for (idx in tagarray) {
                console.log("Processing tag: " + tagarray[idx]);
                tagFilter[tagarray[idx]] = true;
            }
            var tagStr = JSON.stringify(tagFilter);
            console.log("Tag Filter: " + tagStr);
            browser.mailTabs.setQuickFilter(tabs[0].id, {tags: {tags: tagFilter, mode: "any"}});
        });
        return;
    }

}

var portFromCS;

// Handle the incoming connection from the popup script and dispatch based on the properties present
function connected(p) {
    console.log("Connected from content script");
    portFromCS = p;
    portFromCS.onMessage.addListener(function(m) {
        console.log(`Received a message ${m}`);
        if (m.hasOwnProperty("command")) {
            console.log(`Received a command: ${m.command}`);
            handleCommand(m.command);
        }
    });
}

function filterBySubject() {
    console.log("Filtering by subject on the main window");
    browser.tabs.query({mailTab: true}).then(tabs => {
        browser.mailTabs.getSelectedMessages(tabs[0].id).then(messages => {
            currMessage = messages.messages[0];
            browser.mailTabs.setQuickFilter(tabs[0].id, {text: {text: currMessage.subject, subject: true}});
        });
    });
}

function filterByAuthor() {
    console.log("Filtering by author on the main window");
    browser.tabs.query({mailTab: true}).then(tabs => {
        browser.mailTabs.getSelectedMessages(tabs[0].id).then(messages => {
            currMessage = messages.messages[0];
            browser.mailTabs.setQuickFilter(tabs[0].id, {text: {text: currMessage.author, author: true}});
        });
    });
}

function openSearchDialog() {
    console.log("Open the search dialog");
    browser.tabs.query({mailTab: true}).then(tabs => {
        browser.browserAction.enable(tabs[0].id);
    });
    browser.browserAction.openPopup();
}

browser.runtime.onConnect.addListener(connected);
browser.commands.onCommand.addListener(function (command) {
    if (command === "filterBySubject") {
        filterBySubject();
        return;
    }
    if (command === "filterByAuthor") {
        filterByAuthor();
        return;
    }
    if (command === "openSearchDialog") {
        openSearchDialog();
        return;
    }
    console.log("Unknown Command: " + command);
});
