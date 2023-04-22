// ==UserScript==
// @name         Statistics SBG
// @namespace    http://tampermonkey.net/
// @version      0.2
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
                const data_req = $.ajax('https://script.google.com/macros/s/AKfycbzj-Jd6HpHCIMbl10Gtf8sfjdaUR_LcQ46RC96Xj7Svlt2sKq3HesKK8hl3v-hoeeBm/exec',
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
        pList.forEach(e => {
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
            'Crazy'
        ];
        pList.forEach(e => {
            GetStatistic(e);
        });//endforeach

    });
    document.querySelector('.inventory__controls').appendChild(rbButt);
})();