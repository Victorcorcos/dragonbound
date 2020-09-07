// =======================================================================
// ========================== PhantomJS Exports ==========================
// =======================================================================

// Execute this on PhantomJS...
// const main = require('/Users/victor/Desktop/Extra/DragonBound/main.js')

const clothes = require('/Users/victor/Desktop/Extra/DragonBound/Clothes/clothes_lib.js')
var heads = clothes.heads
var bodies = clothes.bodies
var glasses = clothes.glasses
var flags = clothes.flags

exports.findItems = findItems // Greedy Main Algorithmn
exports.findItems2 = findItems2 // Bruteforce Main Algorithmn
exports.findPages = findPages // Find Avatar Shop Page Number (not so precise because some items are deleted)

// =======================================================================
// =======================================================================
// =======================================================================

Object.defineProperty(Array.prototype, 'combinations', {
  value: function () {
    if (this == null) {
      throw new TypeError('Array.prototype.combinations called on null or undefined')
    }

    var i, j, subresult
    var result = []
    var length = this.length
    var combinations = Math.pow(2, length)

    for (i = 0; i < combinations;  i++) {
      subresult = []
      
      for (j = 0; j < length; j++) {
        // & is bitwise AND
        if ((i & Math.pow(2, j))) {
          subresult.push(this[j])
        }
      }
      result.push(subresult)
    }
    return result
  }
})

// Find the Page Number where the item is located on the Avatar Shop
// Usage: findPage(heads, 'Indian Fighter')
function findPage (items, name) {
  return Math.trunc(items.findIndex(function (item) { return item.name === name }) / 9) + 1
}

// Find the Pages Numbers where the all the items are located on the Avatar Shop
// names: The array of item names [headName, bodyName, glassName, flagName]
// Usage: findPages(['Pikachu Costume', 'Matrix', 'Fire Phoenix', 'Neo Observador'])
function findPages (names) {
  var pages = []

  var headPage  = Math.trunc(heads.findIndex(function (item) { return item.name === names[0] }) / 9) + 1
  var bodyPage  = Math.trunc(bodies.findIndex(function (item) { return item.name === names[1] }) / 9) + 1
  var glassPage = Math.trunc(glasses.findIndex(function (item) { return item.name === names[2] }) / 9) + 1
  var flagPage  = Math.trunc(flags.findIndex(function (item) { return item.name === names[3] }) / 9) + 1

  return [headPage, bodyPage, glassPage, flagPage]
}

// Sort the items based on the following criterias...
// The first criteria is the main sort, the next ones are considered as tiebreaker criterias
// Usage: sortItems(heads, ['attack', 'defense', 'dig', 'life'])
function sortItems (items, criterias) {
  items.sort(function (item1, item2) {
    for (i = 0; i < criterias.length; i++) {
      if (item1[criterias[i]] < item2[criterias[i]]) return 1
      if (item1[criterias[i]] > item2[criterias[i]]) return -1
    }
  })
}

// Sum array elements
function sum (numbers) {
  const add = function (a, b) { return a + b }
  return numbers.reduce(add, 0)
}

// Find the best item considering the sum of the considered item statuses values
// Usage: bestItem(heads, ['attack', 'defense'])
// Usage: bestItem(heads, ['attack', 'defense', 'dig', 'life', 'delay', 'delay_item', 'popularity'])
function bestItem (items, statuses) {
  return items.reduce(function (item1, item2) {
    var sum1 = sum(statuses.map(function (status) {
      return item1[status]
    }))
    var sum2 = sum(statuses.map(function (status) {
      return item2[status]
    }))
    return (sum1 > sum2 ? item1 : item2)
  })
}
// Possible to sort the above function? Will be amazing


// =======================================================================
// ========== Main Algorithmns to find the Best Avatar Shop Set ==========
// =======================================================================

// Usage 1:
// findItems(['attack', 'defense'])
// findItems(['attack', 'defense', 'life', 'dig'])
// findItems(['attack', 'delay', 'delay_item', 'defense'])
// findItems(['attack', 'delay', 'delay_item', 'dig', 'defense', 'life'])
// findItems(['attack', 'delay', 'delay_item', 'defense', 'life'])

// Usage 2:
// findItems2(['attack', 'defense'])
// findItems2(['attack', 'defense', 'life', 'dig'])
// findItems2(['attack', 'delay', 'delay_item', 'defense'])
// findItems2(['attack', 'delay', 'delay_item', 'dig', 'defense', 'life'])
// findItems2(['attack', 'delay', 'delay_item', 'defense', 'life'])


// Caching Best Items Method
// bestItem(heads, ['attack'])
// bestItem(bodies, ['attack', 'defense'])

cachedBestItems = {
  heads: {}, // heads: { "attack,defense": { name: "Skeleton", ... } }
  bodies: {},
  glasses: {},
  flags: {}
}

function accessBestItem (clothType, statuses) {
  var statuses = statuses.sort()
  var statusesKey = statuses.join(',')

  if (cachedBestItems[clothType][statusesKey]) {
    return cachedBestItems[clothType][statusesKey]
  }

  cachedBestItems[clothType][statusesKey] = bestItem(window[clothType], statuses)
  return cachedBestItems[clothType][statusesKey]
}

// Greedy Version
function findItems (statuses) {
  var resultSet = []
  var head = {}
  var body = {}
  var glass = {}
  var flag = {}
  var resultStats = {}
  var allResultStats = []

  var combinations = statuses.combinations()
  var length = combinations.length

  for (var i=0; i < length; ++i) {
    head = accessBestItem('heads', combinations[i])
    for (var j=0; j < length; ++j) {
      body = accessBestItem('bodies', combinations[j])
      for (var k=0; k < length; ++k) {
        glass = accessBestItem('glasses', combinations[k])
        for (var l=0; l < length; ++l) {
          flag = accessBestItem('flags', combinations[l])
          resultSet.push(head)
          resultSet.push(body)
          resultSet.push(glass)
          resultSet.push(flag)

          var resultStats = {
            'names': [],
            'attack': 0,
            'popularity': 0,
            'defense': 0,
            'dig': 0,
            'life': 0,
            'delay': 0,
            'delay_item': 0,
            'shield': 0
          }
          resultSet.forEach(function (item) {
            resultStats['names'] = resultStats['names'].concat(item['name'])
            resultStats['attack'] = Math.min(50, resultStats['attack'] + item['attack'])
            resultStats['popularity'] = Math.min(50, resultStats['popularity'] + item['popularity'])
            resultStats['defense'] = Math.min(50, resultStats['defense'] + item['defense'])
            resultStats['dig'] = Math.min(50, resultStats['dig'] + item['dig'])
            resultStats['life'] = Math.min(50, resultStats['life'] + item['life'])
            resultStats['delay'] = Math.min(50, resultStats['delay'] + item['delay'])
            resultStats['delay_item'] = Math.min(50, resultStats['delay_item'] + item['delay_item'])
            resultStats['shield'] = Math.min(50, resultStats['shield'] + item['shield'])
          })
          allResultStats.push(resultStats)

          resultSet = []
        }
      }
    }
  }

  return bestItem(allResultStats, statuses)
}

// Bruteforce Version
function findItems2 (statuses) {
  var resultSet = []
  var head = {}
  var body = {}
  var glass = {}
  var flag = {}
  var resultStats = {}
  var allResultStats = []

  var headsLength = heads.length
  var bodiesLength = bodies.length
  var glassesLength = glasses.length
  var flagsLength = flags.length

  for (var i=0; i < headsLength; ++i) {
    head = heads[i]
    for (var j=0; j < bodiesLength; ++j) {
      body = bodies[j]
      for (var k=0; k < glassesLength; ++k) {
        glass = glasses[k]
        for (var l=0; l < flagsLength; ++l) {
          flag = flags[l]
          resultSet.push(head)
          resultSet.push(body)
          resultSet.push(glass)
          resultSet.push(flag)

          var resultStats = {
            'names': [],
            'attack': 0,
            'popularity': 0,
            'defense': 0,
            'dig': 0,
            'life': 0,
            'delay': 0,
            'delay_item': 0,
            'shield': 0
          }
          resultSet.forEach(function (item) {
            resultStats['names'] = resultStats['names'].concat(item['name'])
            resultStats['attack'] = Math.min(50, resultStats['attack'] + item['attack'])
            resultStats['popularity'] = Math.min(50, resultStats['popularity'] + item['popularity'])
            resultStats['defense'] = Math.min(50, resultStats['defense'] + item['defense'])
            resultStats['dig'] = Math.min(50, resultStats['dig'] + item['dig'])
            resultStats['life'] = Math.min(50, resultStats['life'] + item['life'])
            resultStats['delay'] = Math.min(50, resultStats['delay'] + item['delay'])
            resultStats['delay_item'] = Math.min(50, resultStats['delay_item'] + item['delay_item'])
            resultStats['shield'] = Math.min(50, resultStats['shield'] + item['shield'])
          })
          allResultStats.push(resultStats)

          resultSet = []
        }
      }
    }
  }

  return bestItem(allResultStats, statuses)
}
