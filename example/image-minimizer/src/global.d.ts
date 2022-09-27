declare const _ASSETS_PATH_: string;
declare const _DEV_: string;
declare const _IS_MERCHANT_: string;
declare const SamsungPay: {
    connect: (...args: any) => void;
};
declare const google: any;
declare module '*.svg' {
    const content: any;
    export default content;
}
declare module '*.png' {
    const content: any;
    export default content;
}
declare module '*.jpeg' {
    const content: any;
    export default content;
}
declare module '*.jpg' {
    const content: any;
    export default content;
}
declare module '*.woff2';
declare module '*.woff';
declare module '*.ttf';

interface Window {
    ApplePaySession: any;
    ReactNativeWebView: {
        postMessage: (params: string) => void;
    };
    gpsPayP2pData: any;
}

declare module '*.json' {
    const value: any;
    export default value;
}

// declare module 'i18next' {
//     const lib: any;
//     export default lib;
// }
// declare module 'react-i18next' {
//     type LIB = {
//         reactI18nextModule: any;
//         withNamespaces: any;
//         initReactI18next: any;
//     };
//     const lib: LIB;
//     export = lib;
// }
type OnchangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;

declare const ApplePaySession: any;

type ReactRef = React.RefObject<HTMLFormElement>;

type Translate = (str: string) => string;
type RouterPush = (to: To, state?: any) => void;
