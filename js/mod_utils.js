function encodeGridId(row, col) {
    return "" + (row * 100 + col)
}

function decodeGridId(id) {
    return {
        row: Math.floor(+id / 100),
        col: +id % 100,
    }
}

function drawGrid() {
    for (var x = -4; x <= 4; x++) {
        for (var y = -4; y <= 4; y++) {
            var id = encodeGridId(y + 5, x + 5)
            if (adventureMap[x + player["P"].playerX] == undefined) {
                adventureMap[x + player["P"].playerX] = {}
            }
            if (adventureMap[x + player["P"].playerX][y + player["P"].playerY] == undefined) {
                adventureMap[x + player["P"].playerX][y + player["P"].playerY] = "blank"
            }
            setGridData("M", id, adventureMap[x + player["P"].playerX][y + player["P"].playerY])
        }
    }
}

function generateMap(map) {
    var aMap = {}
    map.forEach(location => {
        if (aMap[location.x] === undefined) {
            aMap[location.x] = {}
        }
        aMap[location.x][location.y] = location.type
    })
    return aMap
}

function generateLocationDisplay() {
    if (typeof adventureMap[player["P"].playerX] == "undefined" || typeof adventureMap[player["P"].playerX][player["P"].playerY] == "undefined") {
        return [
            ["display-text", "Outside Map"]
        ]
    }

    var location = adventureMap[player["P"].playerX][player["P"].playerY]
    if (location == "path") {
        return [
            ["display-text", "There's nothing interesting here"]
        ]
    } else if (location == "shop") {
        return [
            ["display-text", "Welcome to the shop"],
            "blank",
            ["row", [
                ["buyable", "shop-sword"]
            ]]
        ]
    } else if (location == "forest") {
        return [
            ["display-text", "Welcome to the forest"],
            "blank",
            ["clickable", "troubles"],
            "blank",
            ["bar", "troubles-bar"],
            "blank",
            "blank",
            ["row",
                [
                    ["column", [
                        ["display-text", "YOU"],
                        ["display-text", "HP: " + format(player["P"].currentHealth) + "/" + format(player["P"].maxHealth)],
                        ["display-text", "DMG: " + format(player["P"].damage)],
                        ["display-text", "Will attack in " + format(player["P"].attackTimer.div(1000)) + "s"]
                    ]],
                    ["blank", ["200px", "10px"]],
                    ["column", [
                        ["display-text", "ENEMY"],
                        ["display-text", "HP: " + format(enemy.HP) ],
                        ["display-text", "DMG: " + format(enemy.DMG) ],
                        ["display-text", "Will attack in " + format(enemy.ATK.div(1000)) + "s" ]
                    ]]
                ]
            ]
        ]
    }
    return [
        ["display-text", "Outside Map"]
    ]
}

function spawnEnemy() {
    enemy = {
        HP: new Decimal(10),
        DMG: new Decimal(1),
        ATK: new Decimal(10000),
    }
}

function playerAttack() {
    enemy.HP = enemy.HP.sub(player["P"].damage)
    if (enemy.HP.lte(0)) {
        player["P"].fighting = false
        player["P"].lookingForTroubles = true
        player["P"].lookingForTroublesTimer = new Decimal(0)

        generateLoot()
    }
}

function enemyAttack() {
    player["P"].currentHealth = player["P"].currentHealth.sub(enemy.DMG)
    if (player["P"].currentHealth.lte(0)) {
        player["P"].fighting = false
        player["P"].lookingForTroubles = false
        player["P"].lookingForTroublesTimer = new Decimal(0)
    }
}

function generateLoot() {
    player["P"].points = player["P"].points.add(1).add(player["P"].INT)
    player.points = player.points.add(1)
}