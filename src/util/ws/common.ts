import type {TypeListener} from './interface/index'

let listeners: TypeListener = {}

let _seq = 1
const nextSeq = ()=>{
    _seq ++
    return _seq
}
export {
    listeners,
    nextSeq
}