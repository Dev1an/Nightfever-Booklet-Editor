import {chainCommands, exitCode} from "prosemirror-commands";

export function replaceSelectionWith(nodeSpec) {
    return chainCommands(exitCode, (state, dispatch) => {
        dispatch(state.tr.replaceSelectionWith(nodeSpec.create()).scrollIntoView())
        return true
    })
}

export function findParentNode(predicate) {
    return function (_ref) {
        var $from = _ref.$from;
        return findParentNodeClosestToPos($from, predicate);
    };
}

export function findParentNodeClosestToPos($pos, predicate) {
    for (var i = $pos.depth; i > 0; i--) {
        var node = $pos.node(i);
        if (predicate(node)) {
            return {
                pos: i > 0 ? $pos.before(i) : 0,
                start: $pos.start(i),
                depth: i,
                node: node
            };
        }
    }
}