function loop() {
    for(let name in Game.creeps) {
        const creep = Game.creeps[name]

        setWorkingState(creep)
        
        if(creep.memory.working) {
            switch(creep.memory.role) {
                case 'harvester': 
                    deliverEnergyToSpawn(creep)
                    break
                case 'upgrader':
                    upgradeRoomController(creep)
                    break
            }
        } else {
            harvestEnergy(creep)
        }
    }

    const deadCreeps = getListOfDeadCreeps()
    const creepToRessurect = chooseCreepToSpawn(deadCreeps)
    if(creepToRessurect) spawnCreep(creepToRessurect)
}

function setWorkingState(creep) {
    if(creep.memory.working) {
        if(creep.carry.energy === 0) creep.memory.working = false
    } else {
        if(creep.carry.energy === creep.carryCapacity) creep.memory.working = true
    }
}

function harvestEnergy(creep) {
    const energySource = creep.pos.findClosestByPath(FIND_SOURCES)
    const result = creep.harvest(energySource)

    if(result === ERR_NOT_IN_RANGE) {
        creep.moveTo(energySource)
    }
}

function deliverEnergyToSpawn(creep) {
    const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS)
    const result = creep.transfer(spawn, RESOURCE_ENERGY)

    if(result === ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn)
    }
}

function upgradeRoomController(creep) {
    const controller = creep.room.controller
    const result = creep.upgradeController(controller)

    if(result === ERR_NOT_IN_RANGE) {
        creep.moveTo(controller)
    }
}

function getListOfDeadCreeps() {
    const deadCreeps = []

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            const creep = Memory.creeps[name]

            creep.name = name
            deadCreeps.push(creep)
        }
    }

    return deadCreeps
}

function chooseCreepToSpawn(creeps) {
    const creepRoles = creeps.reduce((roles, creep, i) => {
        if(!roles.hasOwnProperty(creep.role)) roles[creep.role] = i

        return roles
    }, {})

    if(creepRoles.hasOwnProperty('harvester')) return creeps[creepRoles.harvester]
    else if(creepRoles.hasOwnProperty('upgrader')) return creeps[creepRoles.upgrader]
}

function spawnCreep(creep) {
    const spawn = Game.spawns.Spawn1
    spawn.spawnCreep([WORK, CARRY, MOVE], creep.name, {memory: creep})
}

module.exports = { loop }