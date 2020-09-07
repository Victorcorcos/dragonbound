// The following function should be executed for each page on the Dragonbound shop
// fullfill(items)

// The possible keys for the items objects
['name', 'attack', 'defense', 'dig', 'life', 'delay', 'popularity', 'delay_item', 'popularity', 'shield', 'price_cash', 'price_gold']
['attack', 'delay', 'delay_item', 'dig', 'defense', 'life']

var iconsToStatus = {
  stat_icon_atk: 'attack',
  stat_icon_def: 'defense',
  stat_icon_dig: 'dig',
  stat_icon_life: 'life',
  stat_icon_time: 'delay',
  stat_icon_item: 'delay_item',
  stat_icon_pop: 'popularity',
  stat_icon_shld: 'shield',
}

var heads = []
var bodies = []
var glasses = []
var flags = []

// The code to fullfill the items,
// Usage: fullfill(heads) on each page of head items
// Usage2: fullfill(bodies) on each page of body items
function fullfill (items) {
  Array.from($('#shop_items').children()).forEach(function (item) {
    var currentItem = {}

    var name = $('#' + item.id + ' .shop_item_name.blackShadow').text().trim()
    currentItem['name'] = name

    Array.from($('#' + item.id + ' .shop_item_stat')).forEach(function (element) {
      var icon = element.children[0].className.split(' ')[1]
      var status = iconsToStatus[icon]
      var value = Number(element.children[1].className.split(' ')[2][9] + element.children[2].className.split(' ')[2][9])

      currentItem[status] = value
    })

    items.push(currentItem)
  })
}

// After fullfilling heads, bodies, glasses and flags...

function fillUndefineds (items) {
  var statuses = ['name', 'attack', 'defense', 'dig', 'life', 'delay', 'popularity', 'delay_item', 'popularity', 'shield']
  
  items.forEach(function (item) {
    statuses.forEach(function (status) {
      if (item[status] === undefined) {
        item[status] = 0
      }
    })
  })
}

[heads, bodies, glasses, flags].forEach(function (items) {
  fillUndefineds(items)
})


// You can also sort the items based on the following criterias...
// Usage: sortItems(heads, ['attack', 'defense', 'dig', 'life'])
// Usage: sortItems(bodies, ['defense', 'dig', 'life', 'attack'])
// Usage: sortItems(glasses, ['attack', 'defense', 'dig', 'life'])
// Usage: sortItems(flags, ['attack', 'defense', 'dig', 'life'])

function sortItems (items, criterias) {
  items.sort(function (item1, item2) {
    for (i = 0; i < criterias.length; i++) {
      if (item1[criterias[i]] < item2[criterias[i]]) return 1
      if (item1[criterias[i]] > item2[criterias[i]]) return -1
    }
  })
}


