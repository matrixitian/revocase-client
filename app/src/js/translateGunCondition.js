module.exports = function getCondition(shorthand) {
  const gunCondition = [
    'Factory New',
    'Minimal Wear',
    'Field-Tested',
    'Well-Worn',
    'Battle-Scarred'
  ]
  
  const gunConditionShorthand = [
    'FN', 'MW', 'FT', 'WW', 'BS'
  ]

  const index = gunConditionShorthand.indexOf(shorthand)

  return gunCondition[index]
}