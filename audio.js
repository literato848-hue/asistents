// audio.js - simplified version without video

// audio.js - versija ar dažādiem variantiem

class AudioManager {
    constructor() {
        this.currentKadril = null;
        this.mainAudio = document.getElementById('mainAudio');
        this._captionInterval = null;
        this.activeFragment = null;
        this.selectedVariant = null; // JAUNS: saglabā izvēlēto variantu
        this.wasPlaying = false;
        
        // Definējam vadības komandas
        this.controlCommands = {
            stop: ['stop', 'apstāties', 'beidz', 'beigt', 'pietiek', 'pārtrauc'],
            pause: ['pauze', 'pauzt', 'nopauzē', 'nopauzēt', 'pagaidi'],
            resume: ['turpini', 'turpināt', 'atsākt', 'atsāc']
        };
        
        // Definējam wake word audio atbildes
        this.wakeWords = {
            'mark': [
                {
                    audio: 'MUSIC/voice_responses/patiuzmaniba.mp3',
                    text: 'Esmu pati uzmanība!'
                },
                {
                    audio: 'MUSIC/voice_responses/gatavsdarbam.mp3',
                    text: 'Gatavs darbam!'
                },
                {
                    audio: 'MUSIC/voice_responses/uzmanigiklausos.mp3',
                    text: 'Uzmanīgi klausos'
                },
                {
                    audio: 'MUSIC/voice_responses/vienmergatavs.mp3',
                    text: 'Vienmēr gatavs'
                },
                {
                    audio: 'MUSIC/voice_responses/kavarupalidzet.mp3',
                    text: 'Labdien!'
                }
            ],
            'aivariņ': {
                audio: 'AUDIO/responses/adi_response.mp3',
                text: 'Klausos!'
            },
            'markus': {
                audio: 'MUSIC/voice_responses/greetings/palidze.mp3',
                text: 'Kā varu palīdzēt?'
            }
        };

        // Definējam kadrilis ar vairākiem variantiem
        this.kadrils = {
            'flamingo': {
                name: 'Bermudu divstūris-flamingo',
                fragments: {
                    'sākums': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V1 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V2 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V3 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        }
                    ],
                    'vidus': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V1 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V2 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V3 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        }
                    ],
                    'beigas': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V1 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V2 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V3 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        }
                    ],
                    'pilnā': [
                        {
                            audio: 'MUSIC/bermudu_divsturis/flamingo_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo V1 sākums - gatavojamies" },
                                { time: 20, text: "Pirmā daļa - " },
                                { time: 40, text: "Otrā daļa - " },
                                { time: 60, text: "Piedziedājums - " }
                            ]
                        },
                        {
                            audio: 'MUSIC/bermudu_divsturis/flamingo_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo V2 sākums - gatavojamies" },
                                { time: 20, text: "Pirmā daļa - " },
                                { time: 40, text: "Otrā daļa - " },
                                { time: 60, text: "Piedziedājums - visi kopā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/bermudu_divsturis/flamingo_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo V3 sākums - gatavojamies" },
                                { time: 20, text: "Pirmā daļa - solis sānis" },
                                { time: 40, text: "Otrā daļa - pagriežamies" },
                                { time: 60, text: "Piedziedājums - visi kopā" }
                            ]
                        }
                    ]
                },
                keywords: ['flaminga', 'flamingo', 'flamingo']
            },
            'bērzgali': {
                name: 'Bērzgales kadriļa',
                fragments: {
                    'pirmais gabals': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/parts/pirmais.mp3',
                            captions: [
                                { time: 0, text: "Pirmā gabalas V1 sākums - 1. pāri mainīšanās" },
                                { time: 10, text: "Pirmā gabalas V1 sākums - 2. pāri mainīšanās" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/parts/pirmais.mp3',
                            captions: [
                                { time: 0, text: "Pirmā gabala V2 sākums - nostāšanās" },
                                { time: 10, text: "Kreisās rokas maiņa" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/parts/pirmais.mp3',
                            captions: [
                                { time: 0, text: "Pirmā gabala V3 sākums - nostāšanās" },
                                { time: 10, text: "Kreisās rokas maiņa" }
                            ]
                        }
                    ],
                    'otrais gabals': {
                        audio: 'MUSIC/kadrilas/berlins/berzgale/parts/otrais.mp3',
                        captions: [
                            { time: 0, text: "Otrā gabala sākums - grieziens pa labi" },
                            { time: 12, text: "Partnera maiņa" }
                        ]
                    },
                    'trešais gabals': {
                        audio: 'MUSIC/kadrilas/berlins/berzgale/parts/trešais.mp3',
                        captions: [
                            { time: 0, text: "Trešā gabala sākums - visi aplī" },
                            { time: 10, text: "Meitas virzās uz iekšu" }
                        ]
                    },
                    '4 gabals': {
                        audio: 'MUSIC/kadrilas/berlins/berzgale/parts/ceturtais.mp3',
                        captions: [
                            { time: 0, text: "Ceturtā gabala sākums - mainām virzienus" },
                            { time: 12, text: "Pāru pagriešanās" }
                        ]
                    },
                    '5 gabals': {
                        audio: 'MUSIC/kadrilas/berlins/berzgale/parts/piektais.mp3',
                        captions: [
                            { time: 0, text: "Piektā gabala sākums - virzienu maiņa" },
                            { time: 10, text: "Ātrāka kustība" }
                        ]
                    },
                    'sestais gabals': {
                        audio: 'MUSIC/kadrilas/berlins/berzgale/parts/sestais.mp3',
                        captions: [
                            { time: 0, text: "Sestā gabala sākums - noslēgums" },
                            { time: 12, text: "Pēdējie soļi" }
                        ]
                    },
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/berzgalefull_v1.mp3',
                            captions: [
                                { time: 0, text: "V1 - gatavojamies - pirmais gājiens-pāru maiņa" },
                                { time: 8, text: "pirmais gājiens - 1. pāri mainās" },
                                { time: 21, text: "pirmais gājiens - 2. pāri mainās" },
                                { time: 33, text: "pirmais gājiens - 1. pāri mainās uz savām vietām." },
                                { time: 46, text: "pirmais gājiens - 2. pāri mainās uz savām vietām." },
                                
                                { time: 61, text: " V1 - gatavojamies - otrais gājiens- sasveicināšanās" },
                                { time: 65, text: "otrais gājiens- 1. meitas sveicināšanās" },
                                { time: 76, text: "otrais gājiens- 2. meitas sveicināšanās" },
                                { time: 88, text: "otrais gājiens- 1. puiši sveicināšanās" },
                                { time: 99, text: "otrais gājiens- 2. puiši sveicināšanās" },

                                { time: 111, text: "V1 - gatavojamies - trešais gājiens-dzirnaviņas" },
                                { time: 115, text: "trešais gājiens- 1. meitas dzirnavās" },
                                { time: 136, text: "trešais gājiens- 2. meitas dzirnavās" },
                                { time: 155, text: "trešais gājiens- 1. puiši dzirnavās" },
                                { time: 175, text: "trešais gājiens- 2. puiši dzirnavās" },
                               
                                { time: 195, text: "V1 - gatavojamies - ceturtais gājiens-polka bez grābstīšanās" },
                                { time: 199, text: "V1 - ceturtais gājiens-polka bez grābstīšanās" },

                                { time: 225, text: " V1 - gatavojamies - piektais gājiens- puišu solo" },
                                { time: 230, text: "piektais gājiens- 1. puiša solo" },
                                { time: 243, text: "piektais gājiens- 2. puiša solo" },
                                { time: 256, text: "piektais gājiens- 3. puiša solo" },
                                { time: 269, text: "piektais gājiens- 4. puiša solo" },

                                { time: 285, text: "V1 - gatavojamies - sestais gājiens-polka ar grābstīšanos" },
                                { time: 290, text: "V1 - sestais gājiens-polka ar grābstīšanos" },

                                
                                { time: 318, text: "!!! POLKA !!!" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/berzgalefull_v2.mp3',
                            captions: [
                                { time: 0, text: "V2...PIRMAIS GABALS - gatavojamies" },
                                { time: 5, text: "Pāru maiņa- pirmie pāri" },
                                { time: 18, text: "Pāru maiņa- otrie pāri" },
                                { time: 30, text: "Pāru maiņa- pirmie pāri" },
                                { time: 42, text: "Pāru maiņa- otrie pāri" },
                                { time: 53, text: "V2...OTRAIS GABALS - gatavojamies" },
                                { time: 54, text: "Sasveicināšanās- Pirmā pāra meitenes" },
                                { time: 66, text: "Sasveicināšanās- Otrā pāra meitenes" },
                                { time: 78, text: "Sasveicināšanās- Pirmā pāra puiši" },
                                { time: 91, text: "Sasveicināšanās- Otrā pāra puiši" },
                                { time: 101, text: "V2...TREŠAIS GABALS - gatavojamies" },
                                { time: 103, text: "Pirmo pāru dzirnavas- meitenes" },
                                { time: 116, text: "Otro pāru dzirnavas- meitenes" },
                                { time: 131, text: "Pirmo pāru dzirnavas- puiši" },
                                { time: 146, text: "Otro pāru dzirnavas- puiši" },
                                { time: 161, text: "V2...CETURTAIS GABALS - gatavojamies" },
                                { time: 162, text: "CETURTAIS GABALS" },
                                { time: 190, text: "V2...PIEKTAIS GABALS - gatavojamies" },
                                { time: 192, text: "Puišu solo- pirmais puisis" },
                                { time: 204, text: "Puišu solo- otrais puisis" },
                                { time: 215, text: "Puišu solo- trešais puisis" },
                                { time: 228, text: "Puišu solo- ceturtais puisis" },
                                { time: 240, text: "V2...SESTAIS GABALS - gatavojamies" },
                                { time: 252, text: "V2...SESTAIS GABALS" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/berzgalefull_v5.mp3',
                            captions: [
                                { time: 0, text: " V5 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berzgale/berzgalefull_v3.mp3',
                            captions: [
                                { time: 0, text: "Dejas V3 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        }
                    ]
                },
                keywords: ['bērzgale', 'bērzgali', 'bērzgales']
            },
            'ciganovski': {
                name: 'Kadriļa "Cigamovskis"',
                fragments: {
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/ciganovskis/Ciganovskisfull_v1.mp3',
                            captions: [
                                { time: 0, text: "V1 dārziņš" },
                                { time: 17, text: "pāru maiņa" },
                                { time: 28, text: "pa trim" },
                                { time: 48, text: "pirmais valsis" },
                                { time: 65, text: "otrais dārziņš" },
                                { time: 83, text: "otrā pāru maiņa" },
                                { time: 101, text: "stiķis" },
                                { time: 118, text: "otrā pāru maiņa" },
                                { time: 137, text: "meitas uz vidu" },
                                { time: 138, text: "puišu sveicināšanās" },
                                { time: 157, text: "meiteņu sveicināšanās" },
                                { time: 172, text: "trešais valsis" },
                                { time: 189, text: "trešais dārziņš" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/ciganovskis/Ciganovskisfull_v2.mp3',
                            captions: [
                                { time: 0, text: "V2 dārziņš" },
                                { time: 17, text: "pāru maiņa" },
                                { time: 28, text: "pa trim" },
                                { time: 48, text: "valsis" },
                                { time: 65, text: "otrais dārziņš" },
                                { time: 83, text: "otrā pāru maiņa" },
                                { time: 101, text: "stiķis" },
                                { time: 118, text: "otrā pāru maiņa" },
                                { time: 137, text: "meitas uz vidu" },
                                { time: 138, text: "puišu sveicināšanās" },
                                { time: 157, text: "meiteņu sveicināšanās" },
                                { time: 172, text: "trešais valsis" },
                                { time: 189, text: "trešais dārziņš" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/ciganovskis/Ciganovskisfull.mp3',
                            captions: [
                                { time: 0, text: "V2 dārziņš" },
                                { time: 17, text: "pāru maiņa" },
                                { time: 28, text: "pa trim" },
                                { time: 48, text: "valsis" },
                                { time: 65, text: "otrais dārziņš" },
                                { time: 83, text: "otrā pāru maiņa" },
                                { time: 101, text: "stiķis" },
                                { time: 118, text: "otrā pāru maiņa" },
                                { time: 137, text: "meitas uz vidu" },
                                { time: 138, text: "puišu sveicināšanās" },
                                { time: 157, text: "meiteņu sveicināšanās" },
                                { time: 172, text: "trešais valsis" },
                                { time: 189, text: "trešais dārziņš" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/ciganovskis/Ciganovskisfull_v3.mp3',
                            captions: [
                                { time: 0, text: "V3 dārziņš" },
                                { time: 17, text: "pāru maiņa" },
                                { time: 28, text: "pa trim" },
                                { time: 48, text: "valsis" },
                                { time: 65, text: "otrais dārziņš" },
                                { time: 83, text: "otrā pāru maiņa" },
                                { time: 101, text: "stiķis" },
                                { time: 118, text: "otrā pāru maiņa" },
                                { time: 137, text: "meitas uz vidu" },
                                { time: 138, text: "puišu sveicināšanās" },
                                { time: 157, text: "meiteņu sveicināšanās" },
                                { time: 172, text: "trešais valsis" },
                                { time: 189, text: "trešais dārziņš" }
                            ]
                        }
                    ]
                },
                keywords: ['ciganovskis', 'ciganovski', 'cigi']
            },
            'kvadrāts': {
                name: 'Kadriļa "Karēļu kvadrāts"',
                fragments: {
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/kvadrats/kvadrat_v1.mp3',
                            captions: [
                                { time: 0, text: "gatavojamies" },
                                { time: 3, text: "piedziedājums" },
                                { time: 17, text: "Vārtiņi" },
                                { time: 50, text: "piedziedājums" },
                                { time: 60, text: "meitas" },
                                { time: 83, text: "piedziedājums" },
                                { time: 101, text: "do za do" },
                                { time: 118, text: "piedziedājums" },
                                { time: 137, text: "Vīri" },
                                { time: 138, text: "piedziedājums" },
                                { time: 189, text: "Beigas" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/kvadrats/kvadrat_v2.mp3',
                            captions: [
                                { time: 0, text: "gatavojamies" },
                                { time: 3, text: "piedziedājums" },
                                { time: 17, text: "Vārtiņi" },
                                { time: 50, text: "piedziedājums" },
                                { time: 60, text: "meitas" },
                                { time: 83, text: "piedziedājums" },
                                { time: 101, text: "do za do" },
                                { time: 118, text: "piedziedājums" },
                                { time: 137, text: "Vīri" },
                                { time: 138, text: "piedziedājums" },
                                { time: 189, text: "Beigas" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/kvadrats/kvadrat_v2_test.mp3',
                            captions: [
                                { time: 0, text: "Gatavojamies" },
                                { time: 4, text: "piedziedājums" },
                                { time: 18, text: "Vārtiņi" },
                                { time: 46, text: "piedziedājums" },
                                { time: 60, text: "Meitas" },
                                { time: 87, text: "piedziedājums" },
                                { time: 101, text: "do za do" },
                                { time: 129, text: "piedziedājums" },
                                { time: 141, text: "Vīri" },
                                { time: 167, text: "piedziedājums" },
                                { time: 189, text: "Beigas" }
                            ]
                        }
                    ]
                },
                keywords: ['kvadrāts', 'quatro', 'kvadrātu']
            },
            'padespans': {
                name: 'Kadriļa "Padespaņs"',
                fragments: {
                    '---': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V1 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V2 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V3 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        }
                    ],
                    '---': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V1 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V2 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V3 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        }
                    ],
                    '---': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V1 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V2 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V3 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        }
                    ],
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/padespans/Padespaan_v1.mp3',
                            captions: [
                                { time: 0, text: " V1 sākums - gatavojamies" },
                                { time: 4, text: "Pirmā daļa - " },
                                { time: 12, text: "Pirmā daļa - valsītis" },
                                { time: 19, text: "Otrā daļa - " },
                                { time: 27, text: "Otrā daļa - meitu grieziens" },
                                { time: 36, text: "Otrā daļa - grieziens " },
                                { time: 50, text: "Pirmā daļa - valsītis" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/padespans/Padespaan_v1.mp3',
                            captions: [
                                { time: 0, text: " V1 sākums - gatavojamies" },
                                { time: 4, text: "Pirmā daļa - " },
                                { time: 12, text: "Pirmā daļa - valsītis" },
                                { time: 19, text: "Otrā daļa - " },
                                { time: 27, text: "Otrā daļa - meitu grieziens" },
                                { time: 36, text: "Otrā daļa - grieziens " },
                                { time: 50, text: "Pirmā daļa - valsītis" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/padespans/Padespaan_v1.mp3',
                            captions: [
                                { time: 0, text: " V1 sākums - gatavojamies" },
                                { time: 4, text: "Pirmā daļa - " },
                                { time: 12, text: "Pirmā daļa - valsītis" },
                                { time: 19, text: "Otrā daļa - " },
                                { time: 27, text: "Otrā daļa - meitu grieziens" },
                                { time: 36, text: "Otrā daļa - grieziens " },
                                { time: 50, text: "Pirmā daļa - valsītis" }
                            ]
                        }
                    ]
                },
                keywords: ['spain', 'spainis', 'padespaņs']
            },
            'lanejots': {
                name: 'Kadriļa "Lancejots"',
                fragments: {
                    '---': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V1 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V2 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/sakums_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo sākuma daļa V3 - stājamies vietās" },
                                { time: 10, text: "Pirmie soļi uz priekšu" }
                            ]
                        }
                    ],
                    '---': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V1 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V2 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/vidus_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo vidus daļa V3 - grieziens" },
                                { time: 15, text: "Pagrieziens ar plaukstām" }
                            ]
                        }
                    ],
                    '---': [
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v1.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V1 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v2.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V2 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/rusins/parts/beigas_v3.mp3',
                            captions: [
                                { time: 0, text: "Flamingo beigu daļa V3 - kustība atpakaļ" },
                                { time: 10, text: "Palēcieni vietā" }
                            ]
                        }
                    ],
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/Lancejots/lancejots.mp3',
                            captions: [
                                { time: 0, text: " V1 sākums - gatavojamies" },
                                { time: 4, text: "Pirmā daļa - " },
                                { time: 12, text: "Pirmā daļa - valsītis" },
                                { time: 19, text: "Otrā daļa - " },
                                { time: 27, text: "Otrā daļa - meitu grieziens" },
                                { time: 36, text: "Otrā daļa - grieziens " },
                                { time: 50, text: "Pirmā daļa - valsītis" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/Lancejots/lancejots.mp3',
                            captions: [
                                { time: 0, text: "Flamingo V2 sākums - gatavojamies" },
                                { time: 20, text: "Pirmā daļa - " },
                                { time: 40, text: "Otrā daļa - " },
                                { time: 60, text: "Piedziedājums - visi kopā" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/Lancejots/lancejots.mp3',
                            captions: [
                                { time: 0, text: "Flamingo V3 sākums - gatavojamies" },
                                { time: 20, text: "Pirmā daļa - solis sānis" },
                                { time: 40, text: "Otrā daļa - pagriežamies" },
                                { time: 60, text: "Piedziedājums - visi kopā" }
                            ]
                        }
                    ]
                },
                keywords: ['lancis', 'lancejots', 'lants']
            },
            'berliņu': {
                name: 'Brambergas Berliņš',
                fragments: {
                    'dārziņš': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/parts/darzins_v1.mp3',
                            captions: [
                                { time: 0, text: "Dārziņa V1 sākums - nostājamies aplī" },
                                { time: 15, text: "Visi virzās pa kreisi" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/parts/darzins_v2.mp3',
                            captions: [
                                { time: 0, text: "Dārziņa V2 sākums - nostājamies aplī" },
                                { time: 15, text: "Visi virzās pa kreisi" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/parts/darzins_v3.mp3',
                            captions: [
                                { time: 0, text: "Dārziņa V3 sākums - nostājamies aplī" },
                                { time: 15, text: "Visi virzās pa kreisi" }
                            ]
                        }
                    ],
                    'sākums': {
                        audio: 'MUSIC/kadrilas/berlins/parts/sakums.mp3',
                        captions: [
                            { time: 0, text: "Berliņa sākums - puiši paceļ kreiso roku" },
                            { time: 10, text: "Meitas virza labo kāju" }
                        ]
                    },
                    'vidus': {
                        audio: 'MUSIC/kadrilas/berlins/parts/vidus.mp3',
                        captions: [
                            { time: 0, text: "Vidus daļa - pāri sastājas viens pret otru" },
                            { time: 12, text: "Visi griežas kopā" }
                        ]
                    },
                    'otra puse': {
                        audio: 'MUSIC/kadrilas/berlins/parts/otra_puse.mp3',
                        captions: [
                            { time: 0, text: "Otrā daļa - partnera maiņa" },
                            { time: 15, text: "Partneri sastājas aplī" }
                        ]
                    },
                    'beigas': {
                        audio: 'MUSIC/kadrilas/berlins/parts/beigas.mp3',
                        captions: [
                            { time: 0, text: "Dejas nobeigums - lielais dārziņš" },
                            { time: 10, text: "Visi sadevušies rokās virza soli pa kreisi" }
                        ]
                    },
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/berlins/berlinsfull_v1.mp3',
                            captions: [
                                { time: 0, text: "Dejas V1 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berlins/berlinsfull_v2.mp3',
                            captions: [
                                { time: 0, text: "Dejas V2 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berlins/berlinsfull_v1.mp3',
                            captions: [
                                { time: 0, text: "Dejas  sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/berlins/berlinsfull_v3.mp3',
                            captions: [
                                { time: 0, text: "Dejas V3 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        }
                    ]
                },
                keywords: ['berliņš', 'berliņu', 'berliņa', 'brambergas']
            },
            'krusta kazaks': {
                name: 'Kadriļa "Krusta kazāks"',
                fragments: {
                    'dārziņš': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/parts/darzins_v1.mp3',
                            captions: [
                                { time: 0, text: "Dārziņa V1 sākums - nostājamies aplī" },
                                { time: 15, text: "Visi virzās pa kreisi" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/parts/darzins_v2.mp3',
                            captions: [
                                { time: 0, text: "Dārziņa V2 sākums - nostājamies aplī" },
                                { time: 15, text: "Visi virzās pa kreisi" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/parts/darzins_v3.mp3',
                            captions: [
                                { time: 0, text: "Dārziņa V3 sākums - nostājamies aplī" },
                                { time: 15, text: "Visi virzās pa kreisi" }
                            ]
                        }
                    ],
                    'sākums': {
                        audio: 'MUSIC/kadrilas/berlins/parts/sakums.mp3',
                        captions: [
                            { time: 0, text: "Berliņa sākums - puiši paceļ kreiso roku" },
                            { time: 10, text: "Meitas virza labo kāju" }
                        ]
                    },
                    'vidus': {
                        audio: 'MUSIC/kadrilas/berlins/parts/vidus.mp3',
                        captions: [
                            { time: 0, text: "Vidus daļa - pāri sastājas viens pret otru" },
                            { time: 12, text: "Visi griežas kopā" }
                        ]
                    },
                    'otra puse': {
                        audio: 'MUSIC/kadrilas/berlins/parts/otra_puse.mp3',
                        captions: [
                            { time: 0, text: "Otrā daļa - partnera maiņa" },
                            { time: 15, text: "Partneri sastājas aplī" }
                        ]
                    },
                    'beigas': {
                        audio: 'MUSIC/kadrilas/berlins/parts/beigas.mp3',
                        captions: [
                            { time: 0, text: "Dejas nobeigums - lielais dārziņš" },
                            { time: 10, text: "Visi sadevušies rokās virza soli pa kreisi" }
                        ]
                    },
                    'pilnā': [
                        {
                            audio: 'MUSIC/kadrilas/berlins/krustakazaks/kazaks_1.mp3',
                            captions: [
                                { time: 0, text: "Dejas V1 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/krustakazaks/kazaks_1.mp3',
                            captions: [
                                { time: 0, text: "Dejas V2 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/krustakazaks/kazaks_1.mp3',
                            captions: [
                                { time: 0, text: "Dejas  sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        },
                        {
                            audio: 'MUSIC/kadrilas/berlins/krustakazaks/kazaks_1.mp3',
                            captions: [
                                { time: 0, text: "Dejas V3 sākums - gatavojamies" },
                                { time: 30, text: "Dārziņš - visi veido apli" },
                                { time: 63, text: "Pāru maiņa - vīrieši pagriezieties pa kreisi" },
                                { time: 95, text: "Kreisās rokas maiņa - griežamies pa labi" },
                                { time: 130, text: "Lielais dārziņš - vienotas kustības" }
                            ]
                        }
                    ]
                },
                keywords: ['kazaks', 'kazāks', 'krusta', 'krusta kazāks']
            }
        };
        
        // Pārbaudam, vai audio elements eksistē
        if (!this.mainAudio) {
            console.error('KĻŪDA: mainAudio elements nav atrasts!');
        }
        
        // Inicializācija
        this.setupEventListeners();
        this.populateSongList();
        this.createCaptionsPanel();
    }
    
    // Izveido titru paneli
    createCaptionsPanel() {
        const fragmentsContainer = document.querySelector('.fragments-container');
        if (!fragmentsContainer) return;
        
        // Izveido titru paneli, ja tas vēl neeksistē
        if (!document.getElementById('captionsPanel')) {
            const captionsPanel = document.createElement('div');
            captionsPanel.id = 'captionsPanel';
            captionsPanel.className = 'captions-panel';
            captionsPanel.innerHTML = `
                <h3>Dejas norise</h3>
                <div id="currentCaption" class="current-caption">Izvēlieties dziesmu...</div>
            `;
            
            // Pievieno titru paneli pēc fragmentu saraksta
            fragmentsContainer.appendChild(captionsPanel);
            
            // Pievieno CSS stilus titru panelim
            const style = document.createElement('style');
            style.textContent = `
                .captions-panel {
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid rgba(230, 255, 0, 0.3);
                }
                
                .current-caption {
                    background: rgba(18, 26, 24, 0.5);
                    border: 1px solid #e6ff00;
                    padding: 10px;
                    border-radius: 3px;
                    margin-top: 10px;
                    text-align: center;
                    font-size: 16px;
                    min-height: 24px;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // LABOTĀ metode titru atjaunināšanai
    updateCaption() {
        if (!this.mainAudio || !this.currentKadril || !this.activeFragment) return;
        
        const captionElement = document.getElementById('currentCaption');
        if (!captionElement) return;
        
        const kadril = this.kadrils[this.currentKadril];
        if (!kadril || !kadril.fragments[this.activeFragment]) {
            captionElement.textContent = "Nav pieejami dejas soļu apraksti";
            return;
        }
        
        // LABOJUMS: Izmantojam saglabāto variantu
        let fragmentCaptions;
        
        if (this.selectedVariant && this.selectedVariant.captions) {
            // Izmantojam izvēlētā varianta parakstus
            fragmentCaptions = this.selectedVariant.captions;
        } else {
            // Fallback: izmantojam pirmo variantu vai vienkāršo objektu
            const fragmentData = kadril.fragments[this.activeFragment];
            if (Array.isArray(fragmentData)) {
                fragmentCaptions = fragmentData[0].captions;
            } else {
                fragmentCaptions = fragmentData.captions;
            }
        }
        
        if (!fragmentCaptions || fragmentCaptions.length === 0) {
            captionElement.textContent = "Nav pieejami dejas soļu apraksti";
            return;
        }
        
        const currentTime = Math.floor(this.mainAudio.currentTime);
        let activeCaption = fragmentCaptions[0].text;
        
        // Atrast pareizo parakstu, balstoties uz pašreizējo laiku
        for (let i = 0; i < fragmentCaptions.length; i++) {
            if (currentTime >= fragmentCaptions[i].time) {
                activeCaption = fragmentCaptions[i].text;
            } else {
                break;
            }
        }
        
        // Atjaunināt parakstu
        captionElement.textContent = activeCaption;
    }
    
    // Atskaņo asistenta audio, bet nemaina UI
    playAssistantAudio(audioPath) {
        // Izveidojam pagaidu audio elementu, lai neietekmētu galveno
        const tempAudio = new Audio(audioPath);
        tempAudio.play().catch(e => console.error("Kļūda atskaņojot asistenta audio:", e));
    }
    
    // Pārveidota metode, kas izmanto pagaidu audio skaņām, bet nemaina UI
    playParallel(audioPath, videoPath) {
        this.playAssistantAudio(audioPath);
    }
    
    // Jaunas metodes UI elementu izveidei
    setupEventListeners() {
        // Play/Pause pogas notikumu klausītājs
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (this.mainAudio.paused) {
                    this.resumePlayback();
                } else {
                    this.pausePlayback();
                }
            });
        }
        
        // Stop pogas notikumu klausītājs
        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                this.stopPlayback();
            });
        }
        
        // Progress bar atjaunināšana
        if (this.mainAudio) {
            this.mainAudio.addEventListener('timeupdate', () => {
                this.updateProgressBar();
                this.updateCaption(); // Atjauninam titrus
            });
            
            // Atskaņošanas beigas
            this.mainAudio.addEventListener('ended', () => {
                this.onPlaybackEnded();
            });
        }
    }
    
    // Dziesmu saraksta aizpildīšana
    populateSongList() {
        const songListElement = document.getElementById('songList');
        if (!songListElement) return;
        
        songListElement.innerHTML = '';
        
        // Pievienojam katru kadriļu sarakstam
        for (const kadrilKey in this.kadrils) {
            const kadril = this.kadrils[kadrilKey];
            const listItem = document.createElement('li');
            listItem.textContent = kadril.name;
            listItem.dataset.kadril = kadrilKey;
            
            // Notikumu klausītājs, lai atskaņotu, kad uzklikšķina
            listItem.addEventListener('click', () => {
                this.playSong(kadrilKey, 'pilnā');
            });
            
            songListElement.appendChild(listItem);
        }
    }
    
    // Fragmentu saraksta atjaunināšana, kad izvēlēta dziesma
    updateFragmentsList(kadrilKey) {
        const fragmentsElement = document.getElementById('fragmentsList');
        if (!fragmentsElement) return;
        
        fragmentsElement.innerHTML = '';
        
        if (!kadrilKey || !this.kadrils[kadrilKey]) return;
        
        const fragments = this.kadrils[kadrilKey].fragments;
        
        // Pievienojam katru fragmentu
        for (const fragmentKey in fragments) {
            const fragmentBtn = document.createElement('button');
            fragmentBtn.className = 'fragment-btn';
            fragmentBtn.textContent = fragmentKey;
            fragmentBtn.dataset.fragment = fragmentKey;
            
            // Iezīmējam aktīvo fragmentu
            if (this.activeFragment === fragmentKey) {
                fragmentBtn.classList.add('active');
            }
            
            // Notikumu klausītājs, lai atskaņotu fragmentu
            fragmentBtn.addEventListener('click', () => {
                this.playSong(kadrilKey, fragmentKey);
            });
            
            fragmentsElement.appendChild(fragmentBtn);
        }
    }
    
    // Progress bar atjaunināšana
    updateProgressBar() {
        const progressBar = document.getElementById('progressBar');
        const songTimer = document.getElementById('songTimer');
        
        if (!progressBar || !songTimer || !this.mainAudio) return;
        
        const currentTime = this.mainAudio.currentTime;
        const duration = this.mainAudio.duration || 0;
        
        // Atjauninām progress bar
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Formatējam laiku
        const formatTime = (time) => {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        };
        
        // Atjauninām laika rādījumu
        songTimer.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    
    // Atskaņošanas beigu apstrāde
    onPlaybackEnded() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.textContent = '▶️';
        }
        
        // Notīrām titrus
        const captionElement = document.getElementById('currentCaption');
        if (captionElement) {
            captionElement.textContent = "Atskaņošana pabeigta";
        }
    }
    
    // Aktīvās dziesmas atjaunināšana UI
    updateActiveSong(kadrilKey, fragmentKey = 'pilnā') {
        // Atjauninām dziesmu sarakstu
        const songItems = document.querySelectorAll('#songList li');
        songItems.forEach(item => {
            item.classList.toggle('active', item.dataset.kadril === kadrilKey);
        });
        
        // Atjauninām dziesmas virsrakstu
        const songTitle = document.getElementById('activeSongTitle');
        if (songTitle) {
            if (kadrilKey && this.kadrils[kadrilKey]) {
                songTitle.textContent = `${this.kadrils[kadrilKey].name} - ${fragmentKey}`;
            } else {
                songTitle.textContent = 'Izvēlieties dziesmu';
            }
        }
        
        this.activeFragment = fragmentKey;
        this.currentKadril = kadrilKey;
        
        // Atjauninām Play/Pause pogu
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.textContent = this.mainAudio && !this.mainAudio.paused ? '⏸️' : '▶️';
        }
        
        // Atjauninām fragmentu sarakstu
        this.updateFragmentsList(kadrilKey);
        
        // Atjauninām titru tekstu
        if (!kadrilKey) {
            const captionElement = document.getElementById('currentCaption');
            if (captionElement) {
                captionElement.textContent = "Izvēlieties dziesmu...";
            }
        }
    }

    // Pārbauda vai fragments atbilst balss komandai (ņemot vērā dažādus locījumus)
    matchesFragment(command, fragmentKey) {
        // Pamata varianti
        if (command.includes(fragmentKey)) return true;
        
        // Locījumu varianti
        const endings = ['u', 'a', 'am', 'ā', 'us', 'as', 'iem', 'ām'];
        for (const ending of endings) {
            if (command.includes(fragmentKey + ending)) return true;
        }
        
        // Specifiskas pārbaudes
        if (fragmentKey === 'sākums' && (command.includes('sāk') || command.includes('sakum'))) return true;
        if (fragmentKey === 'vidus' && (command.includes('vid') || command.includes('vidu'))) return true;
        if (fragmentKey === 'beigas' && (command.includes('beig') || command.includes('noslēgum'))) return true;
        if (fragmentKey === 'otra puse' && (command.includes('otr') || command.includes('otru pus'))) return true;
        if (fragmentKey === 'dārziņš' && (command.includes('dārziņ') || command.includes('darziņ'))) return true;
        if (fragmentKey === 'pilnā' && (command.includes('visp') || command.includes('visu') || command.includes('pilnīb'))) return true;
        
        // Papildinājums konkrētiem fragmentiem
        if (fragmentKey === 'pirmais gabals' && command.includes('pirm')) return true;
        if (fragmentKey === 'otrais gabals' && command.includes('otr')) return true;
        if (fragmentKey === 'trešais gabals' && command.includes('treš')) return true;
        if (fragmentKey === 'ceturtais gabals' && command.includes('ceturt')) return true;
        if (fragmentKey === 'piektais gabals' && command.includes('piekt')) return true;
        if (fragmentKey === 'sestais gabals' && command.includes('sest')) return true;
        
        return false;
    }

    handleCommand(command) {
        if (!command) return null;
        
        command = command.toLowerCase().trim();
        console.log('Audio Menedžeris apstrādā komandu:', command);

        // Pārbaudam wake words un atskaņojam atbildes
        for (const wakeWord in this.wakeWords) {
            if (command.includes(wakeWord)) {
                // Ja komanda ir 'aivar', izvēlamies nejaušu atbildi no masīva
                if (wakeWord === 'aivar') {
                    const randomIndex = Math.floor(Math.random() * this.wakeWords[wakeWord].length);
                    const randomResponse = this.wakeWords[wakeWord][randomIndex];
                    
                    // Atskaņojam skaņu, bet nesabojājam UI
                    this.playAssistantAudio(randomResponse.audio);
                    
                    return randomResponse.text;
                } else {
                    // Citiem wake vārdiem atskaņojam parasto atbildi
                    const response = this.wakeWords[wakeWord];
                    this.playAssistantAudio(response.audio);
                    
                    return response.text;
                }
            }
        }
        
        // Pārbaudam vadības komandas
        if (this.controlCommands.stop.some(cmd => command.includes(cmd))) {
            this.stopPlayback();
            return 'Apturēju atskaņošanu';
        }

        if (this.controlCommands.pause.some(cmd => command.includes(cmd))) {
            this.pausePlayback();
            return 'Nopauzēju atskaņošanu';
        }

        if (this.controlCommands.resume.some(cmd => command.includes(cmd))) {
            this.resumePlayback();
            return 'Turpinu atskaņošanu';
        }

        // Pārbaudam, vai tiek mainīta deja
        for (const [kadrilKey, kadril] of Object.entries(this.kadrils)) {
            if (kadril.keywords.some(keyword => command.includes(keyword))) {
                this.currentKadril = kadrilKey;
                
                // Ja pieminēta pilnā deja vai nav konkrēts fragments
                if (command.includes('pilno') || command.includes('visu') || command.includes('pilnībā')) {
                    this.playSong(kadrilKey, 'pilnā');
                    return `Atskaņoju ${kadril.name} pilnībā`;
                }

                // Meklējam fragmentu
                for (const [fragmentKey, fragment] of Object.entries(kadril.fragments)) {
                    if (this.matchesFragment(command, fragmentKey) && fragmentKey !== 'pilnā') {
                        this.playSong(kadrilKey, fragmentKey);
                        return `Atskaņoju ${kadril.name} - ${fragmentKey}`;
                    }
                }

                // Ja fragments nav norādīts, atskaņojam pilno
                this.playSong(kadrilKey, 'pilnā');
                return `Atskaņoju ${kadril.name}`;
            }
        }

        // Ja ir aktīva deja (vai nopauzēta), meklējam tikai fragmentu
        if (this.currentKadril) {
            const currentKadrilData = this.kadrils[this.currentKadril];
            for (const [fragmentKey, fragment] of Object.entries(currentKadrilData.fragments)) {
                if (this.matchesFragment(command, fragmentKey) && fragmentKey !== 'pilnā') {
                    this.playSong(this.currentKadril, fragmentKey);
                    return `Atskaņoju ${currentKadrilData.name} - ${fragmentKey}`;
                }
            }
        }

        return null;
    }

    // LABOTĀ galvenā metode dziesmas atskaņošanai
    playSong(kadrilKey, fragmentKey = 'pilnā') {
        // Pārbaudam, vai deja un fragments eksistē
        if (!this.kadrils[kadrilKey] || !this.kadrils[kadrilKey].fragments[fragmentKey]) {
            console.error(`Nezināma deja vai fragments: ${kadrilKey} - ${fragmentKey}`);
            return;
        }
        
        // Saglabājam aktīvo deju
        this.currentKadril = kadrilKey;
        this.activeFragment = fragmentKey;
        
        // Iegūstam fragmentu datus
        const fragmentData = this.kadrils[kadrilKey].fragments[fragmentKey];
        
        // Pārbaudam, vai ir vairāki varianti (masīvs) vai tikai viens
        let selectedVariant, audioPath;
        
        if (Array.isArray(fragmentData)) {
            // Izvēlamies nejaušu variantu no masīva
            const randomIndex = Math.floor(Math.random() * fragmentData.length);
            selectedVariant = fragmentData[randomIndex];
            audioPath = selectedVariant.audio;
            console.log(`Izvēlēts variants ${randomIndex + 1} no ${fragmentData.length}`);
        } else {
            // Vienkāršs objekts - izmantojam tā, kā agrāk
            selectedVariant = fragmentData;
            audioPath = fragmentData.audio;
        }
        
        // LABOJUMS: Saglabājam izvēlēto variantu
        this.selectedVariant = selectedVariant;
        
        // Atskaņojam audio
        this.playAudio(audioPath);
        
        // Atjauninām UI
        this.updateActiveSong(kadrilKey, fragmentKey);
    }

    // Audio atskaņošanas metode
    async playAudio(audioPath) {
        if (!this.mainAudio) {
            console.error('Audio elements nav inicializēts');
            return;
        }
        
        try {
            // Vispirms apturē jebkādus aktīvos medijus
            this.stopPlayback();
            
            // Iestatām audio
            this.mainAudio.src = audioPath;
            await this.mainAudio.load();
            
            // Mēģinām atskaņot
            try {
                await this.mainAudio.play();
                console.log('Atskaņošana sākta:', audioPath);
                
                // Atjauninām Play/Pause pogu
                const playPauseBtn = document.getElementById('playPauseBtn');
                if (playPauseBtn) {
                    playPauseBtn.textContent = '⏸️';
                }
                
                // Atjauninam titrus
                this.updateCaption();
            } catch (playError) {
                console.error('Kļūda atskaņojot audio:', playError);
                
                // Mēģinām atkārtoti pēc lietotāja interakcijas
                const playAudioOnInteraction = () => {
                    this.mainAudio.play()
                        .then(() => {
                            console.log("Audio atskaņošana aktivizēta pēc interakcijas");
                            const playPauseBtn = document.getElementById('playPauseBtn');
                            if (playPauseBtn) {
                                playPauseBtn.textContent = '⏸️';
                            }
                        })
                        .catch(e => console.error("Atkārtota kļūda ar audio:", e));
                    document.removeEventListener('click', playAudioOnInteraction);
                };
                document.addEventListener('click', playAudioOnInteraction);
            }
        } catch (error) {
            console.error('Kļūda atskaņojot:', error);
        }
    }

    stopPlayback() {
        try {
            if (this.mainAudio) {
                this.mainAudio.pause();
                this.mainAudio.currentTime = 0;
                console.log('Atskaņošana apturēta');
                
                // Atjauninām Play/Pause pogu
                const playPauseBtn = document.getElementById('playPauseBtn');
                if (playPauseBtn) {
                    playPauseBtn.textContent = '▶️';
                }
                
                // Notīrām titrus
                const captionElement = document.getElementById('currentCaption');
                if (captionElement) {
                    captionElement.textContent = "Atskaņošana apturēta";
                }
            }
        } catch (error) {
            console.error('Kļūda apturot atskaņošanu:', error);
        }
    }

    pausePlayback() {
        try {
            if (this.mainAudio) {
                // Saglabājam info, ka darbojās
                this.wasPlaying = true;
                
                this.mainAudio.pause();
                console.log('Atskaņošana nopauzēta');
                
                // Atjauninām Play/Pause pogu
                const playPauseBtn = document.getElementById('playPauseBtn');
                if (playPauseBtn) {
                    playPauseBtn.textContent = '▶️';
                }
            }
        } catch (error) {
            console.error('Kļūda nopauzējot atskaņošanu:', error);
        }
    }

    resumePlayback() {
        try {
            if (this.mainAudio) {
                this.mainAudio.play()
                    .then(() => {
                        console.log('Atskaņošana turpināta');
                        
                        // Atjauninām Play/Pause pogu
                        const playPauseBtn = document.getElementById('playPauseBtn');
                        if (playPauseBtn) {
                            playPauseBtn.textContent = '⏸️';
                        }
                    })
                    .catch(error => {
                        console.error('Kļūda turpinot atskaņošanu:', error);
                    });
            }
        } catch (error) {
            console.error('Kļūda turpinot atskaņošanu:', error);
        }
    }
}

export const audioManager = new AudioManager();