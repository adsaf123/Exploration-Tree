var adventureMap = {
    '101': 'path',
    '102': 'path',
    '103': 'forest',
    '201': 'shop'
}

function encodeGridId(row, col) {
    return col < 10 ? row + "0" + col : "" + row + col
}

function decodeGridId(id) {
    if (typeof id === "number") {
        id = id.toString();
    }
    if (id.length == 3) {
        return {
            row: Number(id[0]),
            col: Number(id[1] + id[2])
        }
    } else {
        return {
            row: Number(id[0] + id[1]),
            col: Number(id[2] + id[3])
        }
    }
}

addLayer("S", {
    row: "side",
    name: "Story",
    resource: "Lore",
    position: 1,
    color: "#FFFFFF",

    tabFormat: [
        ["infobox", "Introduction"]
    ],

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0)
        }
    },

    infoboxes: {
        "Introduction": {
            title: "Introduction",
            body() {
                return `
                    Welcome to my new mod! It's a exploration based mod. 
                    Navigate using noncentral nodes and access content of area you are in using central node.
                    Map is in the next side layer.
                `
            }
        }
    }
})

addLayer("M", {
    row: "side",
    name: "Map",
    resource: "Discovered locations",
    position: 2,
    color: "#FFFF99",

    tabFormat: [
        "grid"
    ],

    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
            currentRow: 1,
            currentCol: 1,
        }
    },

    grid: {
        rows: 9,
        cols: 9,

        getStartData(id) {
            return adventureMap[id] !== undefined ? adventureMap[id] : 'blank'
        },

        getCanClick(data, id) {
            return true
        },

        getDisplay(data, id) {
            return id === encodeGridId(player[this.layer].currentRow, player[this.layer].currentCol) ? "⭐" : ""
        },

    }
})