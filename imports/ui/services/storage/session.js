import ReactiveStorage from './reactive';

const _singleton = new ReactiveStorage(window.sessionStorage, 'SARVWAVE_');

export default _singleton;
