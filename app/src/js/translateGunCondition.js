module.exports = function getCondition(shorthand) {
  const gunCondition = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred'
  ]
  
  const gunConditionShorthand = [
    'fn', 'mw', 'ft', 'ww', 'bs'
  ]

  const index = gunConditionShorthand.indexOf(shorthand)

  return gunCondition[index]
}