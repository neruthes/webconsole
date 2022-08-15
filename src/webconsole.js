window.addEventListener('load', function () {
    window.wconsole = {
        _data: {
            logArr: []
        }
    };
    wconsole.log = function (textAreaValue, logContent) {
        const logstr = logContent.toString();
        wconsole._data.logArr.push({
            ts: Date.now(),
            rawCmd: textAreaValue,
            type: typeof (logContent),
            state: 'ok',
            str: logstr
        });
        wconsole.rerenderLogList();
    };
    wconsole.error = function (textAreaValue, logContent) {
        const logstr = logContent.toString();
        wconsole._data.logArr.push({
            ts: Date.now(),
            rawCmd: textAreaValue,
            type: typeof (logContent),
            state: 'err',
            str: logstr
        });
        wconsole.rerenderLogList();
    };
    wconsole.rerenderLogList = function () {
        document.querySelector('#wcLogList').innerHTML = wconsole._data.logArr.map(function (logObj) {
            return `<div class="wcLogList-logItem" data-logitem-state="${logObj.state}">
                <div class="wcLogList-logItem-header">
                    <span class="wcLogList-logItem-header-date">${(new Date(logObj.ts)).toISOString().slice(0, 19).replace('T', ' ')}</span>
                    <span class="wcLogList-logItem-header-type">[${logObj.type}]</span>
                </div>
                <div class="wcLogList-logItem-rawcmd">
                    ${logObj.rawCmd}
                </div>
                <div class="wcLogList-logItem-content">
                    ${logObj.str}
                </div>
            </div>`;
        }).join('');
    };

    document.querySelector('#WebConsole').innerHTML = `<div id="wcContainer">
        <div id="wcLogList">
        </div>
        <div id="wcInputRegion">
            <textarea id="wcInputRegion-textarea" placeholder="Type a command here..."></textarea>
        </div>
    </div>`;

    document.querySelector('#wcInputRegion-textarea').addEventListener('input', function (e) {
        if (e.inputType === 'insertLineBreak') {
            // User input: LF
            const textAreaValue = e.target.value;
            e.target.value = '';
            try {
                wconsole.log(textAreaValue, eval(textAreaValue));
            } catch (err) {
                wconsole.error(textAreaValue, err === undefined ? '<undefined>' : err);
            }
        }
    });

    wconsole.log('Hello world!', 'Hello world!');
});
