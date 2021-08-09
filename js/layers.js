var adventureMap = {}

enemy = {
    HP: new Decimal(10),
    DMG: new Decimal(1),
    ATK: new Decimal(10000),
}

var locations = [
    {
        x: 0,
        y: 0,
        type: "path"
    },

    {
        x: 1,
        y: 0,
        type: "path"
    },

    {
        x: 2,
        y: 0,
        type: "forest"
    },

    {
        x: 0,
        y: 1,
        type: "shop"
    }
]

adventureMap = generateMap(locations)

addLayer("I", {
    row: "side",
    position: 1,
    name: "Story",
    resource: "Lore",
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
    position: 2,
    name: "Map",
    resource: "Discovered locations",
    color: "#FFFF99",

    tabFormat: [
        "grid"
    ],

    startData() {
        return {
            unlocked: true,
            points: new Decimal(1),
            drawnGrid: false
        }
    },

    grid: {
        rows: 9,
        cols: 9,

        getStartData(id) {
            return "blank"
        },

        getCanClick(data, id) {
            return true
        },

        getDisplay(data, id) {
            return id == encodeGridId(5, 5) ? "⭐" : ""
        },

        getStyle(data, id) {
            var color = "#FFFF99"

            if (data == "shop") {
                color = "#ffee00"
            } else if (data == "forest") {
                color = "#00aa33"
            } else if (data == "path") {
                color = "#cccccc"
            }

            return {
                "background-color": color
            }
        },

        getTooltip(data, id) {
            if (typeof data == "undefined") return

            if (data == "blank") {
                return "Nothing"
            } else {
                return data[0].toUpperCase() + data.slice(1)
            }
        }
    },

    update(diff) {
        if (!player[this.layer].drawnGrid) {
            drawGrid()
            player[this.layer].drawnGrid = true
        }
    }
})

addLayer("P", {
    row: "side",
    position: 3,
    name: "Player",
    resource: "EXP",
    color: "#ff6600",

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
            levels: new Decimal(0),

            //health and damage
            currentHealth: new Decimal(10),
            maxHealth: new Decimal(10),
            healTimer: new Decimal(10000),
            damage: new Decimal(2),
            attackTimer: new Decimal(3000),

            //position
            playerX: 0,
            playerY: 0,

            //fighting stuff
            lookingForTroubles: false,
            lookingForTroublesTimer: 0,
            fighting: false,

            //stats
            STR: new Decimal(0),
            DEX: new Decimal(0),
            CON: new Decimal(0),
            CHR: new Decimal(0),
            INT: new Decimal(0),
            WIS: new Decimal(0),

        }
    },

    tabFormat: [
        "main-display",
        "blank",
        ["display-text", "Every % here is multiplicative and have a minimum value of 1"],
        "blank",
        ["row", [
            ["display-text", "STRENGTH: Increase base damage by 5%"],
            "blank",
            ["clickable", "STR-button"],
        ]],
        ["row", [
            ["display-text", "DEXTERITY: Increase player speed by 5%"],
            "blank",
            ["clickable", "DEX-button"],
        ]],
        ["row", [
            ["display-text", "CONSTITUTION: Increase Max HP by 5%"],
            "blank",
            ["clickable", "CON-button"],
        ]],
        ["row", [
            ["display-text", "CHARISMA: Decrease prices in shop by 5%"],
            "blank",
            ["clickable", "CHR-button"],
        ]],
        ["row", [
            ["display-text", "INTELIGENCE: Increase EXP gain by 5%"],
            "blank",
            ["clickable", "INT-button"],
        ]],
        ["row", [
            ["display-text", "WISDOM: Make sacrifice formula 5% better"],
            "blank",
            ["clickable", "WIS-button"],
        ]],
    ],

    clickables: {
        "STR-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { player[this.layer].STR.add(1); player[this.layer].levels.sub(1) },
            style() { return {"height":"50px", "width":"50px", "min-height":"50px"} }
        },

        "DEX-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { player[this.layer].DEX.add(1); player[this.layer].levels.sub(1) },
            style() { return {"height":"50px", "width":"50px", "min-height":"50px"} }
        },

        "CON-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { player[this.layer].CON.add(1); player[this.layer].levels.sub(1) },
            style() { return {"height":"50px", "width":"50px", "min-height":"50px"} }
        },

        "CHR-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { player[this.layer].CHR.add(1); player[this.layer].levels.sub(1) },
            style() { return {"height":"50px", "width":"50px", "min-height":"50px"} }
        },

        "INT-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { player[this.layer].INT.add(1); player[this.layer].levels.sub(1) },
            style() { return {"height":"50px", "width":"50px", "min-height":"50px"} }
        },

        "WIS-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { player[this.layer].WIS.add(1); player[this.layer].levels.sub(1) },
            style() { return {"height":"50px", "width":"50px", "min-height":"50px"} }
        }
    }
})

addLayer("L", {
    row: 1,
    position: 1,
    name: "Current Location",
    resource: "Current Location",
    color: "#009911",

    tabFormat: generateLocationDisplay,

    startData() {
        return {
            unlocked: true,
            points: new Decimal(0),
        }
    },

    clickables: {
        "troubles": {
            display() {
                return player["P"].lookingForTroubles ? "Click here to stop looking for troubles" : "Click here to begin looking for troubles"
            },

            canClick() {
                return !player["P"].fighting
            },

            onClick() {
                player["P"].lookingForTroubles = !player["P"].lookingForTroubles
                player["P"].lookingForTroublesTimer = 0
            }
        }
    },

    bars: {
        "troubles-bar": {
            direction: RIGHT,
            width: 300,
            height: 50,
            progress() {
                return player["P"].lookingForTroublesTimer
            }
        }
    },

    update(diff) {
        var msDiff = diff * 1000

        if (player["P"].lookingForTroubles) {
            if (!player["P"].fighting) {
                player["P"].lookingForTroublesTimer += diff / 3
                if (player["P"].lookingForTroublesTimer >= 1) {
                    spawnEnemy()
                    player["P"].fighting = true
                }
            } else {
                player["P"].attackTimer = player["P"].attackTimer.sub(msDiff)
                if (player["P"].attackTimer.lte(0)) {
                    playerAttack()
                    player["P"].attackTimer = new Decimal(3000)
                }

                enemy.ATK =  enemy.ATK.sub(msDiff)
                if (enemy.ATK.lte(0)) {
                    enemyAttack()
                    enemy.ATK = new Decimal(10000)
                }
            }
        }

        player["P"].healTimer -= msDiff
        if (player["P"].healTimer <= 0) {
            if (player["P"].currentHealth.lt(player["P"].maxHealth)) {
                player["P"].currentHealth = player["P"].currentHealth.add(1)
            }
            player["P"].healTimer = 10000
        }
    }
})