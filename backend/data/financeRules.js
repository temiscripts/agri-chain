const FOOD_CROPS = new Set(['rice', 'maize', 'cassava', 'yam', 'sorghum', 'millet', 'cowpea', 'beans', 'groundnut'])
const STAPLE_CROPS = new Set(['rice', 'maize', 'cassava', 'yam'])

const PROGRAMMES = [
  {
    id: 'boa_loan',
    name: 'Bank of Agriculture (BoA) Smallholder Loan',
    maxAmount: 500000,
    interestRate: '9% per annum',
    eligible: ({ farmSize, crop }) => farmSize >= 0.5 && FOOD_CROPS.has(crop),
    nextSteps: 'Visit your nearest BoA branch with your BVN, farm coordinates, and a passport photo. Apply for the Smallholder Farmers Loan scheme.',
  },
  {
    id: 'adf_grant',
    name: 'Agricultural Development Fund (ADF) Grant',
    maxAmount: 150000,
    interestRate: 'Grant — no repayment',
    eligible: ({ farmSize, crop }) => farmSize <= 5 && STAPLE_CROPS.has(crop),
    nextSteps: 'Contact your State Agricultural Development Programme (ADP) office to apply. Bring proof of land ownership or tenancy agreement.',
  },
  {
    id: 'cooperative_credit',
    name: 'Cooperative Society Credit',
    maxAmount: null,
    amountLabel: 'amount varies by cooperative',
    interestRate: 'Varies by cooperative',
    eligible: () => true,
    nextSteps: 'Register with your local farmers\' cooperative society. Members can access credit at low interest rates, shared inputs, and collective bargaining for market prices.',
  },
]

function evaluate({ farmSize, crop }) {
  const eligible = PROGRAMMES.filter((p) => p.eligible({ farmSize, crop }))
  return eligible.map(({ id, name, maxAmount, amountLabel, interestRate, nextSteps }) => ({
    id,
    name,
    maxAmount,
    amountLabel,
    interestRate,
    nextSteps,
  }))
}

module.exports = { evaluate }
