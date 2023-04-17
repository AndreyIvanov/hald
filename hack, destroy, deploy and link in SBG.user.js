// ==UserScript==
// @name         hack, destroy, deploy and link in SBG
// @namespace    http://tampermonkey.net/
// @version      0.8.6
// @description  try to take over the world!
// @author       You
// @match        https://3d.sytes.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sytes.net
// @downloadURL  https://github.com/AndreyIvanov/hald/raw/main/hack%2C%20destroy%2C%20deploy%20and%20link%20in%20SBG.user.js
// @updateURL    https://github.com/AndreyIvanov/hald/raw/main/hack%2C%20destroy%2C%20deploy%20and%20link%20in%20SBG.user.js
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, ol */

(function() {
    'use strict';
    const rz = [];
    const bm = [];
    const maxdepl = [];
    maxdepl[10]=[10,9,8,7,7,6];
    maxdepl[9]=[9,8,7,7,6,6];
    maxdepl[8]=[8,7,7,6,6,5];
    maxdepl[7]=[7,7,6,6,5,5];
    maxdepl[6]=[6,6,5,5,5,4];
    const type_loot=[];
    type_loot[1]='core';
    type_loot[2]='bomb';

    const styleString = `
.ol-layer__lines {
    filter: opacity(.4);
}

.ol-layer__markers {
    filter: brightness(1.2);
}`

// adds filter styles to the canvas wrapper layers
    const AddStyles = () => {
        let style = document.createElement('style')
        document.head.appendChild(style)

        style.innerHTML = styleString
    }
    function autorepair(){
        setInterval(() => {
            const pList = [
                'a99f2ba9d03f.22a', //Барановский дедушка
                'afd8fbb3cfbf.22a', // дк баранова
                '6e5d75f21432.22a', // почта 644021
                '13c97ef6f456.22a', // граффити павлин
                'b96e19dfe998.22a', // граффити лотос
                '574f2c5fef75.22a', // церковь пробуждение
                '6155a7b227d7.22a', // ветераны вов
                '167da60f1251.22a', // туполев
                'd260071d38c0.22a', // памятник хмельницкому
                '07ed5058c679.22a', //  памятник героям труда
                '47c0aaf0f9e3.22a', // зеленый шар
                '4e57d7723b46.22a' // табличка резанову
            ];
            let pSize= pList.length; let pGuid = pList[Math.floor(Math.random()*pSize)];
            const jsonrep = $.ajax({
                method: 'post',
                url: `/api/repair`,
                data: {
                    guid: pGuid,
                    position: [0,0]
                },
                headers: {authorization: `Bearer ${localStorage.getItem('auth')}`},
                success: function(datarep)
                {
                    if (!datarep.error){
                        console.log('point=',datarep.data.t,' xp=',datarep.xp.diff);

                    }
                }
            });

        }
                    , 1000*60*1);
    }
    function RefreshInv(){
        const inv = JSON.parse(localStorage.getItem('inventory-cache'))
        inv.forEach(e => {
            if (e.t == 1){
                rz[e.l] = e.g
            }
            if (e.t == 2){
                bm[e.l] = e.g
            }
        })
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
                                                     console.log('point=',datarep.data.t,' xp=',datarep.xp.diff);
                                                     let message = `<br><span>${datarep.data.t}</span> ${datarep.xp.diff}xp`;
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

    RefreshInv();
    function hideButt(){
        const buttId = ['discover','deploy','draw','inventory-delete-section'];
        const buttCl = ['deploy-slider-wrp'];
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

    async function QuickLink(){
        const guid = $('.info').attr('data-guid')
        var ldcoord = null;
        let message = '';
        const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                             {
                                 ldcoord = data.data.c;
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
                                         WinPopup.click();
                                         localStorage.setItem('follow', false);
                                         console.log('q keys=',ld.data);
                                         console.log('q keys filter=',ld.data.filter(keys => (keys.a >= 2 && keys.d <= 350)));

                                         ld.data.filter(keys => (keys.a >= 2 && keys.d <= 350)).sort((a, b) => getDist(a.g[1],ldcoord) - getDist(b.g[1],ldcoord)).slice(0, 17).forEach(e => {
                                             //if (e.a >= 2 && getDist(e.g[1],ldcoord) <= 350){
                                             console.log(e.g);
                                             const d = getDist(e.g[1],ldcoord)
                                             console.log('pname=',e.t,' dist=',distToString(d));
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
                                                     message =`<br><span>${e.t}</span> link - ${distToString(d)} ${dd.xp.diff}xp`;
                                                     let toast = createToast(`Linked: ${message}`);
                                                     toast.showToast();
                                                 }
                                             })

                                             //}
                                             }) //endforeach

                                     }
                                 })
                                 }
                            });
    }
    async function QuickLinkMax(){
        const guid = $('.info').attr('data-guid')
        var ldcoord = null;
        let message = '';
        const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                             {
                                 ldcoord = data.data.c;
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
                                         WinPopup.click();
                                         localStorage.setItem('follow', false)
                                         console.log('max keys=',ld.data);
                                         console.log('max keys filter=',ld.data.filter(keys => (keys.a > 2 && keys.d > 350)));

                                         ld.data.filter(keys => (keys.a > 2 && keys.d > 350)).sort((a, b) => getDist(a.g[1],ldcoord) - getDist(b.g[1],ldcoord)).slice(0, 17).forEach(e => {
                                             //if (e.a >= 2 && getDist(e.g[1],ldcoord) > 350){
                                             console.log(e.g);
                                             const d = getDist(e.g[1],ldcoord)
                                             console.log('pname=',e.t,' dist=',distToString(d));
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
                                                     message =`<br><span>${e.t}</span> link - ${distToString(d)} ${dd.xp.diff}xp`;
                                                     let toast = createToast(`Linked: ${message}`);
                                                     toast.showToast();
                                                 }
                                             })

                                             //}
                                             })
                                     }
                                 })
                                 }
                            });
    }

    async function QuickHack(){
        const guid = $('.info').attr('data-guid');
        var coord = null;
        const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                             {
                                 coord = data.data.c;
                                 const d_discover = $.ajax({
                                     method: 'post',
                                     url: `/api/discover`,
                                     data: {
                                         position: coord,
                                         guid
                                     },
                                     headers: {
                                         authorization: `Bearer ${localStorage.getItem('auth')}`
                                       },
                                     success: function(disdata)
                                     {
                                         console.log('Hackdata=',disdata);
                                         let message = '';
                                         if (!disdata.error){
                                             let hackedloot = disdata.loot;
                                             hackedloot.forEach(e=>{
                                                 if (e.t !==3){
                                                     message += `<br><span>${type_loot[e.t]} </span>${e.l}lvl - ${e.a}`;
                                                 }
                                                 else {
                                                     message += `<br><span>keys</span> ${e.a}`;
                                                 }
                                             });
                                             message += `<br><span>EXP </span>${disdata.xp.diff}`;

                                             let toast = createToast(`Hacked: ${message}`);
                                             toast.showToast();
                                         }
                                         else
                                         {
                                             let toast = createToast(`Error: ${disdata.error}`);
                                             toast.showToast();
                                         }
                                     }
                                 });

                             }
                            });
        WinPopup.click();
    }
    async function QuickDeployMax(lvl){
        const m_guid = $('.info').attr('data-guid');
        var m_coord = null;

        const m_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: m_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                               success: function(data)
                               {
                                   m_coord = data.data.c;
                                   var cn = data.data.co.length;
                                   if (cn>0){
                                       for (var cni=cn;cni < 6;cni++){
                                           let cGuid = rz[3];
                                           $.ajax({method: 'post',url: `/api/deploy`,
                                                   data: {
                                                       guid: m_guid,
                                                       core: cGuid,
                                                       position: m_coord
                                                   },
                                                   headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                       }
                                   }
                                   else {

                                       maxdepl[lvl].forEach(e => {
                                           $.ajax({method: 'post',url: `/api/deploy`,
                                                   data: {
                                                       guid: m_guid,
                                                       core: rz[e],
                                                       position: m_coord
                                                   },
                                                   headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                       });
                                   }

                                   $.ajax({
                                       method: 'post',
                                       url: `/api/discover`,
                                       data: {
                                           guid: m_guid,
                                           position: m_coord
                                       },
                                       headers: {
                                           authorization: `Bearer ${localStorage.getItem('auth')}`
                                       }
                                   });

                               }
                              });
        WinPopup.click();
    }
    async function QuickDeployFull(lvl){
        const d2_guid = $('.info').attr('data-guid');
        var d2_coord = null;

        const d2_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: d2_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                                success: function(data)
                                {
                                    d2_coord = data.data.c;
                                    var cn = data.data.co.length;
                                    if (cn>0){
                                        for (var cni=cn;cni < 6;cni++){
                                            let cGuid = rz[3];
                                            $.ajax({method: 'post',url: `/api/deploy`,
                                                    data: {
                                                        guid: d2_guid,
                                                        core: cGuid,
                                                        position: d2_coord
                                                    },
                                                    headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                        }
                                    }
                                    else {

                                        for (var ci=0;ci < 6;ci++){
                                            let cGuid = rz[lvl];
                                            $.ajax({method: 'post',url: `/api/deploy`,
                                                    data: {
                                                        guid: d2_guid,
                                                        core: cGuid,
                                                        position: d2_coord
                                                    },
                                                    headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                        }
                                    }

                                    $.ajax({
                                        method: 'post',
                                        url: `/api/discover`,
                                        data: {
                                            guid: d2_guid,
                                            position: d2_coord
                                        },
                                        headers: {
                                            authorization: `Bearer ${localStorage.getItem('auth')}`
                                       }
                                    });

                                }
                               });
        WinPopup.click();
    }
    async function QuickUpdate(lvl){
        const m6_guid = $('.info').attr('data-guid');
        var m_coord = null;

        const m6_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: m6_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                                success: function(data)
                                {
                                    m_coord = data.data.c;
                                    $.ajax({method: 'post',url: `/api/deploy`,
                                            data: {
                                                guid: m6_guid,
                                                core: rz[lvl],
                                                position: m_coord,
                                                slot: $('.i-stat__core.selected').attr('data-guid')
                                            },
                                            headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                }
                               });
        WinPopup.click();
    }
    async function QuickAttack(){
        const self_data_req = $.ajax('/api/self', {
            method: 'get',
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth')}`
        },
            success: function(self_data){
                console.log(self_data);
                localStorage.setItem('user-lvl',self_data.l);
            }
        });

        const a_guid = $('.info').attr('data-guid');
        var a_coord = null;
        var b_lvl = localStorage.getItem('user-lvl');
        console.log("Bomb LVL=",b_lvl);
        const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: a_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                             {
                                 a_coord = data.data.c;
                                 const response = $.ajax({
                                     method: 'post',
                                     url: '/api/attack2',
                                     headers: {
                                         authorization: `Bearer ${localStorage.getItem('auth')}`,
                                         'content-type': 'application/json'
                                     },
                                     data: JSON.stringify({
                                         position: a_coord,
                                         guid:bm[b_lvl-1]
                                     })
                                 })
                                 }
                            });
        WinPopup.click();
    }
    let discoverButt = document.createElement('button');
    discoverButt.innerText = 'Hack';
    discoverButt.addEventListener('click', event => {
        QuickHack();
    });
    document.querySelector('.i-buttons').appendChild(discoverButt);
    let attackButt = document.createElement('button');
    attackButt.innerText = 'Attack';
    attackButt.addEventListener('click', event => {
        QuickAttack();
    });
    document.querySelector('.i-buttons').appendChild(attackButt);
    /*
    let deployRButt = document.createElement('button');
    deployRButt.innerText = 'DRnd';
    deployRButt.addEventListener('click', event => {
        alert('DeployRnd');
    });
    document.querySelector('.i-buttons').appendChild(deployRButt);
*/
    let deployM6Butt = document.createElement('button');
    deployM6Butt.innerText = 'Max-6';
    deployM6Butt.addEventListener('click', event => {
        QuickDeployMax(6);
    });
    //document.querySelector('.i-buttons').appendChild(deployM6Butt);
    let deployM7Butt = document.createElement('button');
    deployM7Butt.innerText = 'Max-7';
    deployM7Butt.addEventListener('click', event => {
        QuickDeployMax(7);
    });
    //document.querySelector('.i-buttons').appendChild(deployM7Butt);
    let deployM8Butt = document.createElement('button');
    deployM8Butt.innerText = 'Max-8';
    deployM8Butt.addEventListener('click', event => {
        QuickDeployMax(8);
    });
    //document.querySelector('.i-buttons').appendChild(deployM8Butt);

    let deployMButt = document.createElement('button');
    deployMButt.innerText = 'Max';
    deployMButt.addEventListener('click', event => {

        const self_data_req = $.ajax('/api/self', {
            method: 'get',
            headers: {
                authorization: `Bearer ${localStorage.getItem('auth')}`
        },
            success: function(self_data){
                console.log(self_data);
                localStorage.setItem('user-lvl',self_data.l);
            }
        });

        const a_guid = $('.info').attr('data-guid');
        var a_coord = null;
        var b_lvl = localStorage.getItem('user-lvl');
        console.log("LVL=",b_lvl);

        QuickDeployMax(b_lvl);
    });
    document.querySelector('.i-buttons').appendChild(deployMButt);

    let deploy1Butt = document.createElement('button');
    deploy1Butt.innerText = 'Full-1';
    deploy1Butt.addEventListener('click', event => {
        QuickDeployFull(1);
    });
    document.querySelector('.i-buttons').appendChild(deploy1Butt);
    let deploy2Butt = document.createElement('button');
    deploy2Butt.innerText = 'Full-2';
    deploy2Butt.addEventListener('click', event => {
        QuickDeployFull(2);
    });
    document.querySelector('.i-buttons').appendChild(deploy2Butt);
    let deploy3Butt = document.createElement('button');
    deploy3Butt.innerText = 'Full-3';
    deploy3Butt.addEventListener('click', event => {
        QuickDeployFull(3);
    });
    document.querySelector('.i-buttons').appendChild(deploy3Butt);

    let update6Butt = document.createElement('button');
    update6Butt.innerText = 'Upd-6';
    update6Butt.addEventListener('click', event => {
        QuickUpdate(6);
    });
    document.querySelector('.i-buttons').appendChild(update6Butt);
    let update7Butt = document.createElement('button');
    update7Butt.innerText = 'Upd-7';
    update7Butt.addEventListener('click', event => {
        QuickUpdate(7);
    });
    document.querySelector('.i-buttons').appendChild(update7Butt);
    let update8Butt = document.createElement('button');
    update8Butt.innerText = 'Upd-8';
    update8Butt.addEventListener('click', event => {
        QuickUpdate(8);
    });
    document.querySelector('.i-buttons').appendChild(update8Butt);
    let update9Butt = document.createElement('button');
    update9Butt.innerText = 'Upd-9';
    update9Butt.addEventListener('click', event => {
        QuickUpdate(9);
    });
    document.querySelector('.i-buttons').appendChild(update9Butt);

    let linkButt = document.createElement('button');
    linkButt.innerText = 'QLink';
    linkButt.addEventListener('click', event => {
        QuickLink();
    });
    document.querySelector('.i-buttons').appendChild(linkButt);

    let linkMaxButt = document.createElement('button');
    linkMaxButt.innerText = 'QLinkMax';
    linkMaxButt.addEventListener('click', event => {
        QuickLinkMax();
    });
    document.querySelector('.i-buttons').appendChild(linkMaxButt);

    let repairButt = document.createElement('button');
    repairButt.innerText = 'RepairAll';
    repairButt.addEventListener('click', event => {
        RepairAll();
    });
    document.querySelector('.inventory__controls').appendChild(repairButt);


    var pImgBox = document.getElementById("i-image");
    pImgBox.style.minHeight = '35px';
    $('.i-image-box').css({ "min-height": "150px"});
    function getDist(to, from) {
        const line = new ol.geom.LineString([ol.proj.fromLonLat(from), ol.proj.fromLonLat(to)])
        return ol.sphere.getLength(line)
    }
    function distToString(distance) {
        const formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
        if (distance < 0) return `${formatter.format(distance * 100)} cm`
        else if (distance < 1000) return `${formatter.format(distance)} m`
        else return `${formatter.format(distance / 1000)} km`
    }
    //document.querySelector("*, .popup").style.fontSize = "small";
    document.addEventListener('keydown', function (event) {

        if (event.key === 'a' || event.code === 'a') {
            //QuickAttack();
        }
        else if (event.key === 'q' || event.code === 'q'){
            //QuickLink();
        }

    });

})();