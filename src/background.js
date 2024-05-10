chrome.runtime.onInstalled.addListener(function() {
    // Create a context menu for text selection
    chrome.contextMenus.create({
      id: "lookupCPU",
      title: "Lookup CPU Information",
      contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "lookupCPU" && tab.id) {
        const cpuName = info.selectionText.trim();
        fetchCPUData(cpuName, tab.id);
    }
});

async function fetchCPUData(cpuName, tabId) {
    try {
        const responses = await Promise.all([
            fetch('CPU_UserBenchmarks.json'),
            fetch('cpu_passmark.json')
        ]);

        const [userBenchmarks, passMark] = await Promise.all(responses.map(res => res.json()));
        const cpuInfoUserBenchmark = userBenchmarks.find(cpu => cpu.Model === cpuName);
        const cpuInfoPassMark = passMark.find(cpu => cpu['CPU Name'].includes(cpuName));

        let message = '';

        if (cpuInfoPassMark) {
            message += `CPU Name: ${cpuInfoPassMark['CPU Name']}\nCPU Mark: ${cpuInfoPassMark['CPU Mark']}\nRank: ${cpuInfoPassMark['Rank']}\nCPU Value: ${cpuInfoPassMark['CPU Value']}\nPrice: ${cpuInfoPassMark['Price(USD)']}`;
        }
        if (cpuInfoUserBenchmark) {
            message += `Model: ${cpuInfoUserBenchmark.Model}\nRank: ${cpuInfoUserBenchmark.Rank}\nBenchmark: ${cpuInfoUserBenchmark.Benchmark}\nMore Info: ${cpuInfoUserBenchmark.URL}\n\n`;
        }
        if (!cpuInfoUserBenchmark && !cpuInfoPassMark) {
            message = "No information found for selected CPU.";
        }

        chrome.scripting.executeScript({
            target: {tabId: tabId},
            function: showAlert,
            args: [message]
        });

    } catch (error) {
        console.error('Error fetching or processing data:', error);
    }
}

function showAlert(message) {
    alert(message);
}
