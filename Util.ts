import {NEATNode} from "./nodes/Node";
import {Connection} from "./Connection";
export const isSufficientlyClose =(value,expected) => {
    let cutOff = 0.00001;
    return (Math.abs(expected - value) < cutOff);
}