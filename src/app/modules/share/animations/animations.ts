import { animation, trigger, transition, style, animate, keyframes, query, state } from '@angular/animations';

export const showTrigger = trigger('showState', [
    transition(':enter', [style({ opacity: 0 }), animate(200)]),
    transition(':leave', [style({ opacity: 1 }), animate('0.2s', style({ opacity: 0 }))])
]);

export const routingTrigger = trigger('routeState', [
    transition('hide<=>*', [style({ opacity: 0 }), animate(2000)]),
    transition(':leave', [style({ opacity: 1 }), animate(2000, style({ opacity: 0 }))])
]);

export const fadeInTrigger = trigger('fadeInState', [
    transition(':enter', [style({ opacity: 0 }), animate(300, style({ opacity: 1 }))])
]);

// export const dropDownTrigger = trigger("dropDownState", [
//     // transition("*<=>*", [query(".question__answer.current", [style({ opacity: 0 }), animate(400)], { optional: true })])
//     transition("*<=>*", [
//         query(
//             ".question__answer.open",
//             [
//                 style({ opacity: 0, transform: "translateY(-30px)" }),
//                 animate(200, style({ opacity: 1, transform: "translateY(0px)" }))
//             ],
//             {
//                 optional: true
//             }
//         ),
//         query(".question__answer.close", [style({ height: "*" }), animate("200ms")], {
//             optional: true
//         })
//     ])
// ]);

export const dropDownTrigger = trigger('dropDownState', [
    // transition("*<=>*", [query(".question__answer.current", [style({ opacity: 0 }), animate(400)], { optional: true })])
    // state('show', style({ opacity: 1 })),
    // state('hide', style({ opacity: 0 })),

    transition('hide=>show', animate(500)),
    transition('show=>hide', animate(500))
]);

export const slideInTrigger = trigger('slideInState', [
    // transition("*<=>*", [query(".question__answer.current", [style({ opacity: 0 }), animate(400)], { optional: true })])
    // state('show', style({ opacity: 1 })),
    // state('hide', style({ opacity: 0 })),

    transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate(3000, style({ transform: 'translateY(0)', opacity: 1 }))
    ]),

    transition(':leave', [
        // style({ transform: 'translateY(-100%)' }),
        // animate(300, style({ transform: 'translateY(0)' }))
        animate(300)
    ])
]);
