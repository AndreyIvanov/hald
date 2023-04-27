// ==UserScript==
// @name         Statistics SBG
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://3d.sytes.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sytes.net
// @downloadURL  https://github.com/AndreyIvanov/hald/raw/main/Statistics%20SBG.user.js
// @updateURL    https://github.com/AndreyIvanov/hald/raw/main/Statistics%20SBG.user.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';
    async function GetStatistic(username){
        var now = new Date();
        const self_data_req = $.ajax('/api/profile', {
            method: 'get',data: { name: username },
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth')}`
        },
            success: function(self_data){
                console.log(self_data);
                const data_req = $.ajax('https://script.google.com/macros/s/AKfycbyEh1_SaCUm4x_zPt5KMS6coyylAtcvs1QO8taI7OE/dev',
                                        {
                    method: 'get',
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    dataType: "jsonp",
                    contentType: "application/json",
                    data: {dt:now, d: JSON.stringify(self_data.data)},
                    success:function(rq){
                        console.log('docs answer=',rq);
                    }

                });
            }
        });

    }
    let rgButt = document.createElement('button');
    rgButt.innerText = 'Stat G';
    rgButt.addEventListener('click', event => {
        const pList = [
            'Antman55',
            'Mozg',
            'ilstransco',
            'rovniy84',
            'VTEC55',
            'retty8',
            'D1MS',
            'LaasEnl',
        ];
        pList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach

    });
    document.querySelector('.inventory__controls').appendChild(rgButt);
    let rbButt = document.createElement('button');
    rbButt.innerText = 'Stat B';
    rbButt.addEventListener('click', event => {
        const pList = [
            'Shkidlyak',
            'aai79',
            'uriy2',
            'Lubom',
            'Crazy',
            'AliceSynthesis',
            'Satanic'
        ];
        pList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach

    });
    document.querySelector('.inventory__controls').appendChild(rbButt);
    let rrButt = document.createElement('button');
    rrButt.innerText = 'Stat R';
    rrButt.addEventListener('click', event => {
        const pList = [
            /*'Gost00', helicopter*/
            'XmPeakHigh',
        ];
        pList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach

    });
    document.querySelector('.inventory__controls').appendChild(rrButt);
    const apList=[
        'aai79',
        'AliceSynthesis',
        'Antman55',
        'Crazy',
        'D1MS',
        /*'Gost00', helicopter*/
        'ilstransco',
        'LaasEnl',
        'Lubom',
        'Mozg',
        'retty8',
        'rovniy84',
        'Satanic',
        'Shkidlyak',
        'uriy2',
        'VTEC55',
        'XmPeakHigh'
    ];
    var timers = null;
    clearInterval(timers)
    timers = setInterval(() => {
        apList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach
        var now = new Date();
        console.log('Execution datetime=', now);
    }, 1000*60*10)

})();