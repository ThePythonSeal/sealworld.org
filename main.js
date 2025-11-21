window.onload = function () {
    const pages = {
        "ToolHTMLRenderer": "/tools/HTMLRenderer.html",
    };

    // sidebar
    const sidebarButtons = document.getElementsByClassName("SidebarButton");
    for (let i = 0; i < sidebarButtons.length; i++) {
        sidebarButtons[i].onclick = function () {
            document.getElementById("Tool").src = pages[sidebarButtons[i].id];
        };
    }

    // settings
    document.getElementById("SettingsOpenButton").onclick = function () {
        const tool = document.getElementById("Tool");
        tool.src = "/settings.html";
    };

    function updateSettings() {
        // apply settings to the main page
        if (settings.SettingsTitle)
            document.getElementById("Title").innerText = settings.SettingsTitle;

        if (settings.SettingsFavicon)
            document.getElementById("Favicon").href = settings.SettingsFavicon;
    }

    let settings = {}

    try {
        let saved = localStorage.getItem("settings");
        settings = saved ? JSON.parse(saved) : {};
    } catch(e) {};
    
    updateSettings();

    window.addEventListener("message", event => {
        if (!event.data || event.data.from !== "settingsIframe") return;

        // iframe requests initial values
        if (event.data.action === 0) {
            document.getElementById("Tool").contentWindow.postMessage({
                from: "main",
                action: 0,
                payload: settings
            }, "*");
        }

        // save (runtime)
        if (event.data.action === 1) {
            settings[event.data.type] = event.data.data;
            updateSettings();
        }

        // save (localstorage)
        if (event.data.action === 2) {
            settings[event.data.type] = event.data.data;
            localStorage.setItem("settings", JSON.stringify(settings)); // optional
            updateSettings();
        }
    });
};
