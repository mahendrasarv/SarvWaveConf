import ReactiveStorage from './reactive';

const _singleton = new ReactiveStorage(window.localStorage, 'SARVWAVE_');

export default _singleton;
