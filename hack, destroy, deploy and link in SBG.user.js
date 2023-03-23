// ==UserScript==
// @name         hack, destroy, deploy and link in SBG
// @namespace    http://tampermonkey.net/
// @version      0.7.0
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
    maxdepl[8]=[8,7,7,6,6,5];
    maxdepl[7]=[7,7,6,6,5,5];
    maxdepl[6]=[6,6,5,5,5,4];
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
    async function RepairAll(){
        const inv = JSON.parse(localStorage.getItem('inventory-cache'))
        inv.forEach(e => {
            if (e.t === 3){
                const json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: e.l },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                                     success: function(da)
                                     {
                                         if (da.data.te == 3){
                                             if (da.data.co.length < 6){
                                                 console.log('point ',da.data.t,' not full cores!');
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
                                                         console.log('point=',datarep.data.t,' xp=',datarep.data.xp.diff);
                                                     }
                                                 }
                                             });
                                         }
                                     }
                                    });
            }
        });
    }
    Object.defineProperty(Array.prototype, 'first', {
        value() {
            return this.find(Boolean)
        }
    })
    var WinPopup = document.querySelector(".popup-close, .popup-header");

    RefreshInv();
    function hideButt(){
        const buttId = ['link-tg','discover','deploy','draw','inventory-delete-section'];
        const buttCl = ['outer-link','deploy-slider-wrp'];
        buttId.forEach(e => {
            var b = document.getElementById(e);
            b.style.display = 'none';
        })
        buttCl.forEach(e => {
            var b = $(`.${e}`);
            b.css({ "display": "none"});
        })
    }

    async function QuickLink(){
        const guid = $('.info').attr('data-guid')
        var ldcoord = null;
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
                                         //console.log('#refs-list',ld.data);
                                         ld.data.sort((a, b) => getDist(a.g[1],ldcoord) - getDist(b.g[1],ldcoord)).forEach(e => {
                                             if (e.a >= 2 && getDist(e.g[1],ldcoord) <= 350){
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
                                                     headers: { authorization: `Bearer ${localStorage.getItem('auth')}` }
                                                 })

                                                 }
                                         })
                                     }
                                 })
                                 }
                            });
    }
    async function QuickLinkMax(){
        const guid = $('.info').attr('data-guid')
        var ldcoord = null;
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
                                         //console.log('#refs-list',ld.data);
                                         ld.data.sort((a, b) => getDist(a.g[1],ldcoord) - getDist(b.g[1],ldcoord)).slice(1, 17).forEach(e => {
                                             if (e.a >= 2){
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
                                                     headers: { authorization: `Bearer ${localStorage.getItem('auth')}` }
                                                 })

                                                 }
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
                                   maxdepl[lvl].forEach(e => {
                                       $.ajax({method: 'post',url: `/api/deploy`,
                                               data: {
                                                   guid: m_guid,
                                                   core: rz[e],
                                                   position: m_coord
                                               },
                                               headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                   });

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

                                    $.ajax({
                                        method: 'post',
                                        url: `/api/discover`,
                                        data: {
                                            guid: m6_guid,
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
    async function QuickAttack(){
        const a_guid = $('.info').attr('data-guid');
        var a_coord = null;
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
                                         guid:bm[6]
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
    document.querySelector('.i-buttons').appendChild(deployM6Butt);
    let deployM7Butt = document.createElement('button');
    deployM7Butt.innerText = 'Max-7';
    deployM7Butt.addEventListener('click', event => {
        QuickDeployMax(7);
    });
    document.querySelector('.i-buttons').appendChild(deployM7Butt);
    let deployM8Butt = document.createElement('button');
    deployM8Butt.innerText = 'Max-8';
    deployM8Butt.addEventListener('click', event => {
        QuickDeployMax(8);
    });
    document.querySelector('.i-buttons').appendChild(deployM8Butt);

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

    hideButt();

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
            QuickAttack();
        }
        else if (event.key === 'q' || event.code === 'q'){
            QuickLink();
        }
        else if (event.key === 'h' || event.code === 'h') {
            QuickHack();
        }
        else if (event.key === 'd' || event.code === 'd') {
            const d_guid = $('.info').attr('data-guid');
            var d_coord = null;
            const cList = [
                rz[1]//'3570eb2838ed.67f',
                ,rz[2]//'1b5a37f57de5.67f',
                ,rz[3]//'4af4b7210b34.67f',
                ,rz[4]//'c0032be939b6.67f',
            ]
            let cSize= cList.length;

            const d_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: d_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                                   success: function(data)
                                   {
                                       d_coord = data.data.c;

                                       $.ajax({method: 'post',url: `/api/deploy`,
                                               data: {
                                                   guid: d_guid,
                                                   core: rz[7],
                                                   position: d_coord
                                               },
                                               headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                       $.ajax({method: 'post',url: `/api/deploy`,
                                               data: {
                                                   guid: d_guid,
                                                   core: rz[6],
                                                   position: d_coord
                                               },
                                               headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});

                                       for (var ci=2;ci < 6;ci++){
                                           let cGuid = cList[Math.floor(Math.random()*cSize)];
                                           $.ajax({method: 'post',url: `/api/deploy`,
                                                   data: {
                                                       guid: d_guid,
                                                       core: cGuid,
                                                       position: d_coord
                                                   },
                                                   headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                       }


                                       $.ajax({
                                           method: 'post',
                                           url: `/api/discover`,
                                           data: {
                                               guid: d_guid,
                                               position: d_coord
                                           },
                                           headers: {
                                               authorization: `Bearer ${localStorage.getItem('auth')}`
                                       }
                                       });

                                   }
                                  });
            var d_Win = document.querySelector(".popup-close, .popup-header");
            d_Win.click();
        }
        else if (event.key === 'm' || event.code === 'm') {
            QuickDeployMax();
        }
        else if (event.key === '2' || event.code === '2') {
            QuickDeployFull(2);
        }
        else if (event.key === '6' || event.code === '6') {
            QuickUpdate(6);
        }
        else if (event.key === '7' || event.code === '7') {
            QuickUpdate(7);
        }

    });

})();