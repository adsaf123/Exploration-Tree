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
                    Map is in the next side layer. The last side layer is your stats. You can gain coins and EXP by looking for troubles in the forest.
                    In shop you can buy swords which double you DMG.
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
            levelReq: new Decimal(5),

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
            lookingForTroublesTimer: new Decimal(0),
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
        ["display-text", () => "You have " + format(player["P"].levels) + " levels"],
        ["display-text", () => "You need " + format(player["P"].levelReq.sub(player["P"].points)) + " EXP to get next level"],
        "blank",
        ["display-text", "Every % here is multiplicative"],
        "blank",
        ["row", [
            ["bar", "STR-bar"],
            ["clickable", "STR-button"],
        ]],
        ["row", [
            ["bar", "DEX-bar"],
            ["clickable", "DEX-button"],
        ]],
        ["row", [
            ["bar", "CON-bar"],
            ["clickable", "CON-button"],
        ]],
        ["row", [
            ["bar", "CHR-bar"],
            ["clickable", "CHR-button"],
        ]],
        ["row", [
            ["bar", "INT-bar"],
            ["clickable", "INT-button"],
        ]],
        ["row", [
            ["bar", "WIS-bar"],
            ["clickable", "WIS-button"],
        ]],
    ],

    clickables: {
        "STR-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() {
                player[this.layer].STR = player[this.layer].STR.add(1)
                player[this.layer].levels = player[this.layer].levels.sub(1)
                player[this.layer].damage = new Decimal(2).add(player[this.layer].STR).mul(new Decimal(2).pow(getBuyableAmount("L", "shop-sword"))).ceil() 
            },
            style() { return { "height": "50px", "width": "50px", "min-height": "50px" } }
        },

        "DEX-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { 
                player[this.layer].DEX = player[this.layer].DEX.add(1)
                player[this.layer].levels = player[this.layer].levels.sub(1)
            },
            style() { return { "height": "50px", "width": "50px", "min-height": "50px" } }
        },

        "CON-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() { 
                player[this.layer].CON = player[this.layer].CON.add(1)
                player[this.layer].levels = player[this.layer].levels.sub(1) 
                player[this.layer].maxHealth = player[this.layer].maxHealth.mul(new Decimal(1.05).pow(player[this.layer].CON)).ceil() 
            },
            style() { return { "height": "50px", "width": "50px", "min-height": "50px" } }
        },

        "CHR-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() {
                player[this.layer].CHR = player[this.layer].CHR.add(1)
                player[this.layer].levels = player[this.layer].levels.sub(1) 
            },
            style() { return { "height": "50px", "width": "50px", "min-height": "50px" } }
        },

        "INT-button": {
            display() { return "+" },
            canClick() { return player[this.layer].levels.gt(0) },
            onClick() {  
                player[this.layer].INT = player[this.layer].INT.add(1)
                player[this.layer].levels = player[this.layer].levels.sub(1)
            },
            style() { return { "height": "50px", "width": "50px", "min-height": "50px" } }
        },

        "WIS-button": {
            display() { return "+" },
            canClick() { return false },
            onClick() { player[this.layer].WIS.add(1); player[this.layer].levels.sub(1) },
            style() { return { "height": "50px", "width": "50px", "min-height": "50px" } }
        }
    },

    bars: {
        "STR-bar": {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return 0 },
            display() {
                return "STRENGTH: Increase swords' damage mult by 1"
            }
        },

        "DEX-bar": {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return 0 },
            display() {
                return "DEXTERITY: Increase player speed by 5%"
            }
        },

        "CON-bar": {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return 0 },
            display() {
                return "CONSTITUTION: Increase Max HP by 5%"
            }
        },

        "CHR-bar": {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return 0 },
            display() {
                return "CHARISMA: Decrease prices in shop by 5%"
            }
        },

        "INT-bar": {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return 0 },
            display() {
                return "INTELIGENCE: Increase EXP gain by 1"
            }
        },

        "WIS-bar": {
            direction: RIGHT,
            width: 500,
            height: 50,
            progress() { return 0 },
            display() {
                return "WISDOM: Make sacrifice formula 5% better (not impl.)"
            }
        },
    },

    update(diff) {
        if(player[this.layer].points.gte(player[this.layer].levelReq)) {
            player[this.layer].levels = player[this.layer].levels.add(1)
            player[this.layer].points = player[this.layer].points.sub(player[this.layer].levelReq)
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

    buyables: {
        "shop-sword": {
            cost(x) { return new Decimal(10).pow(x).mul(new Decimal(0.95).pow(player["P"].CHR)).ceil() },
            display() {
                return "<h2>Sword</h2><br><br>Multiplies base damage by " + format(new Decimal(2).add(player["P"].STR)) + "<br><h2>Cost:</h2> " + format(this.cost(getBuyableAmount(this.layer, this.id))) + " coins<br><h2>Currently:</h2> " + format(this.effect(getBuyableAmount(this.layer, this.id)) + "x")
            },
            canAfford() { return player.points.gte(this.cost()) },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player["P"].damage = new Decimal(2).mul(new Decimal(new Decimal(2).add(player["P"].STR)).pow(getBuyableAmount("L", "shop-sword")))
            },
            effect(x) { return new Decimal(2).add(player["P"].STR).pow(x) }
        
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
                player["P"].lookingForTroublesTimer = new Decimal(0)
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
                player["P"].lookingForTroublesTimer = player["P"].lookingForTroublesTimer.add(new Decimal(diff).mul(new Decimal(1.05).pow(player["P"].DEX)).div(3))
                if (player["P"].lookingForTroublesTimer.gte(1)) {
                    spawnEnemy()
                    player["P"].fighting = true
                }
            } else {
                player["P"].attackTimer = player["P"].attackTimer.sub(msDiff)
                if (player["P"].attackTimer.lte(0)) {
                    playerAttack()
                    player["P"].attackTimer = new Decimal(3000).div(new Decimal(1.05).pow(player["P"].DEX))
                }

                enemy.ATK = enemy.ATK.sub(msDiff)
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