// ==UserScript==
// @name         SimpleUI SBG
// @namespace    http://tampermonkey.net/
// @version      0.0.10
// @description  Облегчение жизни оленеводу SBG!
// @author       WhiteHacker
// @match        https://sbg-game.ru/app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sytes.net
// @downloadURL  https://github.com/AndreyIvanov/hald/raw/main/SimpleUI%20SBG.user.js
// @updateURL    https://github.com/AndreyIvanov/hald/raw/main/SimpleUI%20SBG.user.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

(function() {
    'use strict';

    const styleString = `
.ol-layer__markers {
    filter: brightness(1.2);
}`

// adds filter styles to the canvas wrapper layers
    const AddStyles = () => {
        let style = document.createElement('style')
        document.head.appendChild(style)

        style.innerHTML = styleString
    }
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


    async function RepairAll(){
        const self_data_req = $.ajax('/api/self', {
            method: 'get',
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth')}`
        },
            success: function(self_data){
                console.log(self_data);
                localStorage.setItem('user-team',self_data.t);
                localStorage.setItem('user-lvl',self_data.l);
            }
        });
        const inv = JSON.parse(localStorage.getItem('inventory-cache'))
        inv.filter(item => item.t === 3).forEach(e => {
            const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: e.l },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                                 success: function(da)
                                 {
                                     //console.log(localStorage.getItem('user-team'));
                                     if (da.data.te == localStorage.getItem('user-team')){
                                         if (da.data.co.length < 6){
                                             console.log('point ',da.data.t,' not full cores!');
                                         }
                                         if (da.data.co.length > 6){
                                             console.log(`point ${da.data.t} ${da.data.co.length} cores!`);
                                         }
                                         const jsonrep = $.ajax({
                                             method: 'post',
                                             url: `/api/repair`,
                                             data: {
                                                 guid: e.l,
                                                 position: [0,0]
                                             },
                                             headers: {authorization: `Bearer ${localStorage.getItem('auth')}`},
                                             success: function(datarep)
                                             {
                                                 if (!datarep.error){
                                                     console.log('point=',da.data.t,' xp=',datarep.xp.diff);
                                                     let message = `<br><span>${da.data.t}</span> ${datarep.xp.diff}xp`;
                                                     let toast = createToast(`Repair: ${message}`);
                                                     toast.showToast();

                                                 }
                                             }
                                         });
                                     }
                                 }
                                });
        });

    }
    Object.defineProperty(Array.prototype, 'first', {
        value() {
            return this.find(Boolean)
        }
    })
    var WinPopup = $('.popup-close');

    function hideButt(){
        const buttId = [];
        const buttCl = [];
        buttId.forEach(e => {
            var b = document.getElementById(e);
            b.style.display = 'none';
        })
        buttCl.forEach(e => {
            var b = $(`.${e}`);
            b.css({ "display": "none"});
        })
    }
    window.addEventListener('load', async function () {
        AddStyles();
        hideButt();
    }, false)

    async function QuickLinkMax(){
        const guid = $('.info').attr('data-guid')
        var ldcoord = null;
        var cout = 0;
        let message = '';
        const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                             {
                                 ldcoord = data.data.c;
                                 cout = data.data.li.o;
                                 const ldjson = $.ajax({
                                     method: 'get',
                                     url: '/api/draw',
                                     data: {
                                         guid,
                                         position: ldcoord
                                     },
                                     headers: { authorization: `Bearer ${localStorage.getItem('auth')}` },
                                     success: function(ld)
                                     {
                                         localStorage.setItem('follow', false)
                                         if (ld.data == undefined){
                                             WinPopup.click();
                                             message =`<br><span>Нет возможных ключей для линковки</span>`;
                                             let toast = createToast(`Внимание: ${message}`);
                                             toast.showToast();
                                             return;
                                         } else {

                                             console.log('max keys=',ld.data);
                                             console.log('max keys filter=',ld.data.filter(keys => (keys.a > 2)));
                                             if (ld.data.filter(keys => (keys.a > 2)).length == 0)
                                             {
                                                 WinPopup.click();
                                             }
                                             if (ld.data.filter(keys => (keys.a > 2)).length == 0){
                                                 message =`<br><span>Слишком мало ключей для оленеводства</span><br><span>Должно быть больше 2-х</span>`;
                                                 let toast = createToast(`Внимание: ${message}`);
                                                 toast.showToast();
                                             }
                                         }
                                         ld.data.filter(keys => (keys.a > 2)).slice(0, 20 - cout).slice(0,1).forEach(e => {
                                             console.log(e.g);
                                             const from = guid
                                             const to = e.p
                                             const cofrom = e.g[0]

                                             const json = $.ajax({
                                                 method: 'post',
                                                 url: '/api/draw',
                                                 data: {
                                                     from, to,
                                                     position: cofrom
                                                 },
                                                 headers: { authorization: `Bearer ${localStorage.getItem('auth')}` },
                                                 success:function(dd){
                                                     console.log('drawdata=',dd);
                                                     message =`<br><span>${e.t}</span> link ${dd.xp.diff}xp`;
                                                     let toast = createToast(`Linked: ${message}`);
                                                     toast.showToast();
                                                 }
                                             })

                                             })
                                     }
                                 })
                                 }
                            });
    }


    let repairButt = document.createElement('button');
    repairButt.innerText = 'Зарядить все что есть';
    repairButt.addEventListener('click', event => {
        RepairAll();
    });
    document.querySelector('.inventory__controls').appendChild(repairButt);

    if (document.querySelector('script[src="/script.js"]')) {
        let linkMaxButt = document.createElement('button');
        linkMaxButt.innerText = 'Наоленить во все ключи';
        linkMaxButt.setAttribute('id','linkMaxButt');
        linkMaxButt.addEventListener('click', event => {
            QuickLinkMax();
        });
        document.querySelector('.i-buttons').appendChild(linkMaxButt);
    }

    var pImgBox = document.getElementById("i-image");
    pImgBox.style.minHeight = '35px';
    $('.i-image-box').css({ "min-height": "150px"});
    if (document.querySelector('script[src="/script.js"]')) {
        var timers = null;
        clearInterval(timers)
        timers = setInterval(() => {
            $('#linkMaxButt').prop('disabled',$('#draw').prop('disabled'));
        }, 100);
    }

})();