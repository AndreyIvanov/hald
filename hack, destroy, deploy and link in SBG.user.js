// ==UserScript==
// @name         hack, destroy, deploy and link in SBG
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  try to take over the world!
// @author       You
// @match        https://3d.sytes.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sytes.net
// @grant        none
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements, ol */

(function() {
    'use strict';
    const rz = [];
    const bm = [];
    const inv = JSON.parse(localStorage.getItem('inventory-cache'))
    inv.forEach(e => {
        if (e.t == 1){
            rz[e.l] = e.g
        }
        if (e.t == 2){
            bm[e.l] = e.g
        }
    })


var pImg = document.getElementById("i-image");
pImg.style.minHeight = '35px';
    function getDist(to, from) {
        const line = new ol.geom.LineString([ol.proj.fromLonLat(from), ol.proj.fromLonLat(to)])
//        console.info("Line=",ol.sphere.getLength(line));
        return ol.sphere.getLength(line)
    }
    function distToString(distance) {
        const formatter = new Intl.NumberFormat('en', { maximumFractionDigits: 2 })
        if (distance < 0) return `${formatter.format(distance * 100)} cm`
        else if (distance < 1000) return `${formatter.format(distance)} m`
        else return `${formatter.format(distance / 1000)} km`
    }
document.querySelector("*, .popup").style.fontSize = "small";
document.addEventListener('keydown', function (event) {

      if (event.key === 'a' || event.code === 'a') {
          /*var discover = document.getElementById("discover");
          discover.removeAttribute('disabled');
          discover.click();
          var infoWin = document.querySelector(".popup-close, .popup-header");
          infoWin.click();
          */
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
                                           guid:bm[7]
                                       })
                                   })
                                   }
                              });
          }
      else if (event.key === 'q' || event.code === 'q'){
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
                var ld_Win = document.querySelector(".popup-close, .popup-header");
                ld_Win.click();
                localStorage.setItem('follow', false)
                //console.log('#refs-list',ld.data);
                ld.data.sort((a, b) => getDist(a.g[1],ldcoord) - getDist(b.g[1],ldcoord)).forEach(e => {
                    if (e.a >= 2 && getDist(e.g[1],ldcoord) <= 350){
                        console.log(e.g);
                        const d = getDist(e.g[1],ldcoord)
                        console.log('pname=',e.t,' dist=',distToString(d));
                        console.log('from=',guid,' to=',e.p,' coo=',e.g[0]);
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
      else if (event.key === 'h' || event.code === 'h') {
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
                                       }
                                   });

                               }
                              });
          var h_Win = document.querySelector(".popup-close, .popup-header");
          h_Win.click();
      }
      else if (event.key === 'd' || event.code === 'd') {
          const d_guid = $('.info').attr('data-guid');
          var d_coord = null;
          const cList = [
              rz[1]//'3570eb2838ed.67f',
              ,rz[2]//'1b5a37f57de5.67f',
              ,rz[3]//'4af4b7210b34.67f',
              ,rz[4]//'c0032be939b6.67f',
              ,rz[5]//'af50c1c0fdfd.67f'
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
          const m_guid = $('.info').attr('data-guid');
          var m_coord = null;

          const m_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: m_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                               {
                                   m_coord = data.data.c;
                                   //7.2
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m_guid,
                                               core: rz[7],
                                               position: m_coord
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m_guid,
                                               core: rz[7],
                                               position: m_coord
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                   //6.2
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m_guid,
                                               core: rz[6],
                                               position: m_coord
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m_guid,
                                               core: rz[6],
                                               position: m_coord
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                   //5.3 - 5.2
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m_guid,
                                               core: rz[5],
                                               position: m_coord
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m_guid,
                                               core: rz[5],
                                               position: m_coord
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});

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
          var m_Win = document.querySelector(".popup-close, .popup-header");
          m_Win.click();
      }
      else if (event.key === '2' || event.code === '2') {
          const d2_guid = $('.info').attr('data-guid');
          var d2_coord = null;

          const d2_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: d2_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                               {
                                   d2_coord = data.data.c;

                                   for (var ci=0;ci < 6;ci++){
                                       let cGuid = rz[2];
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
          var d2_Win = document.querySelector(".popup-close, .popup-header");
          d2_Win.click();
      }
      else if (event.key === '6' || event.code === '6') {
          const m6_guid = $('.info').attr('data-guid');
          var m6_coord = null;

          const m6_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: m6_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                               {
                                   m6_coord = data.data.c;
                                   //6
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m6_guid,
                                               core: rz[6],
                                               position: m6_coord,
                                               slot: $('.i-stat__core.selected').attr('data-guid')
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});

                               }
                              });
      }
      else if (event.key === '7' || event.code === '7') {
          const m7_guid = $('.info').attr('data-guid');
          var m7_coord = null;

          const m7_json = $.ajax({ method: 'get', url: `/api/point`, data: { guid: m7_guid },headers: {authorization: `Bearer ${localStorage.getItem('auth')}` },
                             success: function(data)
                               {
                                   m7_coord = data.data.c;
                                   //7
                                   $.ajax({method: 'post',url: `/api/deploy`,
                                           data: {
                                               guid: m7_guid,
                                               core: rz[7],
                                               position: m7_coord,
                                               slot: $('.i-stat__core.selected').attr('data-guid')
                                           },
                                           headers: {authorization: `Bearer ${localStorage.getItem('auth')}` }});

                               }
                              });
      }

});

})();