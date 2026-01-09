# Real Estate Calculator Pro - Testing Guide

## 🚀 Quick Start

The Real Estate Calculator Pro is now live and accessible from the landing page!

### Access Points

1. **From Landing Page**:
   - Navigate to the home page (`/en` or `/he`)
   - Scroll to the "Our Financial Calculators" section
   - Click "Try Calculator" on the "Real Estate Investment Calculator" card

2. **Direct URLs**:
   - English: `/en/real-estate-pro`
   - Hebrew: `/he/real-estate-pro`

## ✅ Testing Checklist

### Basic Functionality
- [ ] Page loads without errors
- [ ] All sliders are responsive and update values
- [ ] Chart renders correctly
- [ ] Three engines display with progress bars
- [ ] Year 1 results show correct calculations
- [ ] Dark mode toggle works

### Input Testing
- [ ] Purchase Price slider (50K - 300K)
- [ ] Down Payment slider (0% - 100%)
- [ ] Monthly Rent slider (500 - 3000)
- [ ] Appreciation Rate slider (0% - 10%)
- [ ] Rent Growth slider (0% - 6%)
- [ ] Below Market % slider (0% - 40%)

### Advanced Settings
- [ ] Click "Advanced Settings" - panel expands
- [ ] Mortgage Rate slider (4% - 12%)
- [ ] Mortgage Term slider (10 - 30 years)
- [ ] Vacancy Rate slider (0% - 20%)
- [ ] Insurance + Tax input (0 - 500)
- [ ] Property Management slider (0% - 15%)
- [ ] Maintenance slider (0% - 5%)

### Chart Functionality
- [ ] Chart displays 4 lines (property value, equity, mortgage, rent)
- [ ] Dual Y-axis (left for values, right for rent)
- [ ] Hover tooltip shows detailed information
- [ ] Reference line at mortgage payoff year
- [ ] Chart updates when sliders change

### URL Sharing
- [ ] Click "Share Calculation" button
- [ ] "Link Copied!" message appears
- [ ] Paste URL in new tab - inputs are restored
- [ ] URL contains short parameter keys (pp, mr, ar, etc.)

### Bilingual Support
- [ ] Switch to Hebrew (`/he/real-estate-pro`)
- [ ] All text displays in Hebrew
- [ ] Layout is RTL (right-to-left)
- [ ] Numbers and currency format correctly
- [ ] Switch back to English works

### Help System
- [ ] Click any help button (?) next to sliders
- [ ] Drawer opens with title and description
- [ ] Close button works
- [ ] Click outside drawer to close

### Responsive Design
- [ ] Desktop view (1920px+) - all columns visible
- [ ] Laptop view (1024px) - proper grid layout
- [ ] Tablet view (768px) - stacked layout
- [ ] Mobile view (375px) - single column, readable

## 🧪 Test Scenarios

### Scenario 1: Default Values (Indianapolis Example)
**Inputs:**
- Purchase Price: $85,000
- Down Payment: 25%
- Monthly Rent: $1,100
- Appreciation: 4%
- Rent Growth: 3%
- Mortgage Rate: 7.5%
- Term: 30 years

**Expected Results:**
- Down Payment: $21,250
- Monthly Mortgage: ~$446
- Net Monthly (with leverage): ~$366
- Year 1 ROI (with leverage): ~32-35%
- Year 1 ROI (without leverage): ~15%
- Property Value at Year 30: ~$275,000

### Scenario 2: High Leverage
**Inputs:**
- Purchase Price: $100,000
- Down Payment: 10% ($10,000)
- Monthly Rent: $1,200
- Appreciation: 5%
- Rent Growth: 3%

**Expected:**
- Higher ROI percentage (more leverage)
- Lower monthly cash flow (higher mortgage)
- Faster equity building

### Scenario 3: Below Market Purchase
**Inputs:**
- Purchase Price: $85,000
- Below Market: 30%
- (Market Value should show ~$121,428)
- Instant Equity: ~$36,428

**Expected:**
- Market Value > Purchase Price
- Instant equity displayed
- Higher starting equity percentage

### Scenario 4: All Cash (No Leverage)
**Inputs:**
- Down Payment: 100%

**Expected:**
- Mortgage Balance: $0
- Monthly Mortgage: $0
- Higher monthly cash flow
- Lower ROI percentage
- Compare with/without leverage cards

## 🐛 Common Issues to Check

### Performance
- [ ] Slider dragging is smooth (no lag)
- [ ] Chart updates without stuttering
- [ ] No console errors
- [ ] Page loads in < 3 seconds

### Calculations
- [ ] Three engines sum to 100%
- [ ] Mortgage balance reaches $0 at term end
- [ ] Equity = Property Value - Mortgage Balance
- [ ] Cash flow = Rent - Expenses - Mortgage
- [ ] ROI calculations match manual calculations

### UI/UX
- [ ] All text is readable (contrast)
- [ ] Buttons have hover states
- [ ] Loading states (if any) work
- [ ] No layout shifts
- [ ] Icons render correctly

## 📊 Validation Tests

### Math Verification
Use a financial calculator to verify:
1. Monthly mortgage payment formula
2. Remaining balance calculation
3. Compound growth (appreciation & rent)
4. ROI percentages

### Edge Cases
- [ ] 0% down payment
- [ ] 100% down payment
- [ ] 0% appreciation
- [ ] 0% rent growth
- [ ] Maximum values on all sliders
- [ ] Minimum values on all sliders

## 🎯 Success Criteria

✅ **Must Have:**
- All calculations are accurate
- Chart displays correctly
- URL sharing works
- No console errors
- Responsive on all devices

✅ **Should Have:**
- Smooth performance
- Clear help text
- Intuitive UI
- Proper dark mode

✅ **Nice to Have:**
- Fast load times
- Smooth animations
- Detailed tooltips

## 📝 Reporting Issues

If you find any issues, please note:
1. **What you did** (steps to reproduce)
2. **What you expected** (expected behavior)
3. **What happened** (actual behavior)
4. **Browser & device** (Chrome/Safari, desktop/mobile)
5. **Screenshots** (if applicable)

## 🎉 Ready to Test!

The calculator is fully functional and ready for testing. Start with the basic functionality checklist, then move through the test scenarios to ensure everything works as expected.

**Pro Tip:** Test in both light and dark modes, and try different browser sizes to ensure responsive design works correctly.

