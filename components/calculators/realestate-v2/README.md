# Real Estate Investment Calculator V2

A clean, maintainable implementation of a real estate investment calculator demonstrating the "3 engines of profit" concept with monthly granularity over 30 years.

## 🎯 Features

- ✅ **Monthly granularity**: 361 data points (month 0-360) with sampling for optimal rendering
- ✅ **URL parameter sharing**: Share calculations via URL with short parameter keys
- ✅ **Performance optimized**: O(n) calculations with memoization
- ✅ **Clean architecture**: Separation of concerns with pure functions
- ✅ **Dual Y-axis chart**: Property values and rent on separate scales
- ✅ **Three engines breakdown**: Cash flow, appreciation, and principal paydown
- ✅ **Bilingual support**: English and Hebrew translations
- ✅ **Dark mode**: Full dark mode support
- ✅ **Responsive design**: Mobile-first approach

## 📁 Project Structure

```
components/calculators/realestate-v2/
├── types.ts                          # TypeScript interfaces & constants
├── utils/
│   ├── calculations.ts               # Pure calculation functions (O(n))
│   └── sliderConfigs.ts             # Slider configurations
├── hooks/
│   ├── useCalculations.ts           # Memoized calculations hook
│   └── useUrlState.ts               # URL state management
├── components/
│   ├── InputPanel.tsx               # All input sliders
│   ├── ResultsPanel.tsx             # Year 1 results & 3 engines
│   ├── ProjectionChart.tsx          # 30-year dual Y-axis chart
│   └── ShareButton.tsx              # URL sharing button
├── RealEstateCalculatorV2.tsx       # Main container component
├── index.ts                         # Public exports
└── README.md                        # This file

lib/translations/
└── realestateV2.ts                  # Translations (EN/HE)

app/[lang]/realestate2/
└── page.tsx                         # Next.js page route
```

## 🚀 Usage

### Accessing the Calculator

Navigate to:
- English: `/en/realestate2`
- Hebrew: `/he/realestate2`

### Sharing Calculations

Click the "Share Calculation" button to copy a URL with all current inputs encoded as query parameters.

Example URL:
```
/en/realestate2?pp=85000&mr=1100&ar=4&rg=3&dp=25&vr=8&it=200&mi=7.5&my=30
```

## 🔧 Technical Details

### Performance Optimizations

1. **Incremental Calculations**: Instead of recalculating from scratch each month, we use running balances
2. **Pre-computed Constants**: Growth factors calculated once before the loop
3. **Memoization**: React.useMemo prevents unnecessary recalculations
4. **Chart Sampling**: Display ~120 points instead of 361 for smoother rendering
5. **Disabled Animations**: Chart animations disabled for better slider performance

### Calculation Flow

```
User Input → useCalculations Hook → Pure Functions → Memoized Results
                                          ↓
                            generateProjectionData()
                                          ↓
                        361 monthly data points
                                          ↓
                            sampleChartData()
                                          ↓
                        ~120 display points
```

### Key Calculations

**Monthly Mortgage Payment**:
```
M = P * [r(1+r)^n] / [(1+r)^n - 1]
```

**Three Engines (Year 1)**:
1. **Cash Flow**: Rent - Expenses - Mortgage
2. **Appreciation**: Property Value × Appreciation Rate
3. **Principal Paydown**: Mortgage payments applied to principal

**ROI with Leverage**:
```
ROI = (Cash Flow + Appreciation + Principal Paydown) / Down Payment × 100
```

## 🎨 Styling

Uses Tailwind CSS with the project's design system:
- Gradient backgrounds with backdrop blur
- Consistent color palette (emerald, amber, sky, violet)
- RTL support for Hebrew
- Dark mode with proper contrast

## 📊 Default Values

Based on Indianapolis market example:
- Purchase Price: $85,000
- Down Payment: 25% ($21,250)
- Monthly Rent: $1,100
- Appreciation: 4% annually
- Rent Growth: 3% annually
- Mortgage Rate: 7.5%
- Mortgage Term: 30 years
- Vacancy Rate: 8%
- Insurance + Tax: $200/month

## 🧪 Testing

To verify calculations, compare Year 1 results:
- Net monthly cash flow (with leverage)
- Annual cash flow
- ROI percentage
- Three engines breakdown percentages

Expected Year 1 ROI with default values: ~32-35%

## 🔮 Future Enhancements

Potential additions (not implemented):
- [ ] Preset scenarios (conservative, moderate, aggressive)
- [ ] PDF export
- [ ] Multiple property comparison
- [ ] Tax implications calculator
- [ ] Refinancing scenarios
- [ ] Property appreciation map integration

## 📝 Notes

- No S&P 500 comparison (by design - keeping focus on real estate)
- Monthly granularity provides accurate compound growth modeling
- All calculations are client-side for instant feedback
- URL state updates are debounced (300ms) to prevent excessive history entries

## 🤝 Contributing

When making changes:
1. Keep pure functions in `utils/calculations.ts`
2. Use TypeScript interfaces from `types.ts`
3. Follow the existing component structure
4. Maintain O(n) time complexity for calculations
5. Add translations for both languages
6. Test with various input combinations

## 📄 License

Part of the InvestedAI project.

