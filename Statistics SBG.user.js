// ==UserScript==
// @name         Statistics SBG
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://3d.sytes.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sytes.net
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, ol */

(function() {
    'use strict';

    let rButt = document.createElement('button');
    rButt.innerText = 'Sendstat';
    rButt.addEventListener('click', event => {
        const pList = [
            'Shkidlyak',
            'aai79',
            'Antman55',
            'Mozg',
            'ilstransco',
            'rovniy84',
            'VTEC55',
            'retty8',
            'D1MS',
            'uriy2',
            'XmPeakHigh',
            'LaasEnl',
            'Lubom',
            'Crazy'
        ];
        pList.forEach(e => {
            const self_data_req = $.ajax('/api/profile', {
                method: 'get',data: { name: e },
                headers: {
                    authorization: `Bearer ${localStorage.getItem('auth')}`
        },
                success: function(self_data){
                    console.log(self_data);
                    var now = new Date();
                    const data_req = $.ajax('https://script.google.com/macros/s/AKfycbyEh1_SaCUm4x_zPt5KMS6coyylAtcvs1QO8taI7OE/dev',
                                            {
                        method: 'get',
                        xhrFields: { withCredentials: true },
                        crossDomain: true,
                        dataType: "jsonp",
                        contentType: "application/json",
                        data: {dt:now, d: JSON.stringify(self_data.data)},

                    });
                }
            });
        });//endforeach

    });
    document.querySelector('.inventory__controls').appendChild(rButt);
})();