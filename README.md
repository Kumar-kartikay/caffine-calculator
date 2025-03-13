# Caffeine Survival Calculator

A modern, scientifically-informed web application that helps users calculate their ideal caffeine intake based on personal factors. This calculator takes into account body weight, hours awake, tolerance level, and how many more hours you need to stay alert.

🔗 **[Live Demo: Caffeine Survival Calculator](https://caffine-calculator.vercel.app/)**

## Features

- **Personalized Caffeine Calculation**: Tailored recommendations based on:
  - Body weight (kg/lb)
  - Hours already awake
  - Hours you need to survive
  - Personal caffeine tolerance

- **Multiple Caffeine Sources**: Choose from various common sources:
  - Coffee (240 ml / 8 oz)
  - Espresso (30 ml / 1 oz)
  - Energy Drinks (473 ml / 16 oz)
  - Cola (355 ml / 12 oz)
  - Black Tea (240 ml / 8 oz)

- **Safety Information**: Warnings and safety recommendations based on FDA guidelines

- **Measurement Options**: Toggle between metric (ml) and imperial (oz) units
  - Default to metric for Indian standards

- **Historical Data**: Track your caffeine intake over time with:
  - Detailed history log
  - Data visualization with charts
  - Trend analysis of your caffeine needs

- **Export Feature**: Export your calculation results as a text file

- **Responsive Design**: Fully responsive UI that works on mobile, tablet, and desktop

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Components**: Shadcn UI component library
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Data Storage**: Local storage for calculation history
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Deployment**: Vercel

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/caffeine-survival-calculator.git

# Navigate to the project directory
cd caffeine-survival-calculator

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage Guide

1. **Enter Your Details:**
   - Input your weight and select the unit (kg/lb)
   - Specify how many hours you've been awake
   - Enter how many more hours you need to stay alert
   - Select your caffeine tolerance level

2. **View Recommendations:**
   - See your total recommended caffeine intake in mg
   - Browse different caffeine source options
   - Check how many servings of each source you would need

3. **Track History:**
   - Click the "History" button in the navigation
   - View your past calculations
   - Analyze trends and patterns in your caffeine needs

4. **Export Your Results:**
   - Click "Export Results" to download your calculation as a text file

## How Calculations Work

The application uses a scientifically-informed algorithm that considers:

- **Base Caffeine Needs**: Standard amount based on hours to survive
- **Weight-Based Adjustment**: Personalized based on body weight
- **Sleep Deprivation Factor**: Increased needs based on how long you've been awake
- **Tolerance Adjustment**: Modified based on your regular caffeine consumption

## Project Structure

```
caffeine-survival-calculator/
├── app/
│   ├── history/        # History page
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── CalculatorForm.tsx       # Input form component
│   ├── History.tsx              # History component (unused)
│   ├── HistoryVisualization.tsx # Charts for history page
│   ├── Results.tsx              # Results display component
│   └── ui/                      # UI components from shadcn
├── lib/
│   └── calculateCaffeine.ts     # Core calculation logic
├── public/              # Static assets
├── README.md            # Project documentation
└── package.json         # Dependencies and scripts
```

## Development

### Building for Production

```bash
npm run build
```

### Linting

```bash
npm run lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shadcn UI for the beautiful component library
- Next.js team for the fantastic framework
- FDA for caffeine safety guidelines

---

Built with Next.js 15 and Shadcn UI. For vibes only. ☕
