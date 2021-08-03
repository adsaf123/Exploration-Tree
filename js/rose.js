addNode("N", {
    row: 0,
    name: "North",
    position: 1,
    branches: ["L"],

    canClick() {
        if (typeof adventureMap[player["P"].playerX] == "undefined") {
            return false
        } else if (typeof adventureMap[player["P"].playerX][player["P"].playerY - 1] == "undefined") {
            return false
        } else if (adventureMap[player["P"].playerX][player["P"].playerY - 1] == "blank") {
            return false
        }

        return true
    },

    onClick() {
        if (!this.canClick()) return 

        player["P"].playerY -= 1
        player["M"].drawnGrid = false

        player["P"].lookingForTroubles = false
        player["P"].lookingForTroublesTimer = 0
        player["P"].fighting = false
    },

    tooltip() {
        return "Click here to travel this way"
    },

    tooltipLocked() {
        return "You can't go this way"
    },

})

addNode("E", {
    row: 1,
    name: "East",
    position: 2,
    branches: ["L"],

    canClick() {
        if (typeof adventureMap[player["P"].playerX + 1] == "undefined") {
            return false
        } else if (typeof adventureMap[player["P"].playerX + 1][player["P"].playerY] == "undefined") {
            return false
        } else if (adventureMap[player["P"].playerX + 1][player["P"].playerY] == "blank") {
            return false
        }

        return true
    },

    onClick() {
        if (!this.canClick()) return 

        player["P"].playerX += 1
        player["M"].drawnGrid = false

        player["P"].lookingForTroubles = false
        player["P"].lookingForTroublesTimer = 0
        player["P"].fighting = false
    },

    tooltip() {
        return "Click here to travel this way"
    },

    tooltipLocked() {
        return "You can't go this way"
    },
})

addNode("S", {
    row: 2,
    name: "South",
    position: 1,
    branches: ["L"],

    canClick() {
        if (typeof adventureMap[player["P"].playerX] == "undefined") {
            return false
        } else if (typeof adventureMap[player["P"].playerX][player["P"].playerY + 1] == "undefined") {
            return false
        } else if (adventureMap[player["P"].playerX][player["P"].playerY + 1] == "blank") {
            return false
        }

        return true
    },

    onClick() {
        if (!this.canClick()) return 

        player["P"].playerY += 1
        player["M"].drawnGrid = false

        player["P"].lookingForTroubles = false
        player["P"].lookingForTroublesTimer = 0
        player["P"].fighting = false
    },

    tooltip() {
        return "Click here to travel this way"
    },

    tooltipLocked() {
        return "You can't go this way"
    },
})

addNode("W", {
    row: 1,
    name: "West",
    position: 0,
    branches: ["L"],

    canClick() {
        if (typeof adventureMap[player["P"].playerX - 1] == "undefined") {
            return false
        } else if (typeof adventureMap[player["P"].playerX - 1][player["P"].playerY] == "undefined") {
            return false
        } else if (adventureMap[player["P"].playerX - 1][player["P"].playerY] == "blank") {
            return false
        }

        return true
    },

    onClick() {
        if (!this.canClick()) return 

        player["P"].playerX -= 1
        player["M"].drawnGrid = false

        player["P"].lookingForTroubles = false
        player["P"].lookingForTroublesTimer = 0
        player["P"].fighting = false
    },

    tooltip() {
        return "Click here to travel this way"
    },

    tooltipLocked() {
        return "You can't go this way"
    },
})