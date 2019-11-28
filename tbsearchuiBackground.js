///////////////////////////////////////////////////////////////////////////
// Addon background script, it's a long running script which scan the    //
// bookmarks, learn the commands and then serve the requests coming from //
// the user                                                              //
///////////////////////////////////////////////////////////////////////////
console.log("Init background script");

// Routine to handle a command coming from the content script invoked in the popup
function handleCommand(text) {
    console.log(`Handle command: ${text}`);
    var commandName = text.split(" ", 1)[0];
    var queryCmd = text.slice(commandName.length + 1, text.length);
    // var urlData = commandDb[commandName];
    // if (urlData === undefined) {
    //     var candidates = [];
    //     for (var commandKey in commandDb) {
    //         if (commandKey.lastIndexOf(commandName, 0) === 0) {
    //             candidates.push(commandKey);
    //         }
    //     }
    //     if (candidates.length === 1) {
    //         console.log("Found unambigous closest candidate: " + candidates[0]);
    //         urlData = commandDb[candidates[0]];
    //     }
    // }
    // if (urlData === undefined) {
    //     if (text.indexOf(':') !== -1) {
    //         browser.tabs.create({"url": text});
    //     } else {
    //     }
    // } else {
    //     var urlToOpen = urlData['url'];
    //     if (urlToOpen !== undefined) {
    //         var urlWithQuery = urlToOpen.replace("{QUERY}", queryCmd);
    //         urlWithQuery = urlWithQuery.replace("%7BQUERY%7D", queryCmd);
    //         browser.tabs.create({"url": urlWithQuery});
    //     }
    //     var funcToExec = urlData['func'];
    //     if (funcToExec) {
    //         funcToExec();
    //     }
    // }
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

browser.runtime.onConnect.addListener(connected);
browser.commands.onCommand.addListener(function (command) {
    if (command === "searchOnField") {
        console.log("searchOnField command received");
    }
});
