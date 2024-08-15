// ==UserScript==
// @name         Statistics SBG
// @namespace    http://tampermonkey.net/
// @version      0.7.10
// @description  try to take over the world!
// @author       You
// @match        https://sbg-game.ru/app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sytes.net
// @downloadURL  https://github.com/AndreyIvanov/hald/raw/main/Statistics%20SBG.user.js
// @updateURL    https://github.com/AndreyIvanov/hald/raw/main/Statistics%20SBG.user.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';

    function createToast(text = '', position = 'top left', container = null) {
        let parts = position.split(/\s+/);
        let toast = Toastify({
            text,
            duration: 6000,
            gravity: parts[0],
            position: parts[1],
            escapeMarkup: false,
            className: 'interaction-toast',
            selector: container,
        });
        toast.options.id = Math.round(Math.random() * 1e5);;
        toast.options.onClick = () => toast.hideToast();
        return toast;
    }

    async function GetStatistic(username){
        const self_data_req = $.ajax('/api/profile', {
            method: 'get',data: { name: username },
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth')}`
        },
            success: function(self_data){
                console.log(self_data);
                var message =`<br><span>Данные <b>${username}</b> собраны</span><br><span>Идет отправка в google sheet</span>`;
                let toast = createToast(`Сбор статистики: ${message}`);
                toast.showToast();

                const data_req = $.ajax('https://script.google.com/macros/s/AKfycbyEh1_SaCUm4x_zPt5KMS6coyylAtcvs1QO8taI7OE/dev',
                                        {

                    headers: {
                        Accept : "application/json; charset=utf-8",
                        "Content-Type": "text/plain; charset=utf-8"
                    },
                    method: 'get',
                    /*xhrFields: { withCredentials: true },*/
                    crossDomain: true,
                    dataType: "jsonp",
                    followRedirects: true,
                    muteHttpExceptions: true,
                    contentType: "application/json",
                    data: {d: JSON.stringify(self_data)},
                    success:function(rq){
                        console.log('docs answer=',rq);
                    }

                });
            }
        });

    }
    let rgButt = document.createElement('button');
    rgButt.innerText = 'Стата зеленых';
    rgButt.addEventListener('click', event => {
        const pList = [
            '55Vadim',
            'Antman55',
            'Mozg',
            'ilstransco',
            'iLYaMASU',
            'rovniy84',
            'VTEC55',
            'retty8',
            'D1MS',
            'LaasEnl',
            'Lev555',
            'Sneghana',
            'RINZLER'
        ];
        pList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach

    });
    document.querySelector('.self-info').appendChild(rgButt);
    let rbButt = document.createElement('button');
    rbButt.innerText = 'Стата синих';
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
    document.querySelector('.self-info').appendChild(rbButt);
    let rrButt = document.createElement('button');
    rrButt.innerText = 'Стата красных';
    rrButt.addEventListener('click', event => {
        const pList = [
            /*'Gost00', helicopter*/
            'CVRIM',
            'XmPeakHigh',
            'TemosCat',
            'yakuza',
            'spectra1979',
            'Yegger'
        ];
        pList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach

    });
    document.querySelector('.self-info').appendChild(rrButt);
    let descm = document.createElement('span');
    descm.innerText = '(stat)';
    document.querySelector('#self-info__explv').appendChild(descm);

    const apList=[
        '55Vadim',
        'aai79',
        'AliceSynthesis',
        'Antman55',
        'Crazy',
        'CVRIM',
        'D1MS',
        /*'Gost00', helicopter*/
        'Yegger',
        'ilstransco',
        'iLYaMASU',
        'LaasEnl',
        'Lev555',
        'Lubom',
        'Mozg',
        'retty8',
        'rovniy84',
        'Satanic',
        'Shkidlyak',
        'spectra1979',
        'Sneghana',
        'RINZLER',
        'TemosCat',
        'uriy2',
        'VTEC55',
        'XmPeakHigh',
        'yakuza'
    ];
    var timers = null;
    clearInterval(timers)
    timers = setInterval(() => {
        apList.sort().forEach(e => {
            GetStatistic(e);
        });//endforeach
        var now = new Date();
        console.log('Execution datetime=', now);
    }, 1000*60*12)

})();