function emitUpdate() {
    var event = new Event('Event');
    event.addEventListener('sw.update', function () {
        if (confirm("当前有新的更新，是否刷新？")) {
            try {
                navigator.serviceWorker.getRegistration().then(reg => {
                    reg.waiting.postMessage('skipWaiting');
                });
            } catch (e) {
                window.location.reload();
            }
        }
    }, true);
    window.dispatchEvent(event)
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (reg) {
        if (reg.waiting) {
            emitUpdate();
            return
        }

        reg.onupdatefound = function () {
            var installingWorker = reg.installing;
            installingWorker.onstatechange = function () {
                switch (installingWorker.state) {
                    case 'installed':
                        if (navigator.serviceWorker.controller) {
                            emitUpdate();
                        }
                        break;
                }
            }
        }
        reg.addEventListener("controllerchange", function(){
            console.log("then start")
            window.location.reload();
        })
        
    }).catch(function (e) {
        console.error("Error during service Worker registration:", e)
    });
    // navigator.serviceWorker.oncontrollerchange = function() {
    //     console.log("onchantrollerchange start")
    //     window.location.reload();
    // }
};

